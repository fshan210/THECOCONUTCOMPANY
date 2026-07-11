import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  type StackProps
} from "aws-cdk-lib";
import { Alarm, ComparisonOperator, TreatMissingData } from "aws-cdk-lib/aws-cloudwatch";
import { AttributeType, BillingMode, Table, TableEncryption } from "aws-cdk-lib/aws-dynamodb";
import { AccountRecovery, OAuthScope, UserPool, VerificationEmailStyle } from "aws-cdk-lib/aws-cognito";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Architecture, Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { HttpApi, CorsHttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Construct } from "constructs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type EnvName = "dev" | "production";
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

export interface DotCoBackendStackProps extends StackProps {
  envName: EnvName;
  reservedConcurrency?: number;
}

export class DotCoBackendStack extends Stack {
  constructor(scope: Construct, id: string, props: DotCoBackendStackProps) {
    super(scope, id, props);

    const isProd = props.envName === "production";
    const prefix = `dotco-${props.envName}`;
    const removalPolicy = isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY;
    const logRetention = isProd ? RetentionDays.ONE_MONTH : RetentionDays.ONE_WEEK;

    const commerceTable = this.createDomainTable(`${prefix}-commerce`, removalPolicy, isProd);
    const contentTable = this.createDomainTable(`${prefix}-content`, removalPolicy, isProd);
    const auditTable = this.createDomainTable(`${prefix}-audit`, removalPolicy, isProd);

    const userPool = new UserPool(this, "UserPool", {
      userPoolName: `${prefix}-users`,
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      userVerification: {
        emailStyle: VerificationEmailStyle.CODE,
        emailSubject: "Verify your .CO account",
        emailBody: "Your .CO verification code is {####}"
      },
      passwordPolicy: {
        minLength: 10,
        requireDigits: true,
        requireLowercase: true,
        requireUppercase: true,
        requireSymbols: false,
        tempPasswordValidity: Duration.days(3)
      },
      standardAttributes: {
        email: { required: true, mutable: true },
        fullname: { required: false, mutable: true }
      },
      removalPolicy
    });

    const userPoolClient = userPool.addClient("WebClient", {
      userPoolClientName: `${prefix}-web`,
      authFlows: {
        userPassword: true,
        userSrp: true
      },
      oAuth: {
        flows: { authorizationCodeGrant: true },
        scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE],
        callbackUrls: props.envName === "production"
          ? ["https://cothecoconutcompany.com/auth/callback"]
          : ["http://localhost:3000/auth/callback"],
        logoutUrls: props.envName === "production"
          ? ["https://cothecoconutcompany.com/logout"]
          : ["http://localhost:3000/logout"]
      },
      preventUserExistenceErrors: true,
      accessTokenValidity: Duration.minutes(15),
      idTokenValidity: Duration.minutes(15),
      refreshTokenValidity: Duration.days(14),
      enableTokenRevocation: true,
      generateSecret: false
    });

    const apiLogGroup = new LogGroup(this, "ApiLogGroup", {
      logGroupName: `/aws/lambda/${prefix}-api`,
      retention: logRetention,
      removalPolicy
    });

    const apiFn = new NodejsFunction(this, "ApiFunction", {
      functionName: `${prefix}-api`,
      entry: join(repoRoot, "backend/src/lambda.ts"),
      projectRoot: repoRoot,
      handler: "handler",
      runtime: Runtime.NODEJS_22_X,
      architecture: Architecture.ARM_64,
      memorySize: 512,
      timeout: Duration.seconds(10),
      bundling: {
        format: OutputFormat.ESM,
        target: "node22",
        banner: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
        externalModules: ["@aws-sdk/*"]
      },
      environment: {
        APP_ENV: props.envName,
        API_ALLOWED_ORIGINS: props.envName === "production"
          ? "https://cothecoconutcompany.com"
          : "http://localhost:3000,https://cothecoconutcompany.com",
        COGNITO_USER_POOL_ID: userPool.userPoolId,
        COGNITO_APP_CLIENT_ID: userPoolClient.userPoolClientId,
        COGNITO_REQUIRED_TOKEN_USE: "access",
        COMMERCE_TABLE_NAME: commerceTable.tableName,
        CONTENT_TABLE_NAME: contentTable.tableName,
        AUDIT_TABLE_NAME: auditTable.tableName
      },
      logGroup: apiLogGroup,
      tracing: Tracing.ACTIVE,
      reservedConcurrentExecutions: props.reservedConcurrency
    });

