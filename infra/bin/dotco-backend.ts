#!/usr/bin/env node
import { App, Stack, Tags } from "aws-cdk-lib";
import { DotCoBackendStack } from "../lib/dotco-backend-stack.js";
import { DotCoMediaStack } from "../lib/dotco-media-stack.js";

const app = new App();
const envName = app.node.tryGetContext("envName") || process.env.DOTCO_ENV || "dev";
if (!["dev", "production"].includes(envName)) {
  throw new Error("DOTCO_ENV/context envName must be dev or production.");
}

const region = process.env.DOTCO_AWS_REGION || "ap-south-1";
const account = process.env.CDK_DEFAULT_ACCOUNT;

const backendStack = new DotCoBackendStack(app, `dotco-${envName}-backend`, {
  envName,
  reservedConcurrency: Number(app.node.tryGetContext("reservedConcurrency") || process.env.DOTCO_LAMBDA_RESERVED_CONCURRENCY || 0) || undefined,
  env: { account, region }
});

const stacks: Stack[] = [backendStack];
if (envName === "production") {
  stacks.push(new DotCoMediaStack(app, "dotco-production-media", {
    certificateArn: process.env.DOTCO_MEDIA_CERTIFICATE_ARN,
    mediaDomainName: process.env.DOTCO_MEDIA_CERTIFICATE_ARN ? "media.cothecoconutcompany.com" : undefined,
    env: { account, region },
    terminationProtection: true,
  }));
}

for (const stack of stacks) {
  Tags.of(stack).add("Application", "dotco");
  Tags.of(stack).add("Project", "dotco");
  Tags.of(stack).add("Environment", envName);
  Tags.of(stack).add("CostCenter", "dotco-platform");
  Tags.of(stack).add("ManagedBy", "cdk");
  Tags.of(stack).add("Owner", "dotco-operations");
  Tags.of(stack).add("Purpose", stack.stackName.endsWith("media") ? "website-media-delivery" : "application-backend");
}
