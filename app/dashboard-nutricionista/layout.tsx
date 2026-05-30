"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Apple, 
  LayoutDashboard, 
  MessageSquare, 
  User, 
  LogOut,
  Menu,
  X,
  Users,
  CalendarDays,
  FileText,
  Bot
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { NutriliaAssistantWidget } from "@/components/NutriliaAssistantWidget";
import { NotificationManager } from "@/components/NotificationManager";

export default function NutricionistaDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const sidebarLinks = [
    { href: "/dashboard-nutricionista", icon: LayoutDashboard, label: "Visão Geral" },
    { href: "/dashboard-nutricionista/pacientes", icon: Users, label: "Meus Pacientes" },
    { href: "/dashboard-nutricionista/agenda", icon: CalendarDays, label: "Agenda" },
    { href: "/dashboard-nutricionista/modelos", icon: FileText, label: "Modelos de Dieta" },
    { href: "/dashboard-nutricionista/recepcionista", icon: Bot, label: "Recepcionista IA" },
    { href: "/dashboard-nutricionista/chat", icon: MessageSquare, label: "Mensagens" },
    { href: "/dashboard-nutricionista/perfil", icon: User, label: "Meu Perfil" },
  ];

  const firstName = user?.name ? user.name.split(' ')[0] : 'Nutricionista';
  const initials = user?.name ? user.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() : 'NU';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Sidebar principal"
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <Link href="/" className="flex items-center gap-2 text-emerald-600" aria-label="Nutrilia Home">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center" aria-hidden="true">
              <Apple className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-800">Nutrilia Pro</span>
          </Link>
          <button 
            className="md:hidden text-slate-500 p-2"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-colors",
                  isActive 
                    ? "bg-emerald-50 text-emerald-700 font-medium" 
                    : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                )}
              >
                <link.icon className={cn("h-5 w-5", isActive ? "" : "text-slate-400")} aria-hidden="true" />
                {link.label}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 mb-4 shrink-0">
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2 mt-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full min-w-0 md:w-auto">
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-white border-b border-slate-200 sticky top-0 z-30 shrink-0">
          <button 
            className="md:hidden p-2 -ml-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-4 hidden md:flex">
            <h1 className="text-xl font-bold text-slate-800">
              Olá, {firstName}!
            </h1>
          </div>
          <div className="flex-1 md:hidden" />
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block leading-none">
              <p className="text-sm font-bold leading-none mb-1">{user?.name || 'Dr(a). Nutricionista'}</p>
              <p className="text-[10px] text-emerald-600">Nutrilia PRO</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-500 shrink-0 overflow-hidden">
              {user?.profilePicture ? (
                <img src={user?.profilePicture} alt={`Foto de perfil de ${user.name}`} className="w-full h-full object-cover" />
              ) : (
                <span aria-label={user?.name || 'Avatar'}>{initials}</span>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
      <NotificationManager />
      <NutriliaAssistantWidget />
    </div>
  );
}
