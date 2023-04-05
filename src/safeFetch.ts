import fetch, { RequestInit, Response } from "node-fetch";
import { config } from "./config/config";
import { logDebug } from "./logDebug";

export class FetchError<E> extends Error {
  constructor(
    message: string,
    readonly code: number,
    readonly responseBody: E | null,
    readonly response: Response,
    cause?: Error
  ) {
    super(message, { cause });
    this.code = code;
    this.responseBody = responseBody;
    this.response = response;
    this.name = "FetchError";
  }
}

export async function safeFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  try {
    const responseBody = await response.json();

    if (config.debug) {
      logDebug("Received Error response: ");
      logDebug(responseBody);
    }

    return responseBody;
  } catch (error: unknown) {
    if (config.debug) {
      logDebug("Could not read response body");
      logDebug(JSON.stringify(error));
    }

    throw new FetchError(
      "Could not read response body",
      response.status,
      null,
      response,
      error instanceof Error ? error : undefined
    );
  }
}

async function handleErrorResponse(response: Response) {
  let responseBody;
  try {
    responseBody = await response.json();
  } catch (error: unknown) {
    throw new FetchError(
      "Could not read response body",
      response.status,
      null,
      response,
      error instanceof Error ? error : undefined
    );
  }

  if (config.debug) {
    logDebug("Received Error response: ");
    logDebug(responseBody);
  }

  throw new FetchError(
    response.statusText,
    response.status,
    responseBody,
    response
  );
}
