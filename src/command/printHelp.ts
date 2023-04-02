export const helpText = `Usage: nlterm prompt [options]

  a command-line tool for translating natural language descriptions into terminal commands

  Options:
    -h, --help          output usage information 
    --debug             provides extra debugging info`;

export function printHelp() {
  console.log(helpText);
}
