import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Variable manquante : ${name}`);
  }
  return value ?? "";
}

export const env = {
  appId: required("APP_ID"),
  appSecret: required("APP_SECRET"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),
  // Variables Kimi conservées pour compatibilité (non utilisées)
  kimiAuthUrl: process.env.KIMI_AUTH_URL ?? "http://localhost",
  kimiOpenUrl: process.env.KIMI_OPEN_URL ?? "http://localhost",
  ownerUnionId: process.env.OWNER_UNION_ID ?? "",
};
