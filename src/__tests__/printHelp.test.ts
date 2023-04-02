import { printHelp, helpText } from "../command/printHelp";

describe("printHelp", () => {
  it("should print help information", () => {
    const consoleSpy = jest.spyOn(console, "log");
    printHelp();
    expect(consoleSpy).toHaveBeenCalledWith(helpText);
  });
});
