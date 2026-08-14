import test from "node:test";
import assert from "node:assert/strict";
import { App } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { DotCoBackendStack } from "../lib/dotco-backend-stack.js";
import { DotCoMediaStack } from "../lib/dotco-media-stack.js";

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

test("media stack keeps S3 private and grants access through CloudFront OAC", () => {
  const app = new App();
  const stack = new DotCoMediaStack(app, "media-test-stack", { env: { region: "ap-south-1" } });
  const template = Template.fromStack(stack);
  template.resourceCountIs("AWS::S3::Bucket", 1);
  template.hasResourceProperties("AWS::S3::Bucket", {
    BucketEncryption: {
      ServerSideEncryptionConfiguration: [{ ServerSideEncryptionByDefault: { SSEAlgorithm: "AES256" } }]
    },
    OwnershipControls: { Rules: [{ ObjectOwnership: "BucketOwnerEnforced" }] },
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
      BlockPublicPolicy: true,
      IgnorePublicAcls: true,
      RestrictPublicBuckets: true
    },
    VersioningConfiguration: { Status: "Enabled" }
  });
  template.resourceCountIs("AWS::CloudFront::OriginAccessControl", 1);
  template.hasResourceProperties("AWS::CloudFront::Distribution", {
    DistributionConfig: {
      DefaultCacheBehavior: {
        AllowedMethods: ["GET", "HEAD"],
        ResponseHeadersPolicyId: Match.anyValue(),
        ViewerProtocolPolicy: "redirect-to-https"
      },
      HttpVersion: "http2and3",
      IPV6Enabled: true
    }
  });
  template.hasResourceProperties("AWS::CloudFront::ResponseHeadersPolicy", {
    ResponseHeadersPolicyConfig: {
      CorsConfig: {
        AccessControlAllowCredentials: false,
        AccessControlAllowHeaders: { Items: ["*"] },
        AccessControlAllowMethods: { Items: ["GET", "HEAD"] },
        AccessControlAllowOrigins: { Items: ["*"] },
        OriginOverride: true
      }
    }
  });
  template.hasResourceProperties("AWS::S3::BucketPolicy", {
    PolicyDocument: {
      Statement: Match.arrayWith([
        Match.objectLike({
          Effect: "Deny",
          Action: "s3:*",
          Condition: { Bool: { "aws:SecureTransport": "false" } }
        }),
        Match.objectLike({
          Effect: "Allow",
          Principal: { Service: "cloudfront.amazonaws.com" },
          Action: "s3:GetObject"
        })
      ])
    }
  });
});
