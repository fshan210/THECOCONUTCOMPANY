import test from "node:test";
import assert from "node:assert/strict";
import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { DotCoBackendStack } from "../lib/dotco-backend-stack.js";

test("stack creates Cognito, DynamoDB and Lambda resources", () => {
  const app = new App();
  const stack = new DotCoBackendStack(app, "test-stack", { envName: "dev", env: { region: "ap-south-1" } });
  const template = Template.fromStack(stack);
  template.resourceCountIs("AWS::Cognito::UserPool", 1);
  template.resourceCountIs("AWS::DynamoDB::Table", 3);
  template.resourceCountIs("AWS::Lambda::Function", 1);
  assert.ok(template.toJSON());
});

test("production stack restricts browser origins and protects durable tables", () => {
  const app = new App();
  const stack = new DotCoBackendStack(app, "production-test-stack", { envName: "production", env: { region: "ap-south-1" } });
  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::Cognito::UserPool", {
    Policies: {
      PasswordPolicy: {
        MinimumLength: 10,
        RequireSymbols: true
      }
    }
  });
  template.hasResourceProperties("AWS::DynamoDB::Table", {
    PointInTimeRecoverySpecification: { PointInTimeRecoveryEnabled: true },
    DeletionProtectionEnabled: true
  });
  template.hasResourceProperties("AWS::ApiGatewayV2::Api", {
    CorsConfiguration: {
      AllowOrigins: ["https://cothecoconutcompany.com", "https://www.cothecoconutcompany.com"]
    }
  });
});
