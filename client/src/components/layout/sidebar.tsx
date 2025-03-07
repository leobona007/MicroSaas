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
import { useState, useEffect, ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
<<<<<<< HEAD
import { useMobile } from "@/hooks/use-mobile";
=======
>>>>>>> 857c171 (first commit)
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import React from 'react';

interface SidebarProps {
  className?: string;
  children?: ReactNode;
}

export function Sidebar({ className, children }: SidebarProps) {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
<<<<<<< HEAD
  const isMobile = useMobile();
  const [open, setOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Update sidebar state when screen size changes
    setOpen(!isMobile);
  }, [isMobile]);
=======
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
>>>>>>> 857c171 (first commit)

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

<<<<<<< HEAD
  // For mobile: use Sheet component from shadcn UI for a slide-in sidebar
  if (isMobile) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="fixed top-4 left-4 z-50 h-8 w-8"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-center h-14 border-b border-sidebar-border">
                <Link href="/admin">
                  <div className="flex items-center space-x-2">
                    <Scissors className="h-5 w-5 text-purple-600" />
                    <span className="text-base font-semibold">Salão Admin</span>
                  </div>
                </Link>
              </div>

              <ScrollArea className="flex-1 py-2">
                <nav className="px-2 space-y-1">
                  {sidebarItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <a
                        className={cn(
                          "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          location === item.href
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.icon}
                        {item.label}
                      </a>
                    </Link>
                  ))}
                </nav>
              </ScrollArea>

              <div className="p-3 border-t border-sidebar-border flex justify-between items-center">
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
          </SheetContent>
        </Sheet>

        {/* Main content with padding for the button */}
        <div className="flex-1 pt-14 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-sidebar border-r border-sidebar-border transition-all duration-300",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16",
          className
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-center border-b border-sidebar-border overflow-hidden">
            <Link href="/admin">
              <div className="flex items-center space-x-2">
                <Scissors className="h-6 w-6 text-purple-600" />
                {open && <span className="text-xl font-semibold text-sidebar-foreground">Salão Admin</span>}
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
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                      !open && "justify-center px-0"
                    )}
                    title={!open ? item.label : undefined}
                  >
                    {item.icon.props.className ? 
                      React.cloneElement(item.icon, { className: open ? item.icon.props.className : "mr-0 h-5 w-5" }) 
                      : item.icon}
                    {open && item.label}
                  </a>
                </Link>
              ))}
            </nav>
          </ScrollArea>

          <div className={cn(
            "p-4 border-t border-sidebar-border", 
            open ? "flex justify-between items-center" : "flex flex-col items-center gap-4"
          )}>
            <ThemeToggle />
            {open && (
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
            )}
          </div>
        </div>
      </aside>

      {/* Toggle button for the sidebar - fixed position */}
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 lg:hidden"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Main content area that adjusts based on sidebar state */}
      <main 
        className={cn(
          "flex-1 overflow-auto transition-all duration-300", 
          open ? "lg:ml-64" : "lg:ml-16",
          "ml-0 p-4 sm:p-6 lg:p-8 pt-14 lg:pt-8" // Adjust top padding for mobile toggle button
        )}
      >
        {children}
      </main>
    </div>
  );
=======
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between h-14 px-4 border-b border-border">
        <Link href="/admin" className="font-semibold text-lg">
          Salão
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setMobileOpen(false)}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                location === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t border-border p-4 space-y-4">
        <ThemeToggle />
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-50 h-8 w-8 md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent side="left" className="w-[240px] p-0">
              {renderSidebarContent()}
            </SheetContent>
          </Sheet>
        </>
      ) : (
        <div className="hidden md:flex h-screen w-[240px] flex-col fixed left-0 top-0 border-r border-border bg-background">
          {renderSidebarContent()}
        </div>
      )}
      <main className={cn(
        "flex-1 min-h-screen",
        isMobile ? "pt-16 px-4" : "md:pl-[240px] p-8"
      )}>
        {children}
      </main>
    </>
  );
>>>>>>> 857c171 (first commit)
}