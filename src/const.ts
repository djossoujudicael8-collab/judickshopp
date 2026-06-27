export const LOGIN_PATH = "/login";
export const WHATSAPP_NUMBER = "2290166990841";

export function getWhatsAppLink(product?: {
  name: string;
  sku: string;
  price: number;
}) {
  const baseUrl = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (product) {
    const message = `Bonjour, je suis interesse par le produit "${product.name}" (Ref: ${product.sku}, Prix: ${product.price} FCFA). Est-il encore disponible ?`;
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }
  return `${baseUrl}?text=${encodeURIComponent("Bonjour, j'ai une question.")}`;
}

export function getCartWhatsAppLink(items: {
  name: string;
  quantity: number;
  price: number;
}[]) {
  const baseUrl = `https://wa.me/${WHATSAPP_NUMBER}`;
  const itemList = items
    .map((item) => `- ${item.name} (x${item.quantity}): ${item.price * item.quantity} FCFA`)
    .join("\n");
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const message = `Bonjour, je souhaite commander les articles suivants:\n\n${itemList}\n\nTotal: ${total} FCFA\n\nMerci de me confirmer la disponibilite.`;
  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
