const BASE62_CHARS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

//Generate a random alphanumeric code (6-8)
export function generateRandomCode(length = 6): string {
  if (length < 6 || length > 8) {
    throw new Error("Code length must be between 6 and 8 chars");
  }

  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * BASE62_CHARS.length);
    code += BASE62_CHARS[randomIndex];
  }

  return code;
}
