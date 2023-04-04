import { COLOR } from "./command/colors";
import { EXIT_CODE } from "./command/exitCodes";

export class NLTError extends Error {
  public readonly code: number;
  constructor(message: string, code: number, cause?: Error) {
    super(message, { cause });
    this.code = code;
  }
}

export function unknownError(
  cause?: Error,
  message = "Unknown Error. Please use the --debug flag and submit an issue with the output."
) {
  return new NLTError(message, EXIT_CODE.UNEXPECTED_ERROR, cause);
}

export function unexpectedError(
  message: string,
  cause?: Error | unknown,
  prefix = "Unexpected Error: "
) {
  return new NLTError(
    prefix + message,
    EXIT_CODE.UNEXPECTED_ERROR,
    cause instanceof Error ? cause : undefined
  );
}

export function handleError(error: unknown, debug = false) {
  const message = error instanceof Error ? error.message : "Unknown Error";
  const code =
    error instanceof NLTError ? error.code : EXIT_CODE.UNEXPECTED_ERROR;

  console.error(COLOR.RED, message);
  if (debug && error instanceof NLTError) console.error(error);

  process.exit(code);
}
