import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname
});

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "dist/**", "cdk.out/**", "infra/cdk.out/**", "public/**", ".reference-downloads/**"]
  },
  ...compat.extends("next/core-web-vitals")
];

export default eslintConfig;
