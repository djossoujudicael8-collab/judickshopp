import { Link } from "react-router";

export default function StoreFooter() {
  return (
    <footer
      className="w-full px-4 md:px-8 lg:px-12 py-12 md:py-16"
      style={{ backgroundColor: "#3d2e22" }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <span
            className="text-lg tracking-[0.08em] uppercase"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#f5f1eb",
              fontWeight: 400,
            }}
          >
            JUDICKSHOP
          </span>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            {[
              { label: "Accueil", path: "/" },
              { label: "Catalogue", path: "/catalogue" },
              { label: "Blog", path: "/blog" },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm transition-colors duration-200 hover:text-[#f5f1eb]"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#b8a18b",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          className="my-8"
          style={{ borderTop: "1px solid #5a4a3a" }}
        />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <span
            className="text-xs"
            style={{
              fontFamily: "'Geist Mono', monospace",
              color: "#b8a18b",
            }}
          >
            &copy; 2025 JUDICKSHOP
          </span>
          <span
            className="text-xs"
            style={{
              fontFamily: "'Geist Mono', monospace",
              color: "#b8a18b",
            }}
          >
            Benin
          </span>
        </div>
      </div>
    </footer>
  );
}
