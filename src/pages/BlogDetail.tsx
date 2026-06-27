import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  const { data: post, isLoading } = trpc.blog.getById.useQuery({ id: postId });
  const { data: relatedPosts } = trpc.blog.getRelated.useQuery(
    {
      id: postId,
      category: post?.category ?? undefined,
    },
    { enabled: !!post }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fffef9" }}>
        <div style={{ color: "#b8a18b" }}>Chargement...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fffef9" }}>
        <div className="text-center">
          <p style={{ fontFamily: "'Playfair Display', serif", color: "#3d2e22", fontSize: "1.5rem" }}>
            Article non trouve
          </p>
          <Link to="/blog" className="mt-4 inline-block text-sm underline" style={{ color: "#b8a18b" }}>
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date(post.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  // Split content by newlines for rendering
  const contentBlocks = post.content.split("\n\n").filter(Boolean);

  return (
    <div>
      {/* Article Header */}
      <section
        className="pt-32 pb-16 px-6 md:px-10 lg:px-16 text-center"
        style={{ backgroundColor: "#3d2e22" }}
      >
        <div className="max-w-[800px] mx-auto">
          <div className="text-xs mb-6" style={{ fontFamily: "'DM Sans', sans-serif", color: "#b8a18b" }}>
            <Link to="/" className="hover:underline" style={{ color: "#b8a18b" }}>Accueil</Link>
            {" / "}
            <Link to="/blog" className="hover:underline" style={{ color: "#b8a18b" }}>Blog</Link>
            {" / "}
            <span style={{ color: "#f5f1eb" }}>Article</span>
          </div>

          {post.category && (
            <span
              className="inline-block text-[11px] uppercase tracking-[0.1em] px-3 py-1"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#b8a18b",
                border: "1px solid #5a4a3a",
              }}
            >
              {post.category}
            </span>
          )}

          <h1
            className="mt-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 400,
              color: "#f5f1eb",
              lineHeight: 1.1,
            }}
          >
            {post.title}
          </h1>

          <p
            className="mt-4"
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "12px",
              color: "#b8a18b",
            }}
          >
            {formattedDate} &bull; {Math.ceil(post.content.length / 1500)} min de lecture
          </p>
        </div>
      </section>

      {/* Article Content */}
      <section
        className="py-16 md:py-24 px-6 md:px-10 lg:px-16"
        style={{ backgroundColor: "#fffef9" }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Featured Image */}
          {post.coverImage && (
            <div className="max-w-[900px] mx-auto mb-12 aspect-video overflow-hidden" style={{ backgroundColor: "#e8e4de" }}>
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="max-w-[65ch] mx-auto">
            {contentBlocks.map((block, idx) => {
              if (block.startsWith("## ")) {
                return (
                  <h2
                    key={idx}
                    className="mt-12 mb-4"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "24px",
                      fontWeight: 400,
                      color: "#3d2e22",
                    }}
                  >
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.startsWith("> ")) {
                return (
                  <blockquote
                    key={idx}
                    className="my-8 py-2 pl-6"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "20px",
                      fontStyle: "italic",
                      color: "#5a4a3a",
                      borderLeft: "3px solid #b8a18b",
                    }}
                  >
                    {block.replace("> ", "")}
                  </blockquote>
                );
              }
              return (
                <p
                  key={idx}
                  className="mb-6"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "16px",
                    color: "#3d2e22",
                    lineHeight: 1.8,
                  }}
                >
                  {block}
                </p>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section
          className="py-16 md:py-24 px-6 md:px-10 lg:px-16"
          style={{ backgroundColor: "#f5f1eb" }}
        >
          <div className="max-w-[1400px] mx-auto">
            <h2
              className="mb-12"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 400,
                color: "#3d2e22",
                letterSpacing: "-0.01em",
                textTransform: "uppercase",
              }}
            >
              Articles similaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/blog/${rp.id}`}
                  className="group block overflow-hidden"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <div className="aspect-video overflow-hidden" style={{ backgroundColor: "#e8e4de" }}>
                    {rp.coverImage ? (
                      <img
                        src={rp.coverImage}
                        alt={rp.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs uppercase" style={{ color: "#b8a18b" }}>No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3
                      className="text-lg line-clamp-2 transition-colors duration-200 group-hover:text-[#b8a18b]"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: "#3d2e22",
                      }}
                    >
                      {rp.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
