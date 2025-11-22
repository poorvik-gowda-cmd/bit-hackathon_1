import crypto from "crypto"

const algorithm = "aes-256-gcm"
const encryptionKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32)

export function encryptSensitiveData(data: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.isBuffer(encryptionKey) ? encryptionKey : Buffer.from(encryptionKey, "utf-8"),
    iv,
  )

  let encrypted = cipher.update(data, "utf8", "hex")
  encrypted += cipher.final("hex")

  const authTag = cipher.getAuthTag()
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`
}

export function decryptSensitiveData(encryptedData: string): string {
  const parts = encryptedData.split(":")
  const iv = Buffer.from(parts[0], "hex")
  const authTag = Buffer.from(parts[1], "hex")
  const encrypted = parts[2]

  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.isBuffer(encryptionKey) ? encryptionKey : Buffer.from(encryptionKey, "utf-8"),
    iv,
  )

  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}
