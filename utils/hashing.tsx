import * as crypto from "crypto";

function generateSalt() {
  return crypto.randomBytes(16);
}

export function hashEmailTitle(email: string, title: string) {
  let salt = generateSalt();

  const str = title + email + salt;

  const hash = crypto.createHash("sha256").update(str).digest("hex");
}
