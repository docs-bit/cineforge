"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AudioLines, Clapperboard, ChevronLeft, ChevronRight, Film, Grid2X2, LayoutDashboard, Sparkles, UserRound } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/studio/cinema", label: "Cinema Studio", icon: Film },
  { href: "/canvas", label: "Canvas", icon: Clapperboard },
  { href: "/soul-id", label: "Soul ID", icon: UserRound },
  { href: "/studio/marketing", label: "Marketing Studio", icon: Sparkles },
  { href: "/jobs", label: "Generation queue", icon: AudioLines },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn("relative flex flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-in-out", collapsed ? "w-16" : "w-60")} role="navigation" aria-label="Main navigation">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-3">
        <Link href="/dashboard" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gold font-heading text-sm font-bold text-black">CF</Link>
        {!collapsed && <Link href="/dashboard" className="truncate font-heading text-base font-semibold text-foreground">CineForge</Link>}
      </div>
      <nav className="flex-1 space-y-1 p-2">
        <p className={cn("px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60", collapsed && "sr-only")}>Create</p>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors", "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold", isActive ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground/70")} aria-current={isActive ? "page" : undefined} title={collapsed ? item.label : undefined}><Icon className="h-5 w-5 shrink-0" aria-hidden="true" />{!collapsed && <span className="truncate">{item.label}</span>}</Link>;
        })}
        <p className={cn("px-3 pb-2 pt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60", collapsed && "sr-only")}>Library</p>
        <Link href="/dashboard?view=projects" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><Grid2X2 className="h-5 w-5 shrink-0" /><span className={collapsed ? "sr-only" : "truncate"}>Projects</span></Link>
      </nav>
      <button onClick={() => setCollapsed(!collapsed)} className="flex h-10 items-center justify-center border-t border-sidebar-border text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}</button>
    </aside>
  );
}
