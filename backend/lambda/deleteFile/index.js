"use strict";

const { DeleteObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const { s3, BUCKET_NAME } = require("../common/s3Client");
const { success, failure, preflight } = require("../common/response");

/**
 * DELETE /files/{key}
 * Permanently removes an object from the bucket.
 */
exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return preflight();

  try {
    const key = decodeURIComponent((event.pathParameters && event.pathParameters.key) || "");
    if (!key) return failure("A file key is required.", 400);

    try {
      await s3.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
    } catch {
      return failure("File not found.", 404);
    }

    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }));

    return success({ message: "File deleted successfully.", key });
  } catch (err) {
    console.error("deleteFile error:", err);
    return failure("Failed to delete file.", 500, err.message);
  }
};
