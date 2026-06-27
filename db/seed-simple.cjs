const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function main() {
  const conn = await mysql.createConnection(
    "mysql://3XbbdQnA9vboeUq.root:Ful5e0c5PQQUQb4sKQshiK6RsWFC93n5@ep-t4ni387b5e83b7519dc8.epsrv-t4n281l4mrmemi4zls9a.ap-southeast-1.privatelink.aliyuncs.com:4000/19f0513e-ccf2-86df-8000-09ed2f5bfee2"
  );

  console.log("Connected to DB");

  // Categories
  await conn.execute(
    'INSERT IGNORE INTO categories (name) VALUES (?), (?), (?)',
    ["Vetements", "Electroniques", "Bijoux"]
  );
  
  // Get IDs
  const [cats] = await conn.execute('SELECT * FROM categories');
  console.log("Categories:", cats);
  
  const vetementsId = cats.find(c => c.name === "Vêtements")?.id;
  const electroniquesId = cats.find(c => c.name === "Électroniques")?.id;
  const bijouxId = cats.find(c => c.name === "Bijoux")?.id;
  
  if (!vetementsId || !electroniquesId || !bijouxId) {
    console.error("Category IDs not found!");
    await conn.end();
    return;
  }
  
  console.log("Category IDs:", { vetementsId, electroniquesId, bijouxId });

  // Products
  const products = [
    ["Blazer Premium Lin", "Blazer elegant en lin naturel, coupe ajustee. Parfait pour les occasions formelles.", 45000, vetementsId, JSON.stringify(["/images/category-vetements.jpg"]), "BLZ-LIN-001"],
    ["Chemise en Coton Bio", "Chemise confectionnee en coton biologique de haute qualite.", 25000, vetementsId, JSON.stringify(["/images/category-vetements.jpg"]), "CHM-BIO-002"],
    ["Ecouteurs Sans Fil Pro", "Ecouteurs Bluetooth 5.3 avec reduction de bruit active. Autonomie 30h.", 35000, electroniquesId, JSON.stringify(["/images/category-electroniques.jpg"]), "ECU-PRO-003"],
    ["Montre Connectee Elegance", "Montre intelligente avec ecran AMOLED, suivi de la sante, GPS integre.", 55000, electroniquesId, JSON.stringify(["/images/category-electroniques.jpg"]), "MTR-CON-004"],
    ["Bracelet Or 18K", "Bracelet en or 18 carats, design contemporain et intemporel.", 125000, bijouxId, JSON.stringify(["/images/category-bijoux.jpg"]), "BRZ-OR0-005"],
    ["Bagues Empilables", "Set de 3 bagues en argent sterling 925 avec finition doree.", 28000, bijouxId, JSON.stringify(["/images/category-bijoux.jpg"]), "BGQ-EMP-006"],
    ["T-Shirt Premium Oversize", "T-shirt oversize en coton peigne 240g/m2. Coupe boxy moderne.", 18000, vetementsId, JSON.stringify(["/images/category-vetements.jpg"]), "TSH-OVR-007"],
    ["Chargeur Portable 20000mAh", "Batterie externe haute capacite avec charge rapide 65W.", 22000, electroniquesId, JSON.stringify(["/images/category-electroniques.jpg"]), "CHR-20K-008"],
  ];

  for (const p of products) {
    await conn.execute(
      'INSERT IGNORE INTO products (name, description, price, category_id, images, sku) VALUES (?, ?, ?, ?, ?, ?)',
      p
    );
  }
  console.log("Products OK");

  // Blog posts
  await conn.execute(
    'INSERT IGNORE INTO blog_posts (title, content, cover_image, category) VALUES (?, ?, ?, ?)',
    ["Comment Choisir Votre Style Personnel", "Trouver son style personnel est un voyage qui merite d'etre savoure.\n\n## Commencez par les bases\n\nUn vestiaire bien construit commence par des pieces intemporelles.\n\n## L'importance des accessoires\n\nLes accessoires sont ce qui transforme une tenue basique en look memorable.", "/images/category-vetements.jpg", "Style"]
  );
  await conn.execute(
    'INSERT IGNORE INTO blog_posts (title, content, cover_image, category) VALUES (?, ?, ?, ?)',
    ["Les Tendances Tech de 2025", "Le monde de la technologie evolue a une vitesse fulgurante.\n\n## L'audio sans fil reinvente\n\nLes ecouteurs de nouvelle generation offrent une qualite sonore exceptionnelle.\n\n## Les montres connectees deviennent indispensables\n\nAu-dela du suivi d'activite, les montres intelligentes d'aujourd'hui integrent des fonctionnalites avancees.", "/images/category-electroniques.jpg", "Technologie"]
  );
  await conn.execute(
    'INSERT IGNORE INTO blog_posts (title, content, cover_image, category) VALUES (?, ?, ?, ?)',
    ["L'Art des Bijoux Contemporains", "Les bijoux contemporains marient tradition artisanale et design moderne.\n\n## Le minimalisme intemporel\n\nLes lignes epurees et les formes geometriques dominent la joaillerie contemporaine.\n\n## Les materiaux nobles\n\nL'or 18 carats et l'argent sterling 925 restent les choix priviligies.", "/images/category-bijoux.jpg", "Bijoux"]
  );
  console.log("Blog posts OK");

  // Admin user
  const hash = await bcrypt.hash("admin123", 10);
  await conn.execute(
    'INSERT IGNORE INTO admin_users (email, password_hash) VALUES (?, ?)',
    ["admin@judickshop.com", hash]
  );
  console.log("Admin OK");

  console.log("\n✅ Seed completed successfully!");
  console.log("Admin credentials: admin@judickshop.com / admin123");

  await conn.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
