#!/usr/bin/env node
import { App, Tags } from "aws-cdk-lib";
import { DotCoBackendStack } from "../lib/dotco-backend-stack.js";

const app = new App();
const envName = app.node.tryGetContext("envName") || process.env.DOTCO_ENV || "dev";
if (!["dev", "production"].includes(envName)) {
  throw new Error("DOTCO_ENV/context envName must be dev or production.");
}

const region = process.env.DOTCO_AWS_REGION || "ap-south-1";
const account = process.env.CDK_DEFAULT_ACCOUNT;

const stack = new DotCoBackendStack(app, `dotco-${envName}-backend`, {
  envName,
  reservedConcurrency: Number(app.node.tryGetContext("reservedConcurrency") || process.env.DOTCO_LAMBDA_RESERVED_CONCURRENCY || 0) || undefined,
  env: { account, region }
});

Tags.of(stack).add("Application", "dotco");
Tags.of(stack).add("Project", "dotco");
Tags.of(stack).add("Environment", envName);
Tags.of(stack).add("CostCenter", "dotco-platform");
Tags.of(stack).add("ManagedBy", "cdk");
