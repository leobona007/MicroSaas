import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function ProtectedRoute({ component: Component, path, ...rest }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else {
        // Verificar se o usuário está acessando a página correta baseado em seu papel
        const isAdminRoute = path?.startsWith("/admin");
        const isClientRoute = path === "/booking";

        if (user.role === "client" && isAdminRoute) {
          navigate("/booking");
        } else if (user.role === "admin" && isClientRoute) {
          navigate("/admin");
        }
      }
    }
  }, [user, isLoading, navigate, path]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return <Component {...rest} />;
}