"use strict";

const { ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { s3, BUCKET_NAME, UPLOAD_PREFIX } = require("../common/s3Client");
const { success, failure, preflight } = require("../common/response");

/**
 * GET /stats
 * Aggregates bucket contents into dashboard-ready statistics.
 */
exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return preflight();

  try {
    let continuationToken;
    const allObjects = [];

    do {
      const page = await s3.send(
        new ListObjectsV2Command({
          Bucket: BUCKET_NAME,
          Prefix: UPLOAD_PREFIX,
          ContinuationToken: continuationToken,
        })
      );
      allObjects.push(...(page.Contents || []));
      continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
    } while (continuationToken);

    const totalFiles = allObjects.length;
    const totalStorageBytes = allObjects.reduce((sum, o) => sum + o.Size, 0);

    const largestFile = allObjects.reduce(
      (largest, o) => (o.Size > (largest ? largest.Size : 0) ? o : largest),
      null
    );

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todaysUploads = allObjects.filter((o) => new Date(o.LastModified) >= startOfToday).length;

    const fileTypeBreakdown = allObjects.reduce((acc, o) => {
      const ext = (o.Key.split(".").pop() || "other").toLowerCase();
      acc[ext] = (acc[ext] || 0) + 1;
      return acc;
    }, {});

    const monthlyUploads = allObjects.reduce((acc, o) => {
      const month = new Date(o.LastModified).toISOString().slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const recentUploads = [...allObjects]
      .sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified))
      .slice(0, 5)
      .map((o) => ({
        key: o.Key,
        fileName: o.Key.replace(UPLOAD_PREFIX, ""),
        size: o.Size,
        uploadDate: o.LastModified,
      }));

    return success({
      totalFiles,
      totalStorageBytes,
      totalStorageMB: +(totalStorageBytes / (1024 * 1024)).toFixed(2),
      todaysUploads,
      largestFile: largestFile
        ? { key: largestFile.Key, fileName: largestFile.Key.replace(UPLOAD_PREFIX, ""), size: largestFile.Size }
        : null,
      fileTypeBreakdown,
      monthlyUploads,
      recentUploads,
    });
  } catch (err) {
    console.error("getStatistics error:", err);
    return failure("Failed to compute statistics.", 500, err.message);
  }
};
