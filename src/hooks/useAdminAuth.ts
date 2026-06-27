import { trpc } from "@/providers/trpc";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router";

export function useAdminAuth() {
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");

  const { data: admin, isLoading } = trpc.admin.me.useQuery(undefined, {
    enabled: !!token,
    retry: false,
  });

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    window.location.href = "/super-admin";
  }, []);

  useEffect(() => {
    if (!isLoading && !admin && token) {
      localStorage.removeItem("admin_token");
    }
  }, [isLoading, admin, token]);

  return {
    admin: admin ?? null,
    isAuthenticated: !!admin,
    isLoading,
    logout,
  };
}
