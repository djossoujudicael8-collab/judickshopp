import { Link } from "react-router";
import { getWhatsAppLink } from "@/const";

interface ProductCardProps {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  categoryName?: string | null;
  images?: string[] | null;
  sku?: string | null;
}

export default function ProductCard({
  id,
  name,
  price,
  categoryName,
  images,
  sku,
}: ProductCardProps) {
  const imageUrl = images && images.length > 0 ? images[0] : null;

  return (
    <div
      className="group overflow-hidden transition-shadow duration-400 hover:shadow-lg"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Image */}
      <Link to={`/produit/${id}`} className="block">
        <div className="aspect-[3/4] overflow-hidden" style={{ backgroundColor: "#f5f1eb" }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: "#e8e4de" }}
            >
              <span
                className="text-sm uppercase tracking-wider"
                style={{ color: "#b8a18b", fontFamily: "'DM Sans', sans-serif" }}
              >
                No Image
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        {categoryName && (
          <span
            className="text-[11px] font-medium uppercase tracking-[0.06em]"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "#b8a18b",
            }}
          >
            {categoryName}
          </span>
        )}

        <Link to={`/produit/${id}`} className="block no-underline">
          <h3
            className="mt-2 text-base transition-colors duration-200 hover:text-[#b8a18b]"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#3d2e22",
              fontWeight: 400,
            }}
          >
            {name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-3">
          <span
            className="text-lg"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#3d2e22",
              fontWeight: 400,
            }}
          >
            {price.toLocaleString()} FCFA
          </span>

          <a
            href={getWhatsAppLink({
              name,
              sku: sku ?? `PROD-${id}`,
              price,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-medium px-4 py-2 transition-colors duration-200 hover:opacity-90"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              backgroundColor: "#3d2e22",
              color: "#f5f1eb",
              letterSpacing: "0.02em",
            }}
          >
            Commander
          </a>
        </div>
      </div>
    </div>
  );
}
