console.log(JSON.stringify({
  status: "not_started",
  source: "firebase",
  target: "dynamodb-dev",
  verified: false,
  message: "Migration verification is gated until a reviewed DEV transform produces a deterministic manifest."
}));
