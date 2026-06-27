import { Check, AlertCircle, Info, X } from "lucide-react";
import { useToast } from "@/stores/useToast";

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 px-5 py-4 min-w-[280px] animate-in slide-in-from-right-8 duration-300"
          style={{
            backgroundColor: "#3d2e22",
            border: "1px solid #5a4a3a",
          }}
        >
          {toast.type === "success" && <Check size={16} color="#22c55e" />}
          {toast.type === "error" && <AlertCircle size={16} color="#ef4444" />}
          {toast.type === "info" && <Info size={16} color="#b8a18b" />}
          <span
            className="flex-1 text-[13px]"
            style={{
              fontFamily: "'Geist Mono', monospace",
              color: "#f5f1eb",
            }}
          >
            {toast.message}
          </span>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-0.5 transition-opacity hover:opacity-70"
          >
            <X size={14} color="#b8a18b" />
          </button>
        </div>
      ))}
    </div>
  );
}
