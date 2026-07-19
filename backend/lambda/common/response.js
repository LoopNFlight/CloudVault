/**
 * Shared HTTP response helpers for API Gateway (REST API / Lambda proxy integration).
 * Centralising this keeps every Lambda's CORS + JSON contract identical.
 *
 * CommonJS module -- required (not imported) by every handler in this project.
 */
"use strict";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "OPTIONS,GET,POST,DELETE",
};

function success(body, statusCode = 200) {
  return {
    statusCode,
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(body),
  };
}

function failure(message, statusCode = 500, details) {
  return {
    statusCode,
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({
      error: true,
      message,
      ...(details ? { details } : {}),
    }),
  };
}

function preflight() {
  return {
    statusCode: 204,
    headers: DEFAULT_HEADERS,
    body: "",
  };
}

module.exports = { success, failure, preflight };
