import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();

import { safeFetch } from "../safeFetch";

describe("safeFetch", () => {
  const testUrl = "https://api.example.com/data";

  it("should return response data on successful fetch", async () => {
    const mockData = { id: 1, name: "Test" };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const result = await safeFetch(testUrl);
    expect(result).toEqual(mockData);
  });

  it("should throw FetchError on fetch failure", async () => {
    const status = 404;
    const statusText = "Not Found";
    const mockErrorResponse = { error: "Not found" };
    fetchMock.mockResponseOnce(JSON.stringify(mockErrorResponse), {
      status,
      statusText,
    });

    await expect(safeFetch(testUrl)).rejects.toMatchObject({
      code: status,
      message: statusText,
      name: "FetchError",
      responseBody: mockErrorResponse,
    });
  });

  it("should throw FetchError with message about not reading response body on fetch failure", async () => {
    const status = 404;
    const statusText = "Not Found";
    const mockErrorResponse = "invalid JSON";
    fetchMock.mockResponseOnce(mockErrorResponse, {
      status,
      statusText,
    });

    await expect(safeFetch(testUrl)).rejects.toMatchObject({
      code: status,
      message: "Could not read response body",
      name: "FetchError",
      responseBody: null,
    });
  });

  it("should throw FetchError on invalid JSON response", async () => {
    fetchMock.mockResponseOnce("invalid JSON", { status: 200 });

    await expect(safeFetch(testUrl)).rejects.toMatchObject({
      code: 200,
      message: "Could not read response body",
      name: "FetchError",
      responseBody: null,
    });
  });
});
