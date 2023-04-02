import { COLOR } from "./command/colors";
import {EXIT_CODE} from "./command/exitCodes";
import { config } from "./config/config";

export class NLTError extends Error {
  public readonly code: number;
  constructor(message: string, code: number, cause?: Error) {
    super(message, {cause});
    this.code = code;
  }
}

export function unknownError(
  cause?: Error,
  message = "An unknown error ocurred"
) {
  return new NLTError(message, EXIT_CODE.UNEXPECTED_ERROR, cause);
}

export function unexpectedError(
  message: string,
  cause?: Error | unknown,
  prefix = "An unexpected error occurred: "
) {
  return new NLTError(
    prefix + message,
    EXIT_CODE.UNEXPECTED_ERROR,
    cause instanceof Error ? cause : undefined
  );
}

export function networkError(
  message: string,
  cause?: Error | unknown,
  prefix = "A network error occurred: "
) {
  return new NLTError(
    prefix + message,
    EXIT_CODE.NETWORK_ERROR,
    cause instanceof Error ? cause : undefined
  );
}


export function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown Error";
  const code = error instanceof NLTError ? error.code : EXIT_CODE.UNEXPECTED_ERROR;

  console.error(COLOR.RED, message);
  if (config.debug && error instanceof NLTError) 
    console.error(error);
  
  process.exit(code);
}
