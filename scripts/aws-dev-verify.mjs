import { spawnSync } from "node:child_process";

const profile = process.env.AWS_PROFILE || "dotco-console";
const region = process.env.AWS_REGION || "ap-south-1";
const run = (args) => {
  const result = spawnSync("aws", [...args, "--profile", profile, "--region", region, "--output", "json"], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    process.stderr.write(result.stderr || `AWS command failed: ${args.join(" ")}\n`);
    process.exit(result.status || 1);
  }

  return JSON.parse(result.stdout);
};

const identity = run(["sts", "get-caller-identity", "--query", "{Account:Account,Arn:Arn}"]);
const userPool = run([
  "cognito-idp",
  "describe-user-pool",
  "--user-pool-id",
  "ap-south-1_XlJmCJYXS",
  "--query",
  "UserPool.{Id:Id,Name:Name,Created:CreationDate}",
]);
const api = run([
  "apigatewayv2",
  "get-api",
  "--api-id",
  "evba5qgrqi",
  "--query",
  "{ApiId:ApiId,Name:Name,Endpoint:ApiEndpoint}",
]);
const lambda = run([
  "lambda",
  "get-function-configuration",
  "--function-name",
  "dotco-dev-api",
  "--query",
  "{FunctionName:FunctionName,State:State,Runtime:Runtime,LastModified:LastModified}",
]);
const tables = run(["dynamodb", "list-tables", "--query", "TableNames[?starts_with(@, 'dotco-dev-')]"]);

console.log(JSON.stringify({ profile, region, identity, userPool, api, lambda, tables }, null, 2));
