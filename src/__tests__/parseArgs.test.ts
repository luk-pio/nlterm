import minimist from "minimist";
jest.mock("minimist");

const printHelp = jest.fn();
const processExit = jest.fn();

jest.mock("../command/printHelp", () => ({
  printHelp,
}));

import { parseArgs } from "../command/parseArgs";
import { EXIT_CODE } from "../command/exitCodes";

Object.defineProperty(process, "exit", {
  value: processExit,
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("parseArgs", () => {
  test("returns prompt and debug when provided", () => {
    (minimist as jest.Mock).mockReturnValue({
      _: ["test-prompt"],
      debug: true,
    });

    const result = parseArgs();

    expect(result).toEqual({ prompt: "test-prompt", debug: true });
    expect(printHelp).not.toHaveBeenCalled();
    expect(processExit).not.toHaveBeenCalled();
  });

  test("exits with an error code and prints help when no prompt is provided", () => {
    (minimist as jest.Mock).mockReturnValue({
      _: [],
      h: false,
    });

    parseArgs();

    expect(printHelp).toHaveBeenCalled();
    expect(processExit).toHaveBeenCalledWith(EXIT_CODE.USER_ERROR);
  });

  test("exits success code and prints help when help flag is provided", () => {
    (minimist as jest.Mock).mockReturnValue({
      _: ["test-prompt"],
      h: true,
    });

    parseArgs();

    expect(printHelp).toHaveBeenCalled();
    expect(processExit).toHaveBeenCalledWith(EXIT_CODE.SUCCESS);
  });
});
