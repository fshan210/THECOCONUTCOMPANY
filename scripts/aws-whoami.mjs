import { spawnSync } from "node:child_process";

const profile = process.env.AWS_PROFILE || "dotco-console";
const region = process.env.AWS_REGION || "ap-south-1";

const result = spawnSync(
  "aws",
  [
    "sts",
    "get-caller-identity",
    "--profile",
    profile,
    "--region",
    region,
    "--query",
    "{Account:Account,Arn:Arn}",
    "--output",
    "json",
  ],
  { encoding: "utf8" },
);

if (result.status !== 0) {
  process.stderr.write(result.stderr || "Unable to verify the AWS identity.\n");
  process.exit(result.status || 1);
}

const identity = JSON.parse(result.stdout);
console.log(JSON.stringify({ profile, region, ...identity }, null, 2));
