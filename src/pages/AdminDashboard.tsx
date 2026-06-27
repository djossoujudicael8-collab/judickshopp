import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Package,
  FileText,
  LogOut,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  Tag,
} from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/stores/useToast";
import { trpc } from "@/providers/trpc";

export default function AdminDashboard() {
  const { admin, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "blog">("products");

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#3d2e22" }}>
        <Loader2 size={32} color="#b8a18b" className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#3d2e22" }}>
      {/* Admin Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6"
        style={{
          backgroundColor: "#3d2e22",
          borderBottom: "1px solid #5a4a3a",
        }}
      >
        <span
          className="text-lg tracking-[0.05em] uppercase"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#b8a18b",
            fontSize: "18px",
          }}
        >
          JUDICKSHOP
        </span>

        <span
          className="hidden md:block text-xs uppercase"
          style={{
            fontFamily: "'Geist Mono', monospace",
            color: "#b8a18b",
          }}
        >
          Tableau de bord
        </span>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-xs uppercase transition-colors hover:text-[#f5f1eb]"
          style={{
            fontFamily: "'Geist Mono', monospace",
            color: "#b8a18b",
          }}
        >
          <LogOut size={16} />
          Deconnexion
        </button>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-8 px-4 md:px-6">
        {/* Stats */}
        <StatsRow />

        {/* Tabs */}
        <div
          className="flex gap-0 mt-8 mb-6 border-b"
          style={{ borderColor: "#5a4a3a" }}
        >
          {([
            { key: "products", label: "Produits" },
            { key: "categories", label: "Categories" },
            { key: "blog", label: "Blog" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-6 py-3 text-[13px] uppercase transition-all duration-200"
              style={{
                fontFamily: "'Geist Mono', monospace",
                color: activeTab === tab.key ? "#f5f1eb" : "#b8a18b",
                borderBottom: activeTab === tab.key ? "2px solid #b8a18b" : "2px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-[1400px]">
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "categories" && <CategoriesTab />}
          {activeTab === "blog" && <BlogTab />}
        </div>
      </main>

      {/* Admin Footer */}
      <footer
        className="py-6 px-6 text-center"
        style={{ backgroundColor: "#3d2e22", borderTop: "1px solid #5a4a3a" }}
      >
        <span
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "12px",
            color: "#b8a18b",
          }}
        >
          &copy; 2025 JUDICKSHOP — Espace Administrateur
        </span>
      </footer>
    </div>
  );
}

// ========== STATS ==========
function StatsRow() {
  const { data: productCount } = trpc.product.count.useQuery();
  const { data: blogCount } = trpc.blog.list.useQuery({ limit: 1 });
  const { data: categories } = trpc.category.list.useQuery();

  const stats = [
    { icon: Package, label: "Produits", value: productCount ?? 0 },
    { icon: Tag, label: "Categories", value: categories?.length ?? 0 },
    { icon: FileText, label: "Articles", value: blogCount?.total ?? 0 },
    { icon: Package, label: "Commandes", value: 0 },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="p-6"
          style={{
            backgroundColor: "#2a1f14",
            border: "1px solid #5a4a3a",
          }}
        >
          <stat.icon size={20} color="#b8a18b" className="mb-3" />
          <p
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              color: "#f5f1eb",
            }}
          >
            {stat.value}
          </p>
          <p
            className="mt-1"
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "11px",
              color: "#b8a18b",
              textTransform: "uppercase",
            }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ========== PRODUCTS TAB ==========
function ProductsTab() {
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: productsData, isLoading } = trpc.product.list.useQuery({
    search: search || undefined,
    limit: 50,
  });
  const { data: categories } = trpc.category.list.useQuery();

  const deleteMutation = trpc.product.delete.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      addToast("Produit supprime", "success");
    },
  });

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 text-[13px] uppercase tracking-wider transition-colors hover:opacity-90"
          style={{
            fontFamily: "'Geist Mono', monospace",
            backgroundColor: "#b8a18b",
            color: "#3d2e22",
          }}
        >
          <Plus size={16} />
          Nouveau produit
        </button>

        <div className="relative w-full sm:w-72">
          <Search size={16} color="#b8a18b" className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#b8a18b] transition-colors"
            style={{
              fontFamily: "'Geist Mono', monospace",
              backgroundColor: "#3d2e22",
              color: "#f5f1eb",
              border: "1px solid #5a4a3a",
            }}
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-12" style={{ color: "#b8a18b" }}>
          Chargement...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "2px solid #5a4a3a" }}>
                {["Image", "Nom", "Categorie", "Prix", "Date", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-[11px] uppercase"
                    style={{
                      fontFamily: "'Geist Mono', monospace",
                      color: "#b8a18b",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productsData?.items.map((product) => (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-[rgba(184,161,139,0.05)]"
                  style={{ borderBottom: "1px solid #5a4a3a" }}
                >
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 overflow-hidden" style={{ backgroundColor: "#2a1f14" }}>
                      {product.images && product.images[0] ? (
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px]" style={{ color: "#5a4a3a" }}>No img</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "14px", color: "#f5f1eb" }}>
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "14px", color: "#b8a18b" }}>
                      {product.categoryName}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "14px", color: "#f5f1eb" }}>
                      {product.price.toLocaleString()} FCFA
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "12px", color: "#b8a18b" }}>
                      {product.createdAt ? new Date(product.createdAt).toLocaleDateString("fr-FR") : "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingId(product.id);
                          setShowForm(true);
                        }}
                        className="p-1 transition-opacity hover:opacity-70"
                      >
                        <Pencil size={16} color="#b8a18b" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Supprimer ce produit ?")) {
                            deleteMutation.mutate({ id: product.id });
                          }
                        }}
                        className="p-1 transition-opacity hover:opacity-70"
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ProductFormModal
          editingId={editingId}
          categories={categories ?? []}
          onClose={() => {
            setShowForm(false);
            setEditingId(null);
          }}
        />
      )}
    </div>
  );
}

