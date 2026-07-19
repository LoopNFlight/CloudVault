"use strict";

const { GetObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3, BUCKET_NAME, PRESIGNED_URL_EXPIRY_SECONDS } = require("../common/s3Client");
const { success, failure, preflight } = require("../common/response");

/**
 * GET /download/{key}
 *
 * Generates a time-limited (15 minute) presigned S3 GET URL so the browser
 * downloads directly from S3 -- the file bytes never pass through Lambda.
 */
exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return preflight();

  try {
    const key = decodeURIComponent((event.pathParameters && event.pathParameters.key) || "");
    if (!key) return failure("A file key is required.", 400);

    // Confirm the object exists before issuing a signed URL, so the caller
    // gets a clean 404 instead of a URL that fails on click.
    try {
      await s3.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
    } catch {
      return failure("File not found.", 404);
    }

    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
    const url = await getSignedUrl(s3, command, { expiresIn: PRESIGNED_URL_EXPIRY_SECONDS });

    return success({
      url,
      expiresInSeconds: PRESIGNED_URL_EXPIRY_SECONDS,
      key,
    });
  } catch (err) {
    console.error("downloadFile error:", err);
    return failure("Failed to generate download link.", 500, err.message);
  }
};
