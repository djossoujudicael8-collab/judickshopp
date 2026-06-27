/**
 * Script de création du compte administrateur JUDICKSHOP
 * Usage : node create-admin.mjs
 *
 * À lancer UNE SEULE FOIS après avoir configuré le .env
 */
import bcrypt from "bcryptjs";
import pg from "pg";
import { readFileSync } from "fs";

const { Pool } = pg;

// ─── MODIFIE CES DEUX LIGNES ────────────────────────────────
const ADMIN_EMAIL = "judickshop74@gmail.com";   // ← ton email
const ADMIN_PASSWORD = "Judick12....";       // ← ton mot de passe
// ────────────────────────────────────────────────────────────

// Lire le .env manuellement (sans dépendance dotenv)
function loadEnv() {
    try {
        const content = readFileSync(".env", "utf-8");
        for (const line of content.split("\n")) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;
            const [key, ...rest] = trimmed.split("=");
            if (key && rest.length) {
                process.env[key.trim()] = rest.join("=").trim();
            }
        }
    } catch {
        console.error("❌ Fichier .env introuvable. Crée-le d'abord !");
        process.exit(1);
    }
}

async function main() {
    // Vérifications de base
    if (ADMIN_EMAIL === "ton.email@exemple.com") {
        console.error("❌ Modifie ADMIN_EMAIL dans ce fichier avant de lancer le script !");
        process.exit(1);
    }
    if (ADMIN_PASSWORD.length < 8) {
        console.error("❌ Le mot de passe doit faire au moins 8 caractères.");
        process.exit(1);
    }

    loadEnv();

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        console.error("❌ DATABASE_URL manquant dans le fichier .env");
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false },
    });

    try {
        console.log("🔌 Connexion à Supabase...");
        await pool.query("SELECT 1"); // test connexion
        console.log("✅ Connexion réussie !");

        // Vérifier si l'admin existe déjà
        const existing = await pool.query(
            "SELECT id FROM admin_users WHERE email = $1",
            [ADMIN_EMAIL]
        );

        if (existing.rows.length > 0) {
            console.log(`\n⚠️  Un admin avec l'email "${ADMIN_EMAIL}" existe déjà.`);
            console.log("   Supprime-le dans Supabase si tu veux le recréer.");
            return;
        }

        // Hasher le mot de passe (sécurisé)
        console.log("🔐 Sécurisation du mot de passe...");
        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

        // Créer l'admin
        await pool.query(
            "INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)",
            [ADMIN_EMAIL, passwordHash]
        );

        console.log("\n✅ Compte administrateur créé avec succès !");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`   Email       : ${ADMIN_EMAIL}`);
        console.log(`   Accès local : http://localhost:3000/super-admin`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("\n🔒 Garde ces informations en lieu sûr !\n");

    } catch (err) {
        console.error("\n❌ Erreur :", err.message);
        if (err.message.includes("ECONNREFUSED") || err.message.includes("connect")) {
            console.error("   → Vérifie que DATABASE_URL dans .env est correct");
            console.error("   → Format attendu : postgresql://postgres:MOT_DE_PASSE@db.XXXXX.supabase.co:5432/postgres");
        }
        if (err.message.includes("admin_users")) {
            console.error("   → La table admin_users n'existe pas encore");
            console.error("   → Exécute le SQL de l'Étape 3 dans Supabase d'abord");
        }
    } finally {
        await pool.end();
    }
}

main();
