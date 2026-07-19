"use strict";

const { ListObjectsV2Command, HeadObjectCommand } = require("@aws-sdk/client-s3");
const { s3, BUCKET_NAME, UPLOAD_PREFIX } = require("../common/s3Client");
const { success, failure, preflight } = require("../common/response");

/**
 * GET /search?q=<term>
 *
 * S3 has no native filename search, so this lists the (bounded) uploads/
 * prefix and filters in-memory. Fine at portfolio scale; a production system
 * with a large bucket would back this with DynamoDB + a GSI instead.
 */
exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return preflight();

  try {
    const term = ((event.queryStringParameters && event.queryStringParameters.q) || "").trim().toLowerCase();
    if (!term) return success({ files: [], count: 0 });

    const listResult = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET_NAME, Prefix: UPLOAD_PREFIX, MaxKeys: 1000 })
    );
    const contents = listResult.Contents || [];

    const enriched = await Promise.all(
      contents.map(async (obj) => {
        let originalName = obj.Key.replace(UPLOAD_PREFIX, "");
        let contentType = "application/octet-stream";
        try {
          const head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: obj.Key }));
          originalName = (head.Metadata && head.Metadata["original-filename"]) || originalName;
          contentType = head.ContentType || contentType;
        } catch {
          /* fall back to key-derived name */
        }
        return {
          key: obj.Key,
          fileName: originalName,
          extension: originalName.includes(".") ? originalName.split(".").pop().toLowerCase() : "",
          size: obj.Size,
          contentType,
          uploadDate: obj.LastModified,
        };
      })
    );

    const matches = enriched.filter((f) => f.fileName.toLowerCase().includes(term));

    return success({ files: matches, count: matches.length, query: term });
  } catch (err) {
    console.error("searchFiles error:", err);
    return failure("Failed to search files.", 500, err.message);
  }
};
