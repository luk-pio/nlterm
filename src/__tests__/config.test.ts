import fs from "fs";
import AppConfig from "./AppConfig";

describe("AppConfig", () => {
  let configFile = "test-config.yml";

  beforeEach(() => {
    process.argv = ["node", "script.js"];
  });

  afterEach(() => {
    if (fs.existsSync(configFile)) {
      fs.unlinkSync(configFile);
    }
  });

  test("should load default configuration", () => {
    const appConfig = new AppConfig();
    expect(appConfig.getConfig().debug).toBe(false);
  });

  test("should load configuration from a YAML file", () => {
    fs.writeFileSync(
      configFile,
      `
      debug: true
      `
    );
    const appConfig = new AppConfig(configFile);
    expect(appConfig.getConfig().debug).toBe(true);
  });

  test("should process command line arguments", () => {
    process.argv.push("--debug");
    process.argv.push("true");
    const appConfig = new AppConfig(configFile);
    expect(appConfig.getConfig().debug).toBe(true);
  });

  test("command line arguments should take precedence over config file", () => {
    fs.writeFileSync(
      configFile,
      `
      debug: false
      `
    );
    process.argv.push("--debug");
    process.argv.push("true");
    const appConfig = new AppConfig(configFile);
    expect(appConfig.getConfig().debug).toBe(true);
  });

  test("should set debug value when setDebug is called", () => {
    const appConfig = new AppConfig();
    appConfig.setDebug();
    expect(appConfig.getConfig().debug).toBe(true);
  });

  test("should throw error for unrecognized key in YAML file", () => {
    fs.writeFileSync(
      configFile,
      `
      invalidKey: "invalid value"
      `
    );
    expect(() => new AppConfig(configFile)).toThrow(
      "Unrecognized configuration key: invalidKey"
    );
  });

  test("should throw error for unrecognized command line argument", () => {
    process.argv.push("--invalidKey");
    process.argv.push("invalid value");
    expect(() => new AppConfig()).toThrow(
      "Unrecognized configuration key: invalidKey"
    );
  });
});