    const tableAndIndexArns = (table: Table) => [table.tableArn, `${table.tableArn}/index/*`];
    apiFn.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "dynamodb:BatchGetItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:ConditionCheckItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:BatchWriteItem",
        "dynamodb:DescribeTable"
      ],
      resources: [...tableAndIndexArns(commerceTable), ...tableAndIndexArns(contentTable)]
    }));
    apiFn.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["dynamodb:PutItem", "dynamodb:UpdateItem", "dynamodb:DescribeTable"],
      resources: tableAndIndexArns(auditTable)
    }));
    apiFn.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["cognito-idp:GetUser"],
      resources: [userPool.userPoolArn]
    }));

    const httpApi = new HttpApi(this, "HttpApi", {
      apiName: `${prefix}-http-api`,
      corsPreflight: {
        allowCredentials: true,
        allowHeaders: ["authorization", "content-type", "idempotency-key", "x-csrf-token", "x-request-id"],
        allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.POST, CorsHttpMethod.PATCH, CorsHttpMethod.DELETE, CorsHttpMethod.OPTIONS],
        allowOrigins: props.envName === "production" ? ["https://cothecoconutcompany.com"] : ["http://localhost:3000", "https://cothecoconutcompany.com"],
        maxAge: Duration.minutes(10)
      }
    });
    httpApi.addRoutes({
      path: "/{proxy+}",
      integration: new HttpLambdaIntegration("ApiIntegration", apiFn)
    });

    new Alarm(this, "ApiErrorsAlarm", {
      alarmName: `${prefix}-api-errors`,
      metric: apiFn.metricErrors({ period: Duration.minutes(5) }),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: TreatMissingData.NOT_BREACHING
    });

    new Alarm(this, "ApiThrottleAlarm", {
      alarmName: `${prefix}-api-throttles`,
      metric: apiFn.metricThrottles({ period: Duration.minutes(5) }),
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: TreatMissingData.NOT_BREACHING
    });

    new CfnOutput(this, "HttpApiUrl", { value: httpApi.url ?? "pending" });
    new CfnOutput(this, "CognitoUserPoolId", { value: userPool.userPoolId });
    new CfnOutput(this, "CognitoAppClientId", { value: userPoolClient.userPoolClientId });
    new CfnOutput(this, "CommerceTableName", { value: commerceTable.tableName });
    new CfnOutput(this, "ContentTableName", { value: contentTable.tableName });
    new CfnOutput(this, "AuditTableName", { value: auditTable.tableName });
  }

  private createDomainTable(tableName: string, removalPolicy: RemovalPolicy, isProd: boolean) {
    const table = new Table(this, tableName.replace(/[^A-Za-z0-9]/g, ""), {
      tableName,
      partitionKey: { name: "PK", type: AttributeType.STRING },
      sortKey: { name: "SK", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.AWS_MANAGED,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: isProd },
      timeToLiveAttribute: "expiresAt",
      removalPolicy,
      deletionProtection: isProd
    });
    table.addGlobalSecondaryIndex({
      indexName: "GSI1",
      partitionKey: { name: "GSI1PK", type: AttributeType.STRING },
      sortKey: { name: "GSI1SK", type: AttributeType.STRING }
    });
    table.addGlobalSecondaryIndex({
      indexName: "GSI2",
      partitionKey: { name: "GSI2PK", type: AttributeType.STRING },
      sortKey: { name: "GSI2SK", type: AttributeType.STRING }
    });
    return table;
  }
}
