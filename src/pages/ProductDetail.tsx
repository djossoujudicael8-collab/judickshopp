import { useState } from "react";
import { useParams, Link } from "react-router";
import { Truck, ShieldCheck } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/stores/useCart";
import { trpc } from "@/providers/trpc";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();

  const { data: product, isLoading } = trpc.product.getById.useQuery({
    id: productId,
  });

  const { data: relatedProducts } = trpc.product.getRelated.useQuery(
    {
      id: productId,
      categoryId: product?.categoryId ?? 0,
    },
    { enabled: !!product }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fffef9" }}>
        <div className="animate-pulse text-center" style={{ color: "#b8a18b" }}>
          Chargement...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fffef9" }}>
        <div className="text-center">
          <p style={{ fontFamily: "'Playfair Display', serif", color: "#3d2e22", fontSize: "1.5rem" }}>
            Produit non trouve
          </p>
          <Link to="/catalogue" className="mt-4 inline-block text-sm underline" style={{ color: "#b8a18b" }}>
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <div>
      {/* Product Hero */}
      <section
        className="pt-28 pb-12 px-6 md:px-10 lg:px-16"
        style={{ backgroundColor: "#fffef9" }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Left - Images */}
            <div className="lg:w-[55%]">
              <div className="flex gap-4">
                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex flex-col gap-2 w-20">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className="aspect-square overflow-hidden border-2 transition-colors"
                        style={{
                          borderColor: selectedImage === idx ? "#3d2e22" : "transparent",
                        }}
                      >
                        <img
                          src={img}
                          alt={`${product.name} - ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Image */}
                <div className="flex-1 aspect-[3/4] overflow-hidden" style={{ backgroundColor: "#f5f1eb" }}>
                  {images.length > 0 ? (
                    <img
                      src={images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-sm uppercase" style={{ color: "#b8a18b" }}>No image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right - Details */}
            <div className="lg:w-[45%] pt-4">
              {/* Breadcrumb */}
              <div className="text-xs mb-6" style={{ fontFamily: "'DM Sans', sans-serif", color: "#b8a18b" }}>
                <Link to="/" className="hover:underline" style={{ color: "#b8a18b" }}>Accueil</Link>
                {" / "}
                <Link to="/catalogue" className="hover:underline" style={{ color: "#b8a18b" }}>Catalogue</Link>
                {" / "}
                {product.categoryName && (
                  <>
                    <Link
                      to={`/catalogue?category=${product.categoryId}`}
                      className="hover:underline"
                      style={{ color: "#b8a18b" }}
                    >
                      {product.categoryName}
                    </Link>
                    {" / "}
                  </>
                )}
                <span style={{ color: "#3d2e22" }}>{product.name}</span>
              </div>

              {/* Category */}
              <span
                className="text-xs uppercase tracking-[0.1em]"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#b8a18b",
                }}
              >
                {product.categoryName}
              </span>

              {/* Name */}
              <h1
                className="mt-2"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                  fontWeight: 400,
                  color: "#3d2e22",
                }}
              >
                {product.name}
              </h1>

              {/* Price */}
              <p
                className="mt-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  color: "#c9a87c",
                }}
              >
                {product.price.toLocaleString()} FCFA
              </p>

              {/* Description */}
              <p
                className="mt-8 leading-relaxed"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#5a4a3a",
                  fontSize: "16px",
                  maxWidth: "50ch",
                }}
              >
                {product.description}
              </p>

              {/* SKU */}
              {product.sku && (
                <p
                  className="mt-4 text-xs"
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    color: "#b8a18b",
                  }}
                >
                  Ref: {product.sku}
                </p>
              )}

              {/* WhatsApp Order */}
              <div className="mt-10">
                <WhatsAppButton
                  product={{
                    name: product.name,
                    sku: product.sku ?? `PROD-${product.id}`,
                    price: product.price,
                  }}
                />
              </div>

              {/* Add to Cart */}
              <button
                onClick={() =>
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: images[0] ?? "",
                    sku: product.sku ?? `PROD-${product.id}`,
                  })
                }
                className="mt-4 w-full lg:w-auto px-8 py-3.5 text-sm font-medium transition-all duration-200 hover:opacity-90 border-2"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.02em",
                  backgroundColor: "transparent",
                  color: "#3d2e22",
                  borderColor: "#3d2e22",
                }}
              >
                Ajouter au panier
              </button>

              {/* Info */}
              <div className="mt-12 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Truck size={18} color="#b8a18b" />
                  <span
                    className="text-[13px]"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "#5a4a3a" }}
                  >
                    Livraison disponible
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} color="#b8a18b" />
                  <span
                    className="text-[13px]"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "#5a4a3a" }}
                  >
                    Paiement securise
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
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
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
