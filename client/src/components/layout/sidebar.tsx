import { Link, useLocation } from "wouter";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  BarChart, 
  Scissors, 
  UserSquare,
  Home,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  const sidebarItems = [
    {
      icon: <Home className="mr-2 h-5 w-5" />,
      label: "Dashboard",
      href: "/admin",
    },
    {
      icon: <Calendar className="mr-2 h-5 w-5" />,
      label: "Agenda",
      href: "/admin/schedule",
    },
    {
      icon: <Users className="mr-2 h-5 w-5" />,
      label: "Clientes",
      href: "/admin/clients",
    },
    {
      icon: <DollarSign className="mr-2 h-5 w-5" />,
      label: "Financeiro",
      href: "/admin/finance",
    },
    {
      icon: <BarChart className="mr-2 h-5 w-5" />,
      label: "Relatórios",
      href: "/admin/reports",
    },
    {
      icon: <Scissors className="mr-2 h-5 w-5" />,
      label: "Meus Serviços",
      href: "/admin/services",
    },
    {
      icon: <UserSquare className="mr-2 h-5 w-5" />,
      label: "Profissionais",
      href: "/admin/professionals",
    },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      {isMobile && (
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
        >
          {isOpen ? <X /> : <Menu />}
        </Button>
      )}
      
      <aside 
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all",
          isOpen ? "w-64" : "w-0",
          isMobile ? "shadow-lg" : "",
          className
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-sidebar-border">
            <Link href="/admin">
              <div className="flex items-center space-x-2">
                <Scissors className="h-6 w-6 text-purple-600" />
                <span className="text-xl font-semibold text-sidebar-foreground">Salão Admin</span>
              </div>
            </Link>
          </div>
          
          <ScrollArea className="flex-1 py-4">
            <nav className="px-3 space-y-1">
              {sidebarItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      location === item.href
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </a>
                </Link>
              ))}
            </nav>
          </ScrollArea>
          
          <div className="p-4 border-t border-sidebar-border flex justify-between items-center">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout} 
              disabled={logoutMutation.isPending}
              className="flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {logoutMutation.isPending ? "Saindo..." : "Sair"}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
