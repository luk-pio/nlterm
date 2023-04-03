#!/usr/bin/env node
import { Octokit } from "@octokit/rest";
import fs from "fs";

const owner = "luk-pio";
const repo = "nlterm";

const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
});

async function getLatestRelease() {
  try {
    const { data: latestRelease } = await octokit.rest.repos.getLatestRelease({
      owner: owner,
      repo: repo,
    });
    return latestRelease;
  } catch (error) {
    throw new Error(`Error getting latest release: ${JSON.stringify(error)}`);
  }
}

async function uploadFilesToLatestRelease(filePaths) {
  const release = await getLatestRelease();
  const uploadUrl = release?.upload_url;
  const release_id = release?.id;

  if (!uploadUrl || !release_id) {
    throw Error("Could not get latest release upload url");
  }

  try {
    for (const filePath of filePaths) {
      const fileName = filePath.split("/").pop();
      const fileContent = fs.readFileSync(filePath);

      await octokit.repos.uploadReleaseAsset({
        url: uploadUrl,
        headers: {
          "content-type": "application/octet-stream",
          "content-length": fileContent.length,
        },
        release_id,
        name: fileName,
        data: fileContent,
      });
    }
  } catch (error) {
    throw new Error(`Error getting latest release: ${JSON.stringify(error)}`);
  }
}

const files = process.argv.slice(2)
uploadFilesToLatestRelease(files);
