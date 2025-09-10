'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  BarChart3, 
  Package, 
  Settings, 
  Home,
  TrendingUp,
  AlertTriangle
} from "lucide-react"

interface SidebarProps {
  className?: string
  currentPage?: string
  onNavigate?: (page: string) => void
}

export function Sidebar({ className, currentPage = 'dashboard', onNavigate }: SidebarProps) {
  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: Home,
      href: "/"
    },
    {
      id: "inventory",
      title: "Inventario",
      icon: Package,
      href: "/inventory"
    },
    {
      id: "reports",
      title: "Reportes",
      icon: BarChart3,
      href: "/reports"
    },
    {
      id: "trends",
      title: "Tendencias",
      icon: TrendingUp,
      href: "/trends"
    },
    {
      id: "alerts",
      title: "Alertas",
      icon: AlertTriangle,
      href: "/alerts"
    },
    {
      id: "settings",
      title: "Configuración",
      icon: Settings,
      href: "/settings"
    }
  ]

  const handleClick = (item: typeof menuItems[0]) => {
    if (onNavigate) {
      onNavigate(item.id)
    }
  }

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Inventario
          </h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleClick(item)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
