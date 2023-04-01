const YELLOW = "\x1B[33m"
export function logDebug(message: string) {
  console.log(YELLOW, 'DEBUG: ', message);
}