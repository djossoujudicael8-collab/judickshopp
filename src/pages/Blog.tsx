import { Link } from "react-router";
import { trpc } from "@/providers/trpc";

export default function Blog() {
  const { data, isLoading } = trpc.blog.list.useQuery({ page: 1, limit: 9 });

  return (
    <div>
      {/* Header */}
      <section
        className="pt-32 pb-16 px-6 md:px-10 lg:px-16"
        style={{ backgroundColor: "#fffef9" }}
      >
        <div className="max-w-[1400px] mx-auto">
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
            Notre blog
          </h1>
          <p
            className="mt-4"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "#5a4a3a",
              fontSize: "16px",
              maxWidth: "600px",
            }}
          >
            Inspirations, tendances et conseils pour votre style de vie.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section
        className="py-16 md:py-24 px-6 md:px-10 lg:px-16"
        style={{ backgroundColor: "#f5f1eb" }}
      >
        <div className="max-w-[1400px] mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-200" />
                  <div className="h-4 bg-gray-200 mt-4 w-1/4" />
                  <div className="h-6 bg-gray-200 mt-2 w-3/4" />
                </div>
              ))}
            </div>
          ) : !data?.items.length ? (
            <div className="text-center py-20" style={{ color: "#b8a18b" }}>
              Aucun article disponible
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.items.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group block overflow-hidden"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <div className="aspect-video overflow-hidden" style={{ backgroundColor: "#e8e4de" }}>
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs uppercase" style={{ color: "#b8a18b" }}>No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span
                      className="text-[11px] uppercase tracking-wider"
                      style={{
                        fontFamily: "'Geist Mono', monospace",
                        color: "#b8a18b",
                      }}
                    >
                      {post.category}
                    </span>
                    <h3
                      className="mt-2 text-lg line-clamp-2 transition-colors duration-200 group-hover:text-[#b8a18b]"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: "#3d2e22",
                      }}
                    >
                      {post.title}
                    </h3>
                    <span
                      className="inline-block mt-3 text-[13px] transition-colors duration-200 group-hover:text-[#b8a18b]"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "#5a4a3a",
                      }}
                    >
                      Lire l'article &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    backgroundColor: p === 1 ? "#3d2e22" : "transparent",
                    color: p === 1 ? "#f5f1eb" : "#3d2e22",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
