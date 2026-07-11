import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { getEnv } from "../config/env.js";

let docClient: DynamoDBDocumentClient | null = null;

export function getDocumentClient() {
  if (!docClient) {
    const env = getEnv();
    docClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: env.AWS_REGION }), {
      marshallOptions: { removeUndefinedValues: true, convertEmptyValues: false }
    });
  }
  return docClient;
}
