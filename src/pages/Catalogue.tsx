import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { PackageX } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import { trpc } from "@/providers/trpc";

export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<number | undefined>(
    searchParams.get("category")
      ? Number(searchParams.get("category"))
      : undefined
  );
  const [sort, setSort] = useState<"recent" | "price_asc" | "price_desc">("recent");
  const [page, setPage] = useState(1);

  const { data: categories } = trpc.category.list.useQuery();
  const { data: productsData, isLoading } = trpc.product.list.useQuery({
    categoryId: activeCategory,
    sort,
    page,
    limit: 12,
  });

  useEffect(() => {
    setPage(1);
  }, [activeCategory, sort]);

  const handleCategoryChange = (catId?: number) => {
    setActiveCategory(catId);
    if (catId) {
      setSearchParams({ category: String(catId) });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div>
      {/* Header */}
      <section
        className="pt-32 pb-16 px-6 md:px-10 lg:px-16"
        style={{ backgroundColor: "#fffef9" }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="text-sm mb-6" style={{ fontFamily: "'DM Sans', sans-serif", color: "#b8a18b" }}>
            <Link to="/" className="hover:underline" style={{ color: "#b8a18b" }}>Accueil</Link>
            {" / "}
            <span style={{ color: "#3d2e22" }}>Catalogue</span>
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(3rem, 6vw, 6rem)",
              fontWeight: 400,
              color: "#3d2e22",
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            Notre catalogue
          </h1>
          <p
            className="mt-3"
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "14px",
              color: "#b8a18b",
            }}
          >
            {productsData?.total ?? 0} produits
          </p>
        </div>
      </section>

      {/* Filters & Grid */}
      <section
        className="py-16 md:py-24 px-6 md:px-10 lg:px-16"
        style={{ backgroundColor: "#f5f1eb" }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            <button
              onClick={() => handleCategoryChange(undefined)}
              className="px-5 py-2 text-[13px] font-medium transition-all duration-200"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                backgroundColor: activeCategory === undefined ? "#3d2e22" : "#ffffff",
                color: activeCategory === undefined ? "#f5f1eb" : "#3d2e22",
                border: "1px solid",
                borderColor: activeCategory === undefined ? "#3d2e22" : "#e8e4de",
              }}
            >
              Tous
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className="px-5 py-2 text-[13px] font-medium transition-all duration-200 hover:border-[#b8a18b]"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  backgroundColor: activeCategory === cat.id ? "#3d2e22" : "#ffffff",
                  color: activeCategory === cat.id ? "#f5f1eb" : "#3d2e22",
                  border: "1px solid",
                  borderColor: activeCategory === cat.id ? "#3d2e22" : "#e8e4de",
                }}
              >
                {cat.name}
              </button>
            ))}

            <div className="ml-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="px-4 py-2 text-[13px] outline-none cursor-pointer"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e8e4de",
                  color: "#3d2e22",
                }}
              >
                <option value="recent">Plus recents</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix decroissant</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200" />
                  <div className="h-4 bg-gray-200 mt-4 w-3/4" />
                  <div className="h-4 bg-gray-200 mt-2 w-1/2" />
                </div>
              ))}
            </div>
          ) : productsData?.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <PackageX size={48} color="#b8a18b" />
              <p
                className="mt-4"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#5a4a3a",
                  fontSize: "16px",
                }}
              >
                Aucun produit dans cette categorie
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productsData?.items.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {productsData && productsData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center disabled:opacity-30 transition-opacity"
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  color: "#3d2e22",
                }}
              >
                &larr;
              </button>
              {Array.from({ length: productsData.totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-200"
                    style={{
                      fontFamily: "'Geist Mono', monospace",
                      backgroundColor: p === page ? "#3d2e22" : "transparent",
                      color: p === page ? "#f5f1eb" : "#3d2e22",
                    }}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => setPage((p) => Math.min(productsData.totalPages, p + 1))}
                disabled={page === productsData.totalPages}
                className="w-8 h-8 flex items-center justify-center disabled:opacity-30 transition-opacity"
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  color: "#3d2e22",
                }}
              >
                &rarr;
              </button>
            </div>
          )}
        </div>
      </section>

      {/* WhatsApp CTA Banner */}
      <section
        className="py-16 px-6 md:px-10 lg:px-16 text-center"
        style={{ backgroundColor: "#3d2e22" }}
      >
        <div className="max-w-lg mx-auto">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#25d366" className="mx-auto mb-4">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <h3
            className="text-2xl"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#f5f1eb",
              fontWeight: 400,
            }}
          >
            Une question ? Contactez-nous
          </h3>
          <p
            className="mt-3 mb-8"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "#b8a18b",
              fontSize: "16px",
              maxWidth: "500px",
              margin: "0.75rem auto 2rem",
            }}
          >
            Notre equipe vous repond directement sur WhatsApp pour toute commande ou information.
          </p>
          <WhatsAppButton />
        </div>
      </section>
    </div>
  );
}
