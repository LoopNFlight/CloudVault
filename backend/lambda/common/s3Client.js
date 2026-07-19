"use strict";

const { S3Client } = require("@aws-sdk/client-s3");

/**
 * Single shared S3 client instance, reused across warm Lambda invocations.
 * Region comes from the Lambda's environment (set in template.yaml).
 */
const s3 = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });

const BUCKET_NAME = process.env.BUCKET_NAME;
const UPLOAD_PREFIX = "uploads/";
const PRESIGNED_URL_EXPIRY_SECONDS = 15 * 60; // 15 minutes, per spec

// File extensions the platform refuses to store (basic upload hardening).
const BLOCKED_EXTENSIONS = new Set([
  "exe", "bat", "cmd", "sh", "msi", "com", "scr", "js", "vbs", "jar", "app", "dll",
]);

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

module.exports = {
  s3,
  BUCKET_NAME,
  UPLOAD_PREFIX,
  PRESIGNED_URL_EXPIRY_SECONDS,
  BLOCKED_EXTENSIONS,
  MAX_UPLOAD_BYTES,
};
