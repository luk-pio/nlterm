import { config } from "./config/config";

export class NLTError extends Error {
  public readonly code: number;
  constructor(message: string, code: number, cause?: Error) {
    super(message, {cause});
    this.cause = cause;
    this.code = code;
  }
}

export function unknownError(
  cause?: Error,
  message: string = "An unknown error ocurred"
) {
  return new NLTError(message, UNEXPECTED_ERROR_CODE, cause);
}

export function unexpectedError(
  message: string,
  cause?: Error | unknown,
  prefix: string = "An unexpected error occurred: "
) {
  return new NLTError(
    prefix + message,
    UNEXPECTED_ERROR_CODE,
    cause instanceof Error ? cause : undefined
  );
}

export function networkError(
  message: string,
  cause?: Error | unknown,
  prefix: string = "A network error occurred: "
) {
  return new NLTError(
    prefix + message,
    NETWORK_ERROR_CODE,
    cause instanceof Error ? cause : undefined
  );
}

export const USER_ERROR_CODE = 1;
export const UNEXPECTED_ERROR_CODE = 2;
export const NETWORK_ERROR_CODE = 124;
const RED = "\x1b[31m";
const YELLOW = "\x1B[33m"

export function logDebug(message: string) {
  console.log(YELLOW, 'DEBUG: ', message);
}

export function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown Error";
  const code = error instanceof NLTError ? error.code : UNEXPECTED_ERROR_CODE;

  console.error(RED, message);
  if (config.debug && error instanceof NLTError) 
    console.error(error);
  
  process.exit(code);
}
