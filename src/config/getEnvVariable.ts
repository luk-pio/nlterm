export function getEnvVariable(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Environment variable ${key} not found.`);
  }

  return value;
}
