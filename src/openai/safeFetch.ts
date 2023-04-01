import { config } from "../config/config";
import { logDebug } from "../error";

export class FetchError extends Error {
  constructor(message: string, cause?: Error) {
    super(message, {cause});
    this.name = "FetchError";
  }
}

export async function safeFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage: string;

      if (response.status === 400) {
        errorMessage = "Bad Request";
      } else if (response.status === 401) {
        errorMessage = "Unauthorized";
      } else if (response.status === 403) {
        errorMessage = "Forbidden";
      } else if (response.status === 404) {
        errorMessage = "Not Found";
      } else if (response.status === 500) {
        errorMessage = "Internal Server Error";
      } else {
        errorMessage = "An error occurred";
      }

      let responseText;
      try {
        responseText = await response.text()
        if (config.debug) {
          logDebug('Received response: ')
          logDebug(responseText)
        }
      } catch (error: unknown) {
        responseText = "Could not read response body"
      }

      throw new FetchError(errorMessage, new Error(responseText));
    }

    return await response.json();
  } catch (error) {
    if (error instanceof FetchError) {
      throw error;
    }

    throw new FetchError("Failed to fetch data", error instanceof Error ? error : undefined);
  }
}
