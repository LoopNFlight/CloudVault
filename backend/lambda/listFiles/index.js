"use strict";

const { ListObjectsV2Command, HeadObjectCommand } = require("@aws-sdk/client-s3");
const { s3, BUCKET_NAME, UPLOAD_PREFIX } = require("../common/s3Client");
const { success, failure, preflight } = require("../common/response");

/**
 * GET /files?limit=50&continuationToken=...
 *
 * Lists every object under uploads/ and enriches each with metadata
 * (original filename, content type, upload date) pulled from S3 object headers.
 */
exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return preflight();

  try {
    const qs = event.queryStringParameters || {};
    const limit = Math.min(parseInt(qs.limit, 10) || 100, 200);

    const listResult = await s3.send(
      new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: UPLOAD_PREFIX,
        MaxKeys: limit,
        ContinuationToken: qs.continuationToken || undefined,
      })
    );

    const contents = listResult.Contents || [];

    const files = await Promise.all(
      contents.map(async (obj) => {
        let originalName = obj.Key.replace(UPLOAD_PREFIX, "");
        let contentType = "application/octet-stream";
        let uploadDate = obj.LastModified;

        try {
          const head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: obj.Key }));
          originalName = (head.Metadata && head.Metadata["original-filename"]) || originalName;
          contentType = head.ContentType || contentType;
          uploadDate = (head.Metadata && head.Metadata["upload-date"]) || uploadDate;
        } catch (headErr) {
          console.warn(`Could not HEAD object ${obj.Key}:`, headErr.message);
        }

        const extension = originalName.includes(".")
          ? originalName.split(".").pop().toLowerCase()
          : "";

        return {
          key: obj.Key,
          fileName: originalName,
          extension,
          size: obj.Size,
          contentType,
          uploadDate,
        };
      })
    );

    files.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

    return success({
      files,
      count: files.length,
      isTruncated: listResult.IsTruncated || false,
      nextContinuationToken: listResult.NextContinuationToken || null,
    });
  } catch (err) {
    console.error("listFiles error:", err);
    return failure("Failed to list files.", 500, err.message);
  }
};
