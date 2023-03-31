export class NLTError extends Error {
  public readonly code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

const FATAL_ERROR_CODE = 128

export const handleError = (error: unknown) => {
    let message = 'Unknown Error', code = FATAL_ERROR_CODE;
    if (error instanceof Error) {
        message = error.message;
    }
    if (error instanceof NLTError) code = error.code
    const red = '\x1b[31m'
    console.error(red, `Error: ${message}`);
    process.exit(code)
}
