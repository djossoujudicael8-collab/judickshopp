import { useEffect, useRef } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { trpc } from "@/providers/trpc";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(
        ".hero-content > *",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.3,
        }
      );

      gsap.fromTo(
        ".hero-image",
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0 0 0)",
          duration: 1.5,
          ease: "power3.inOut",
          delay: 0.3,
        }
      );

      // Section reveals
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
            },
          }
        );
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef}>
      {/* Hero Section */}
      <section
        className="min-h-[100dvh] flex flex-col lg:flex-row"
        style={{ backgroundColor: "#fffef9" }}
      >
        {/* Left Content */}
        <div
          className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-16 pt-24 pb-12 lg:pt-0 lg:pb-0"
          style={{ maxWidth: "55%" }}
        >
          <div className="hero-content max-w-xl">
            <div
              className="w-10 h-px mb-8"
              style={{ backgroundColor: "#b8a18b" }}
            />
            <p
              className="text-xs font-medium uppercase tracking-[0.15em] mb-6"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#b8a18b",
              }}
            >
              Decouvrez notre univers
            </p>
            <h1
              className="uppercase leading-none"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(3rem, 6vw, 6rem)",
                fontWeight: 400,
                color: "#3d2e22",
                letterSpacing: "-0.02em",
              }}
            >
              Des tresors
              <br />
              <em>pour votre style</em>
            </h1>
            <p
              className="mt-8 text-base leading-relaxed"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#5a4a3a",
                maxWidth: "480px",
              }}
            >
              JUDICKSHOP — Vetements, Electroniques & Bijoux soigneusement
              selectionnes pour vous.
            </p>
            <Link
              to="/catalogue"
              className="inline-block mt-12 text-sm font-medium uppercase tracking-[0.05em] px-10 py-4 transition-colors duration-300 hover:opacity-90"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                backgroundColor: "#3d2e22",
                color: "#f5f1eb",
              }}
            >
              Explorer le catalogue
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="hidden lg:block flex-1 hero-image">
          <img
            src="/images/hero-home.jpg"
            alt="JUDICKSHOP Collection"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Featured Products */}
      <section
        className="reveal-section py-20 md:py-32 px-6 md:px-10 lg:px-16"
        style={{ backgroundColor: "#f5f1eb" }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-12">
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 400,
                color: "#3d2e22",
                letterSpacing: "-0.01em",
                textTransform: "uppercase",
              }}
            >
              Nos produits phares
            </h2>
            <Link
              to="/catalogue"
              className="hidden md:flex items-center gap-2 text-sm transition-colors duration-200 hover:text-[#b8a18b]"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#3d2e22",
              }}
            >
              Voir tout <ArrowRight size={16} />
            </Link>
          </div>
          <FeaturedProducts />
        </div>
      </section>

      {/* Categories */}
      <section
        className="reveal-section py-20 md:py-32 px-6 md:px-10 lg:px-16"
        style={{ backgroundColor: "#fffef9" }}
      >
        <div className="max-w-[1000px] mx-auto">
          <h2
            className="text-center mb-12"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 400,
              color: "#3d2e22",
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
            }}
          >
            Explorez nos categories
          </h2>
          <CategoriesGrid />
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section
        className="reveal-section py-20 md:py-32 px-6 md:px-10 lg:px-16"
        style={{ backgroundColor: "#3d2e22" }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-12">
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 400,
                color: "#f5f1eb",
                letterSpacing: "-0.01em",
                textTransform: "uppercase",
              }}
            >
              Nos dernieres actualites
            </h2>
            <Link
              to="/blog"
              className="hidden md:flex items-center gap-2 text-sm transition-colors duration-200 hover:text-white"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#b8a18b",
              }}
            >
              Tous les articles <ArrowRight size={16} />
            </Link>
          </div>
          <LatestBlogPosts />
        </div>
      </section>

      {/* Newsletter CTA */}
      <section
        className="reveal-section py-20 md:py-24 px-6 text-center"
        style={{ backgroundColor: "#f5f1eb" }}
      >
        <div className="max-w-lg mx-auto">
          <div
            className="w-10 h-px mx-auto mb-8"
            style={{ backgroundColor: "#b8a18b" }}
          />
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 400,
              color: "#3d2e22",
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
            }}
          >
            Restez inspire
          </h2>
          <p
            className="mt-4 mb-8"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "#5a4a3a",
              fontSize: "16px",
              maxWidth: "500px",
              margin: "1rem auto 2rem",
            }}
          >
            Inscrivez-vous pour decouvrir nos nouveautes et offres exclusives.
          </p>
          <div className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-5 py-4 text-sm outline-none"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                backgroundColor: "#ffffff",
                border: "1px solid #e8e4de",
                color: "#3d2e22",
              }}
            />
            <button
              className="px-8 py-4 text-sm font-medium uppercase tracking-wider transition-colors duration-200 hover:opacity-90"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                backgroundColor: "#3d2e22",
                color: "#f5f1eb",
              }}
              onClick={() => {
                const { useToast } = require("@/stores/useToast");
                useToast.getState().addToast("Fonctionnalite bientot disponible", "info");
              }}
            >
              S'inscrire
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeaturedProducts() {
  const { data } = trpc.product.list.useQuery({ limit: 4 });

  if (!data?.items.length) {
    return (
      <div className="text-center py-12" style={{ color: "#b8a18b" }}>
        Aucun produit disponible
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.items.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}

function CategoriesGrid() {
  const { data: categories } = trpc.category.list.useQuery();

  const categoryImages: Record<string, string> = {
    Vetements: "/images/category-vetements.jpg",
    Electroniques: "/images/category-electroniques.jpg",
    Bijoux: "/images/category-bijoux.jpg",
  };

  if (!categories?.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          to={`/catalogue?category=${cat.id}`}
          className="group block"
        >
          <div className="aspect-[4/3] overflow-hidden" style={{ backgroundColor: "#e8e4de" }}>
            <img
              src={categoryImages[cat.name] || "/images/category-vetements.jpg"}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <h3
            className="pt-4 text-xl"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#3d2e22",
              fontWeight: 400,
            }}
          >
            {cat.name}
          </h3>
        </Link>
      ))}
    </div>
  );
}

function LatestBlogPosts() {
  const { data } = trpc.blog.list.useQuery({ limit: 3 });

  if (!data?.items.length) {
    return (
      <div className="text-center py-12" style={{ color: "#b8a18b" }}>
        Aucun article disponible
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.items.map((post) => (
        <Link
          key={post.id}
          to={`/blog/${post.id}`}
          className="group block overflow-hidden"
          style={{ backgroundColor: "#2a1f14" }}
        >
          <div className="aspect-video overflow-hidden" style={{ backgroundColor: "#1a1410" }}>
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#1a1410" }}>
                <span className="text-xs uppercase" style={{ color: "#5a4a3a" }}>
                  No image
                </span>
              </div>
            )}
          </div>
          <div className="p-6">
            <span
              className="text-[11px]"
              style={{
                fontFamily: "'Geist Mono', monospace",
                color: "#b8a18b",
              }}
            >
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("fr-FR")
                : new Date(post.createdAt).toLocaleDateString("fr-FR")}
            </span>
            <h3
              className="mt-3 text-lg line-clamp-2 transition-colors duration-200 group-hover:text-[#b8a18b]"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#f5f1eb",
              }}
            >
              {post.title}
            </h3>
            <span
              className="inline-block mt-4 text-[13px] transition-colors duration-200 group-hover:text-[#f5f1eb]"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#b8a18b",
              }}
            >
              Lire l'article &rarr;
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