// ========== PRODUCT FORM MODAL ==========
function ProductFormModal({
  editingId,
  categories,
  onClose,
}: {
  editingId: number | null;
  categories: Array<{ id: number; name: string }>;
  onClose: () => void;
}) {
  const { addToast } = useToast();
  const utils = trpc.useUtils();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: categories[0]?.id ? String(categories[0].id) : "",
    images: "",
    sku: "",
  });

  const createMutation = trpc.product.create.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      addToast("Produit cree", "success");
      onClose();
    },
  });

  const updateMutation = trpc.product.update.useMutation({
    onSuccess: () => {
      utils.product.list.invalidate();
      addToast("Produit mis a jour", "success");
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      categoryId: Number(form.categoryId),
      images: form.images ? [form.images] : [],
      sku: form.sku || undefined,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(61, 46, 34, 0.7)" }} onClick={onClose} />
      <div
        className="relative w-full max-w-[640px] max-h-[90vh] overflow-y-auto p-6 md:p-8"
        style={{
          backgroundColor: "#3d2e22",
          border: "1px solid #5a4a3a",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "20px",
              color: "#f5f1eb",
            }}
          >
            {editingId ? "Modifier produit" : "Nouveau produit"}
          </h3>
          <button onClick={onClose} className="p-1">
            <X size={20} color="#b8a18b" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormField label="Nom" required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-3 text-sm outline-none focus:border-[#b8a18b]"
              style={adminInputStyle}
            />
          </FormField>

          <FormField label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 text-sm outline-none focus:border-[#b8a18b] resize-y"
              style={adminInputStyle}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Prix (FCFA)" required>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                min={1}
                className="w-full px-4 py-3 text-sm outline-none focus:border-[#b8a18b]"
                style={adminInputStyle}
              />
            </FormField>

            <FormField label="Categorie" required>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                required
                className="w-full px-4 py-3 text-sm outline-none focus:border-[#b8a18b] appearance-none"
                style={adminInputStyle}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Image URL">
            <input
              type="text"
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 text-sm outline-none focus:border-[#b8a18b]"
              style={adminInputStyle}
            />
          </FormField>

          <FormField label="Reference (SKU)">
            <input
              type="text"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="w-full px-4 py-3 text-sm outline-none focus:border-[#b8a18b]"
              style={adminInputStyle}
            />
          </FormField>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1 py-3.5 text-sm font-medium uppercase tracking-wider transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                backgroundColor: "#b8a18b",
                color: "#3d2e22",
              }}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  En cours...
                </span>
              ) : (
                "Enregistrer"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 text-sm uppercase tracking-wider transition-opacity hover:opacity-80"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                backgroundColor: "transparent",
                color: "#b8a18b",
                border: "1px solid #5a4a3a",
              }}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ========== CATEGORIES TAB ==========
function CategoriesTab() {
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");

  const utils = trpc.useUtils();
  const { data: categories } = trpc.category.list.useQuery();

  const createMutation = trpc.category.create.useMutation({
    onSuccess: () => {
      utils.category.list.invalidate();
      setNewName("");
      setShowForm(false);
      addToast("Categorie creee", "success");
    },
  });

  const deleteMutation = trpc.category.delete.useMutation({
    onSuccess: () => {
      utils.category.list.invalidate();
      addToast("Categorie supprimee", "success");
    },
    onError: () => {
      addToast("Impossible de supprimer : la categorie contient des produits", "error");
    },
  });

  return (
    <div>
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 px-5 py-2.5 text-[13px] uppercase tracking-wider mb-6 transition-colors hover:opacity-90"
        style={{
          fontFamily: "'Geist Mono', monospace",
          backgroundColor: "#b8a18b",
          color: "#3d2e22",
        }}
      >
        <Plus size={16} />
        Nouvelle categorie
      </button>

      {showForm && (
        <div className="mb-6 p-4" style={{ backgroundColor: "#2a1f14", border: "1px solid #5a4a3a" }}>
          <div className="flex gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nom de la categorie"
              className="flex-1 px-4 py-2.5 text-sm outline-none focus:border-[#b8a18b]"
              style={adminInputStyle}
            />
            <button
              onClick={() => {
                if (newName.trim()) createMutation.mutate({ name: newName.trim() });
              }}
              disabled={createMutation.isPending || !newName.trim()}
              className="px-5 py-2.5 text-sm uppercase disabled:opacity-50"
              style={{ backgroundColor: "#b8a18b", color: "#3d2e22" }}
            >
              {createMutation.isPending ? "..." : "Creer"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setNewName("");
              }}
              className="px-4 py-2.5 text-sm uppercase"
              style={{ color: "#b8a18b", border: "1px solid #5a4a3a" }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "2px solid #5a4a3a" }}>
              {["Nom", "Produits", "Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-[11px] uppercase"
                  style={{ fontFamily: "'Geist Mono', monospace", color: "#b8a18b" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories?.map((cat) => (
              <tr
                key={cat.id}
                className="hover:bg-[rgba(184,161,139,0.05)]"
                style={{ borderBottom: "1px solid #5a4a3a" }}
              >
                <td className="px-4 py-3" style={{ fontFamily: "'Geist Mono', monospace", fontSize: "14px", color: "#f5f1eb" }}>
                  {cat.name}
                </td>
                <td className="px-4 py-3" style={{ fontFamily: "'Geist Mono', monospace", fontSize: "14px", color: "#b8a18b" }}>
                  {cat.productCount}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => {
                      if (confirm("Supprimer cette categorie ?")) {
                        deleteMutation.mutate({ id: cat.id });
                      }
                    }}
                    disabled={cat.productCount > 0}
                    className="p-1 disabled:opacity-30 transition-opacity hover:opacity-70"
                    title={cat.productCount > 0 ? "Cette categorie contient des produits" : ""}
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ========== BLOG TAB ==========
function BlogTab() {
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const utils = trpc.useUtils();
  const { data: blogData } = trpc.blog.list.useQuery({ limit: 50 });

  const deleteMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      utils.blog.list.invalidate();
      addToast("Article supprime", "success");
    },
  });

  return (
    <div>
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 px-5 py-2.5 text-[13px] uppercase tracking-wider mb-6 transition-colors hover:opacity-90"
        style={{
          fontFamily: "'Geist Mono', monospace",
          backgroundColor: "#b8a18b",
          color: "#3d2e22",
        }}
      >
        <Plus size={16} />
        Nouvel article
      </button>

      {showForm && <BlogFormModal onClose={() => setShowForm(false)} />}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "2px solid #5a4a3a" }}>
              {["Titre", "Categorie", "Date", "Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-[11px] uppercase"
                  style={{ fontFamily: "'Geist Mono', monospace", color: "#b8a18b" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {blogData?.items.map((post) => (
              <tr
                key={post.id}
                className="hover:bg-[rgba(184,161,139,0.05)]"
                style={{ borderBottom: "1px solid #5a4a3a" }}
              >
                <td className="px-4 py-3" style={{ fontFamily: "'Geist Mono', monospace", fontSize: "14px", color: "#f5f1eb" }}>
                  {post.title}
                </td>
                <td className="px-4 py-3" style={{ fontFamily: "'Geist Mono', monospace", fontSize: "14px", color: "#b8a18b" }}>
                  {post.category}
                </td>
                <td className="px-4 py-3" style={{ fontFamily: "'Geist Mono', monospace", fontSize: "12px", color: "#b8a18b" }}>
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString("fr-FR") : "-"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => {
                      if (confirm("Supprimer cet article ?")) {
                        deleteMutation.mutate({ id: post.id });
                      }
                    }}
                    className="p-1 transition-opacity hover:opacity-70"
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BlogFormModal({ onClose }: { onClose: () => void }) {
  const { addToast } = useToast();
  const utils = trpc.useUtils();
  const [form, setForm] = useState({
    title: "",
    content: "",
    coverImage: "",
    category: "",
  });

  const createMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      utils.blog.list.invalidate();
      addToast("Article cree", "success");
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title: form.title,
      content: form.content,
      coverImage: form.coverImage || undefined,
      category: form.category || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(61, 46, 34, 0.7)" }} onClick={onClose} />
      <div
        className="relative w-full max-w-[640px] max-h-[90vh] overflow-y-auto p-6 md:p-8"
        style={{ backgroundColor: "#3d2e22", border: "1px solid #5a4a3a" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#f5f1eb" }}>
            Nouvel article
          </h3>
          <button onClick={onClose} className="p-1">
            <X size={20} color="#b8a18b" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormField label="Titre" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full px-4 py-3 text-sm outline-none focus:border-[#b8a18b]"
              style={adminInputStyle}
            />
          </FormField>

          <FormField label="Contenu" required>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
              rows={8}
              className="w-full px-4 py-3 text-sm outline-none focus:border-[#b8a18b] resize-y"
              style={adminInputStyle}
            />
          </FormField>

          <FormField label="Image de couverture URL">
            <input
              type="text"
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 text-sm outline-none focus:border-[#b8a18b]"
              style={adminInputStyle}
            />
          </FormField>

          <FormField label="Categorie">
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="Style, Technologie, Bijoux..."
              className="w-full px-4 py-3 text-sm outline-none focus:border-[#b8a18b]"
              style={adminInputStyle}
            />
          </FormField>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 py-3.5 text-sm font-medium uppercase tracking-wider disabled:opacity-60"
              style={{ backgroundColor: "#b8a18b", color: "#3d2e22" }}
            >
              {createMutation.isPending ? "En cours..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 text-sm uppercase tracking-wider"
              style={{ color: "#b8a18b", border: "1px solid #5a4a3a" }}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ========== HELPERS ==========
function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="block text-[11px] uppercase tracking-[0.04em] mb-2"
        style={{ fontFamily: "'Geist Mono', monospace", color: "#b8a18b" }}
      >
        {label}
        {required && <span className="ml-1 text-[#ef4444]">*</span>}
      </label>
      {children}
    </div>
  );
}

const adminInputStyle: React.CSSProperties = {
  fontFamily: "'Geist Mono', monospace",
  backgroundColor: "#3d2e22",
  color: "#f5f1eb",
  border: "1px solid #5a4a3a",
};
