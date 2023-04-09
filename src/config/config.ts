import fs from "fs";
import yaml from "yaml";
import minimist from "minimist";

const systemMessage = `I want you to translate my prompts to terminal commands. I will provide you with a prompt and I want you to answer with a command which I can run in the terminal. You should only reply with the terminal command and nothing else. Do not write explanations. Do not format the command in a code block. My prompt is: `;

interface NLTConfig {
  debug: boolean,
  openai: OpenaiConfig
}

interface OpenaiConfig {
    apiUrl: string,
    apiKey: string | undefined,
    organizationId: string | undefined,
    systemMessage: string
    chatCompletionConfig: {
      model: string,
      max_tokens: number,
      temperature: number,
      top_p: number,
      n: number,
      frequency_penalty: number,
      presence_penalty: number
    }
}

class AppConfig {
  private static instance: AppConfig;
  private config!: NLTConfig;

  constructor() {
    this.setDefaults();
    this.loadConfigFile();
    this.processCommandLineArgs();
    AppConfig.instance = this;
  }

  getConfig(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  setDefaults() {
    this.config = {
      debug: false,
      openai: {
        apiUrl: "https://api.openai.com/v1",
        apiKey: process.env["OPENAI_API_KEY"],
        organizationId: process.env["OPENAI_ORG_ID"] || undefined,
        systemMessage,
        chatCompletionConfig: {
          model: process.env["NLTERM_MODEL"] || "gpt-3.5-turbo",
          max_tokens: 2048,
          temperature: 0.0,
          top_p: 1,
          n: 1,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        },
      },
    };
  }

  loadConfigFile(configFilePath = "./config.yml") {
    if (fs.existsSync(configFilePath)) {
      const configFile = fs.readFileSync(configFilePath, "utf8");
      const configYaml = yaml.parse(configFile);
      this.validateAndSetConfig(configYaml)
    }
  }

  processCommandLineArgs() {
    const args = minimist(process.argv.slice(2));
    this.validateAndSetConfig(args)
  }


  validateAndSetConfig(newConfig) {
    for (const [key, value] of Object.entries(newConfig)) {
      if (this.allowedKeys.includes(key)) {
        this.setConfigValue(key, value);
      } else {
        throw new Error(`Unrecognized configuration key: ${key}`);
      }
    }
  }

  setConfigValue(key: string, value: number | string) {
    const keys = key.split(".");
    let current = this.config;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }

  setDebug() {
    this.config.debug = true;
  }
}

const appConfig = new AppConfig();
export default appConfig;
