import { COLOR } from "./command/colors";

export function logDebug(message: string) {
  console.log(COLOR.YELLOW, 'DEBUG: ', message);
}