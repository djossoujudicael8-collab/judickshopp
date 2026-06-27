import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/stores/useCart";
import { getCartWhatsAppLink } from "@/const";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[60]"
        style={{ backgroundColor: "rgba(61, 46, 34, 0.4)" }}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-[420px] flex flex-col"
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#e8e4de" }}>
          <h2
            className="text-xl"
            style={{ fontFamily: "'Playfair Display', serif", color: "#3d2e22" }}
          >
            Votre Panier
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 transition-opacity hover:opacity-70"
          >
            <X size={20} color="#3d2e22" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <ShoppingBag size={48} color="#b8a18b" />
              <p
                className="text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "#b8a18b" }}
              >
                Votre panier est vide
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Thumbnail */}
                  <div
                    className="w-20 h-20 flex-shrink-0 overflow-hidden"
                    style={{ backgroundColor: "#f5f1eb" }}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-xs"
                        style={{ color: "#b8a18b" }}
                      >
                        No img
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-sm truncate"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: "#3d2e22",
                      }}
                    >
                      {item.name}
                    </h4>
                    <p
                      className="text-sm mt-1"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "#b8a18b",
                      }}
                    >
                      {item.price.toLocaleString()} FCFA
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center border transition-colors hover:bg-gray-50"
                        style={{ borderColor: "#e8e4de" }}
                      >
                        <Minus size={14} color="#3d2e22" />
                      </button>
                      <span
                        className="text-sm w-4 text-center"
                        style={{ fontFamily: "'Geist Mono', monospace" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center border transition-colors hover:bg-gray-50"
                        style={{ borderColor: "#e8e4de" }}
                      >
                        <Plus size={14} color="#3d2e22" />
                      </button>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto p-1 transition-opacity hover:opacity-70"
                      >
                        <Trash2 size={14} color="#ef4444" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t" style={{ borderColor: "#e8e4de" }}>
            <div className="flex justify-between mb-4">
              <span
                className="text-sm uppercase tracking-wider"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#5a4a3a",
                }}
              >
                Total
              </span>
              <span
                className="text-lg"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#3d2e22",
                }}
              >
                {totalPrice().toLocaleString()} FCFA
              </span>
            </div>

            <a
              href={getCartWhatsAppLink(
                items.map((i) => ({
                  name: i.name,
                  quantity: i.quantity,
                  price: i.price,
                }))
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "0.02em",
                backgroundColor: "#25d366",
              }}
            >
              Commander via WhatsApp
            </a>

            <button
              onClick={clearCart}
              className="w-full mt-2 py-2 text-xs uppercase tracking-wider transition-opacity hover:opacity-70"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: "#b8a18b",
              }}
            >
              Vider le panier
            </button>
          </div>
        )}
      </div>
    </>
  );
}
