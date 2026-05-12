import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

let secretCache = new Map<string, string>();

export async function getSecret(secretName: string): Promise<string> {
  if (secretCache.has(secretName)) {
    return secretCache.get(secretName)!;
  }

  try {
    const credential = new DefaultAzureCredential();
    const keyVaultUrl = process.env.AZURE_KEY_VAULT_URL;
    if (!keyVaultUrl) throw new Error("AZURE_KEY_VAULT_URL not set");

    const secretClient = new SecretClient(keyVaultUrl, credential);
    const secret = await secretClient.getSecret(secretName);

    if (!secret.value) throw new Error(`Secret ${secretName} is empty`);

    secretCache.set(secretName, secret.value);
    console.log(`[azure-secrets] ✅ Loaded ${secretName}`);
    return secret.value;
  } catch (err: any) {
    console.error(`[azure-secrets] ❌ ${secretName}:`, err.message);

    // Dev fallback (even if .env.local is outdated)
    if (process.env.NODE_ENV !== "production") {
      const envKey = secretName.replace(/-/g, "_");
      const fallback = process.env[envKey];
      if (fallback) {
        console.warn(`[azure-secrets] ⚠️ Using .env fallback for ${secretName}`);
        secretCache.set(secretName, fallback);
        return fallback;
      }
    }
    throw err;
  }
}

export function clearSecretCache() {
  secretCache.clear();
}
