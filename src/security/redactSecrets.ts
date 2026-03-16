const SECRET_ENV_KEYS = [
  "HF_TOKEN",
  "REPLICATE_API_TOKEN",
  "API_KEY",
  "AUTH_TOKEN",
  "ACCESS_TOKEN",
  "SECRET",
  "PASSWORD",
] as const;

const TOKEN_PATTERNS: RegExp[] = [
  /\bhf_[a-zA-Z0-9]{8,}\b/g,
  /\br8_[a-zA-Z0-9]{8,}\b/g,
  /\b(?:sk|rk|pk)_[a-zA-Z0-9]{8,}\b/g,
  /\bBearer\s+[A-Za-z0-9._-]{8,}\b/gi,
];

const REDACTION = "[REDACTED]";

export function redactSecrets(value: string): string {
  let sanitized = value;

  for (const pattern of TOKEN_PATTERNS) {
    sanitized = sanitized.replace(pattern, REDACTION);
  }

  for (const key of SECRET_ENV_KEYS) {
    const envAssignment = new RegExp(`(${key}\\s*=\\s*)([^\\s,;]+)`, "gi");
    sanitized = sanitized.replace(envAssignment, `$1${REDACTION}`);
  }

  return sanitized;
}

export function redactErrorMessage(error: unknown): string {
  const rawMessage = error instanceof Error ? error.message : String(error);
  return redactSecrets(rawMessage);
}
