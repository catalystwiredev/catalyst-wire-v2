import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

let secretCache = new Map<string, string>();

/**
 * Get secret with strong dev fallback when Key Vault is not available
 */
export async function getSecret(secretName: string): Promise<string> {
  if (secretCache.has(secretName)) {
    return secretCache.get(secretName)!;
  }

  // 1. Try .env.local first in development / build
  if (process.env.NODE_ENV !== "production") {
    const envKey = secretName.replace(/-/g, "_");
    const fallback = process.env[envKey];
    if (fallback) {
      console.warn(`[azure-secrets] ⚠️ Using .env.local fallback for ${secretName}`);
      secretCache.set(secretName, fallback);
      return fallback;
    }
  }

  // 2. Try Key Vault (production path)
  try {
    const keyVaultUrl = process.env.AZURE_KEY_VAULT_URL;
    if (!keyVaultUrl) {
      throw new Error("AZURE_KEY_VAULT_URL not set");
    }

    const credential = new DefaultAzureCredential();
    const secretClient = new SecretClient(keyVaultUrl, credential);
    const secret = await secretClient.getSecret(secretName);

    if (!secret.value) throw new Error(`Secret ${secretName} is empty`);

    secretCache.set(secretName, secret.value);
    console.log(`[azure-secrets] ✅ Loaded ${secretName} from Key Vault`);
    return secret.value;
  } catch (err: any) {
    console.error(`[azure-secrets] ❌ ${secretName}:`, err.message);
    throw err;
  }
}

export function clearSecretCache() {
  secretCache.clear();
}
