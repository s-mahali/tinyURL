import validator from "validator";
import { CodeValidationResult, UrlValidationResult } from "../types";

//validate a url before saving
export function validateUrl(urlString: string): UrlValidationResult {
  if (!urlString || typeof urlString !== "string") {
    return { valid: false, error: "URL is required" };
  }

  //trim whitespace
  const trimmedUrl = urlString.trim();
  const isValid = validator.isURL(trimmedUrl, {
    //protocols: ['http','https','ftp'],
    require_protocol: true,
    allow_underscores: true, //validator will allow underscores in the URL
  });
  if (!isValid) {
    return { valid: false, error: "Invalid URL format." };
  }
  return { valid: true };
}

//validate a custom short code
//must be 3-8 alphanumeric characters [A-Za-z0-9]{3,8}

export function validateShortCode(code: string): CodeValidationResult {
  const trimmedCode = code.trim();
  if (trimmedCode.length > 8) {
    return { valid: false, error: "Short code must be at most 8 chars" };
  }
  const codePattern = /^[A-Za-z0-9]{3,8}$/;
  if (!codePattern.test(trimmedCode)) {
    return {
      valid: false,
      error: "Short code must contain only letters and numbers (A-Z, a-z, 0-9)",
    };
  }

  return { valid: true };
}
