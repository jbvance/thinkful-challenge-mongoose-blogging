"use strict";
exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/thinkful-blog-api";
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://localhost/test-thinkful-blog-api";
exports.PORT = process.env.PORT || 8080;

console.log("DATABASE_URL", process.env.DATABASE_URL);