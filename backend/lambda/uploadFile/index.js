"use strict";

const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { randomUUID } = require("crypto");
const { s3, BUCKET_NAME, UPLOAD_PREFIX, BLOCKED_EXTENSIONS, MAX_UPLOAD_BYTES } = require("../common/s3Client");
const { success, failure, preflight } = require("../common/response");

/**
 * POST /upload
 *
 * Body (JSON): { fileName: string, contentType: string, fileContent: string (base64) }
 *
 * Files are stored under uploads/<uuid>-<originalFileName> so keys never collide,
 * while the original name is preserved as S3 object metadata for display purposes.
 */
exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return preflight();

  try {
    if (!event.body) return failure("Request body is required.", 400);

    const payload = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString("utf-8")
      : event.body;

    const { fileName, contentType, fileContent } = JSON.parse(payload);

    if (!fileName || !contentType || !fileContent) {
      return failure("fileName, contentType and fileContent are all required.", 400);
    }

    const extension = fileName.includes(".") ? fileName.split(".").pop().toLowerCase() : "";
    if (BLOCKED_EXTENSIONS.has(extension)) {
      return failure(`File type ".${extension}" is not permitted.`, 400);
    }

    const buffer = Buffer.from(fileContent, "base64");

    if (buffer.byteLength > MAX_UPLOAD_BYTES) {
      return failure(
        `File exceeds the maximum allowed size of ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB.`,
        400
      );
    }

    const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `${UPLOAD_PREFIX}${randomUUID()}-${sanitizedName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        Metadata: {
          "original-filename": fileName,
          "upload-date": new Date().toISOString(),
        },
        ServerSideEncryption: "AES256",
      })
    );

    return success(
      {
        message: "File uploaded successfully.",
        key,
        fileName,
        size: buffer.byteLength,
        contentType,
        uploadDate: new Date().toISOString(),
      },
      201
    );
  } catch (err) {
    console.error("uploadFile error:", err);
    return failure("Failed to upload file.", 500, err.message);
  }
};
