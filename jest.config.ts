import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["./src"],
  collectCoverageFrom: ["./src/**/*.ts", "!./src/__tests__/**/*"],
};

export default jestConfig;
