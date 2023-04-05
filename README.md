# 🤖 nlterm 🤖

`nlterm` is a command-line tool that translates natural language descriptions into terminal commands. Just tell it what you want to do in plain English, and watch it unleash the power of OpenAI to turn your words into executable commands. It's like having an AI-powered rubber duck 🦆.

## Table of Contents

* [Prerequisites](#---prerequisites)
* [Installation](#----installation)
* [Usage](#---usage)
* [Enabling Globally](#---enabling-globally)
* [Executing terminal commands](#------executing-terminal-commands)
* [Setting the API Key](#setting-the-api-key)
* [Examples](#examples)
* [Contributing](#contributing)
* [License](#license)

## Prerequisites

- node >= 14
- An OpenAI API key 🔐. You can get one by visiting this URL: https://platform.openai.com/account/api-keys
See [Setting the API Key](#setting-the-api-key) for more information.

## Installation

Simply download one of the binaries from the release page or install as a global npm package: 
(requires node 18)
```bash
npm i -g nlterm
```

## Usage

Using `nlterm` is simple:

```bash
nlterm "what I want to do but can't remember the command for"
```

The program will then write the translated terminal command to stdout.

Flags:
```
--debug:      Provides extra debugging info
-h, --help:   Prints the help docs
```

### Executing the commands

If you want to execute the translated terminal command, you can add the following shell function to your shell profile file (`~/.bashrc`, `~/.bash_profile`, or `~/.zshrc`):

> ⚠️ **This will execute arbitrary code written by an AI in your shell environment** 💀 Who knows what it's thinking. Use with caution.

```bash
nlt() {
  source <(nlterm $1)
}
```

## Enabling Globally
If you want the command to be available globally, you can move the binary to a directory that's in your `PATH` environment variable.
For example, `~/.local/bin`:

```bash
mv nlterm ~/.local/bin
```

## Setting the API Key

In order to use `nlterm`, you'll need to set your OpenAI API key as an environment variable in your shell environment. Here's how:

1. Open your shell profile file (usually `~/.bashrc`, `~/.bash_profile`, or `~/.zshrc`) in a text editor.
2. Add the following line at the end of the file:
```bash
export OPENAI_API_KEY="your_api_key"
```

Replace `your_api_key` with your actual API key obtained from OpenAI 🔑.

3. Save and close the file.
4. Restart your terminal or run `source ~/.bashrc`, `source ~/.bash_profile`, or `source ~/.zshrc`, depending on which file you edited.

## Examples

```bash
$ nlterm "create a new directory called projects"
mkdir projects

$ nlterm "list all files and directories in the current directory"
ls -la

$ nlterm "list all files in the s3 bucket 'my-bucket' with the extension .json"
aws s3 ls s3://my-bucket --recursive | grep ".json$" | awk '{print $4}'
```

## Contributing

You are welcome to contribute to `nlterm` 🎉. To get started, please fork the repository and submit a pull request with your proposed changes.

## License

`nlterm` is released under the MIT License 📜. See [LICENSE](LICENSE) for more information.
