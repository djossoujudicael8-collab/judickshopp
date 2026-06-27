import { getDb } from "../api/queries/connection";
import { categories, products, blogPosts, adminUsers } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  const db = getDb();

  // Seed categories
  const cats = await db.insert(categories).values([
    { name: "Vêtements" },
    { name: "Électroniques" },
    { name: "Bijoux" },
  ]).$returningId();

  console.log("Seeded categories:", cats);

  // Get the inserted category IDs
  const allCategories = await db.select().from(categories);
  const vetementsId = allCategories.find(c => c.name === "Vêtements")!.id;
  const electroniquesId = allCategories.find(c => c.name === "Électroniques")!.id;
  const bijouxId = allCategories.find(c => c.name === "Bijoux")!.id;

  // Seed products
  const prods = await db.insert(products).values([
    {
      name: "Blazer Premium Lin",
      description: "Blazer élégant en lin naturel, coupe ajustée. Parfait pour les occasions formelles ou un look décontracté chic. Disponible en plusieurs tailles.",
      price: 45000,
      categoryId: vetementsId,
      images: ["/images/category-vetements.jpg"],
      sku: "BLZ-LIN-001",
    },
    {
      name: "Chemise en Coton Bio",
      description: "Chemise confectionnée en coton biologique de haute qualité. Coupe moderne, col italien, boutons en nacre naturelle.",
      price: 25000,
      categoryId: vetementsId,
      images: ["/images/category-vetements.jpg"],
      sku: "CHM-BIO-002",
    },
    {
      name: "Écouteurs Sans Fil Pro",
      description: "Écouteurs Bluetooth 5.3 avec réduction de bruit active. Autonomie 30h avec le boîtier. Son haute fidélité, confort optimal.",
      price: 35000,
      categoryId: electroniquesId,
      images: ["/images/category-electroniques.jpg"],
      sku: "ECU-PRO-003",
    },
    {
      name: "Montre Connectée Élégance",
      description: "Montre intelligente avec écran AMOLED, suivi de la santé, GPS intégré. Bracelet en cuir véritable interchangeables.",
      price: 55000,
      categoryId: electroniquesId,
      images: ["/images/category-electroniques.jpg"],
      sku: "MTR-CON-004",
    },
    {
      name: "Bracelet Or 18K",
      description: "Bracelet en or 18 carats, design contemporain et intemporel. Finition polie miroir. Chaîne ajustable.",
      price: 125000,
      categoryId: bijouxId,
      images: ["/images/category-bijoux.jpg"],
      sku: "BRZ-OR0-005",
    },
    {
      name: "Bagues Empilables",
      description: "Set de 3 bagues en argent sterling 925 avec finition dorée. Design minimaliste, parfaites à porter seules ou empilées.",
      price: 28000,
      categoryId: bijouxId,
      images: ["/images/category-bijoux.jpg"],
      sku: "BGQ-EMP-006",
    },
    {
      name: "T-Shirt Premium Oversize",
      description: "T-shirt oversize en coton peigné 240g/m². Coupe boxy moderne, finitions bords-côtes. Confort et style au quotidien.",
      price: 18000,
      categoryId: vetementsId,
      images: ["/images/category-vetements.jpg"],
      sku: "TSH-OVR-007",
    },
    {
      name: "Chargeur Portable 20000mAh",
      description: "Batterie externe haute capacité avec charge rapide 65W. 2 ports USB-C + 1 USB-A. Design aluminium compact et léger.",
      price: 22000,
      categoryId: electroniquesId,
      images: ["/images/category-electroniques.jpg"],
      sku: "CHR-20K-008",
    },
  ]).$returningId();

  console.log("Seeded products:", prods);

  // Seed blog posts
  const posts = await db.insert(blogPosts).values([
    {
      title: "Comment Choisir Votre Style Personnalisé",
      content: "Trouver son style personnel est un voyage qui mérite d'être savouré. Chez JUDICKSHOP, nous croyons que chaque personne a une esthétique unique qui mérite d'être exprimée.\n\n## Commencez par les bases\n\nUn vestiaire bien construit commence par des pièces intemporelles. Investissez dans des vêtements de qualité qui dureront des années. Un blazer en lin, une chemise en coton bio, un jean parfaitement ajusté — ces fondations vous serviront dans toutes les occasions.\n\n## L'importance des accessoires\n\nLes accessoires sont ce qui transforme une tenue basique en look mémorable. Une montre élégante, un bracelet délicat ou des écouteurs design peuvent faire toute la différence.\n\n## Trouvez votre palette\n\nLes couleurs neutres — beige, crème, brun, noir — forment une base polyvalente. Ajoutez des touches de couleur selon votre personnalité et votre humeur.",
      coverImage: "/images/category-vetements.jpg",
      category: "Style",
    },
    {
      title: "Les Tendances Tech de 2025",
      content: "Le monde de la technologie évolue à une vitesse fulgurante. Découvrez les gadgets qui feront la différence cette année.\n\n## L'audio sans fil réinventé\n\nLes écouteurs de nouvelle génération offrent une qualité sonore exceptionnelle avec une réduction de bruit toujours plus performante. L'autonomie atteint désormais des records avec jusqu'à 40 heures d'écoute.\n\n## Les montres connectées deviennent indispensables\n\nAu-delà du suivi d'activité, les montres intelligentes d'aujourd'hui intègrent des fonctionnalités de santé avancées, des paiements sans contact et une personnalisation poussée.\n\n## Un design qui compte\n\nLa technologie ne se contente plus d'être fonctionnelle — elle doit aussi être belle. Les finitions premium, les matériaux nobles et l'attention aux détails font la différence.",
      coverImage: "/images/category-electroniques.jpg",
      category: "Technologie",
    },
    {
      title: "L'Art des Bijoux Contemporains",
      content: "Les bijoux contemporains marient tradition artisanale et design moderne. Découvrez comment choisir des pièces qui racontent votre histoire.\n\n## Le minimalisme intemporel\n\nLes lignes épurées et les formes géométriques dominent la joaillerie contemporaine. Ces pièces s'adaptent à toutes les occasions, du quotidien aux événements les plus prestigieux.\n\n## Les matériaux nobles\n\nL'or 18 carats et l'argent sterling 925 restent les choix privilégiés pour leur durabilité et leur éclat. Les finitions polies ou brossées offrent des looks distincts.\n\n## L'empilage, une tendance affirmée\n\nPorter plusieurs bagues ou bracelets ensemble crée un style personnel unique. Mixez les métaux, les textures et les épaisseurs pour un résultat harmonieux.",
      coverImage: "/images/category-bijoux.jpg",
      category: "Bijoux",
    },
  ]).$returningId();

  console.log("Seeded blog posts:", posts);

  // Seed admin user (password: admin123)
  const passwordHash = await bcrypt.hash("admin123", 10);
  const admins = await db.insert(adminUsers).values([
    {
      email: "admin@judickshop.com",
      passwordHash,
    },
  ]).$returningId();

  console.log("Seeded admin user:", admins);
  console.log("\nAdmin credentials: admin@judickshop.com / admin123");

  console.log("\n✅ Seed completed successfully!");
}

seed().catch(console.error);
