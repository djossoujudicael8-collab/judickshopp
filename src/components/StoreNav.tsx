import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Search, ShoppingBag, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "@/stores/useTheme";
import { useCart } from "@/stores/useCart";
import { trpc } from "@/providers/trpc";

export default function StoreNav() {
  const { toggleTheme, isDark } = useTheme();
  const { totalItems, setIsOpen } = useCart();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { label: "Accueil", path: "/" },
    { label: "Catalogue", path: "/catalogue" },
    { label: "Blog", path: "/blog" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 md:px-8 lg:px-12"
        style={{
          backgroundColor: "#f5f1eb",
          borderBottom: "1px solid #e8e4de",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="text-xl tracking-[0.08em] uppercase no-underline"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#3d2e22",
            fontWeight: 400,
          }}
        >
          JUDICKSHOP
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="relative text-sm font-medium uppercase tracking-[0.05em] transition-all duration-300 hover:underline"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#3d2e22",
                textUnderlineOffset: "4px",
                textDecorationThickness: "1px",
                textDecorationColor: "#b8a18b",
                textDecorationLine: isActive(link.path) ? "underline" : "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-1 transition-opacity hover:opacity-70"
            aria-label="Search"
          >
            <Search size={20} color="#3d2e22" />
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="p-1 relative transition-opacity hover:opacity-70"
            aria-label="Cart"
          >
            <ShoppingBag size={20} color="#3d2e22" />
            {totalItems() > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                style={{ backgroundColor: "#c9a87c" }}
              >
                {totalItems()}
              </span>
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-400 hover:scale-105"
            style={{ borderColor: "#e8e4de" }}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun size={18} color="#3d2e22" />
            ) : (
              <Moon size={18} color="#3d2e22" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X size={24} color="#3d2e22" />
            ) : (
              <Menu size={24} color="#3d2e22" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 pt-16 md:hidden"
          style={{ backgroundColor: "rgba(245, 241, 235, 0.98)" }}
        >
          <div className="flex flex-col items-center gap-8 pt-12">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl uppercase tracking-[0.05em]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#3d2e22",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-32 px-4"
          style={{
            backgroundColor: "rgba(245, 241, 235, 0.97)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="w-full max-w-2xl relative">
            <div className="flex items-center justify-between mb-8">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full bg-transparent text-3xl md:text-4xl outline-none placeholder:opacity-50"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#3d2e22",
                  borderBottom: "2px solid #3d2e22",
                  paddingBottom: "1rem",
                }}
                autoFocus
              />
            </div>
            {searchQuery.length > 0 && (
              <SearchResults
                query={searchQuery}
                onSelect={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
              />
            )}
          </div>
          <button
            className="absolute top-8 right-8 z-[101]"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
          >
            <X size={24} color="#3d2e22" />
          </button>
        </div>
      )}
    </>
  );
}

function SearchResults({
  query,
  onSelect,
}: {
  query: string;
  onSelect: () => void;
}) {
  const { data } = trpc.product.list.useQuery({
    search: query,
    limit: 5,
  });

  if (!data?.items.length) {
    return (
      <p
        className="text-center py-8"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          color: "#b8a18b",
        }}
      >
        Aucun produit trouve
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.items.map((product) => (
        <Link
          key={product.id}
          to={`/produit/${product.id}`}
          onClick={onSelect}
          className="flex items-center gap-4 p-4 transition-colors hover:bg-white/50 rounded-lg"
        >
          <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
            {product.images && product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-xs"
                style={{ backgroundColor: "#e8e4de", color: "#b8a18b" }}
              >
                No image
              </div>
            )}
          </div>
          <div>
            <p
              className="text-lg"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#3d2e22",
              }}
            >
              {product.name}
            </p>
            <p
              className="text-sm"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#b8a18b",
              }}
            >
              {product.price.toLocaleString()} FCFA
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
