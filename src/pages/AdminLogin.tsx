import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useToast } from "@/stores/useToast";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("admin_token", data.token);
      addToast("Connexion reussie", "success");
      navigate("/super-admin/dashboard");
    },
    onError: (err) => {
      setError(err.message || "Identifiants invalides");
      addToast("Erreur de connexion", "error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#3d2e22" }}
    >
      {/* Decorative */}
      <div className="w-10 h-px mb-8" style={{ backgroundColor: "#b8a18b" }} />

      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          fontWeight: 400,
          color: "#f5f1eb",
          textAlign: "center",
        }}
      >
        Espace Administrateur
      </h1>

      <p
        className="mt-3 text-center"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          color: "#b8a18b",
        }}
      >
        Connectez-vous pour gerer votre boutique
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[400px] mt-12 flex flex-col gap-6"
      >
        {/* Email */}
        <div>
          <label
            className="block text-[11px] uppercase tracking-[0.04em] mb-2"
            style={{
              fontFamily: "'Geist Mono', monospace",
              color: "#b8a18b",
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@judickshop.com"
            className="w-full px-4 py-3 text-sm outline-none transition-colors duration-200 focus:border-[#b8a18b]"
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "14px",
              backgroundColor: "#3d2e22",
              color: "#f5f1eb",
              border: "1px solid #5a4a3a",
            }}
          />
        </div>

        {/* Password */}
        <div>
          <label
            className="block text-[11px] uppercase tracking-[0.04em] mb-2"
            style={{
              fontFamily: "'Geist Mono', monospace",
              color: "#b8a18b",
            }}
          >
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              className="w-full px-4 py-3 pr-10 text-sm outline-none transition-colors duration-200 focus:border-[#b8a18b]"
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "14px",
                backgroundColor: "#3d2e22",
                color: "#f5f1eb",
                border: "1px solid #5a4a3a",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff size={16} color="#b8a18b" />
              ) : (
                <Eye size={16} color="#b8a18b" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <p
            className="text-center"
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "13px",
              color: "#ef4444",
            }}
          >
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full py-4 text-sm font-medium tracking-[0.02em] transition-all duration-200 hover:opacity-90 disabled:opacity-60"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            backgroundColor: "#b8a18b",
            color: "#3d2e22",
          }}
        >
          {loginMutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={20} className="animate-spin" />
              Connexion...
            </span>
          ) : (
            "Se connecter"
          )}
        </button>
      </form>

      <p
        className="mt-8 text-center"
        style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: "11px",
          color: "#b8a18b",
        }}
      >
        Route protegee — Acces reserve
      </p>
    </div>
  );
}
