'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  BarChart3,
  ShoppingCart,
  Eye,
  Activity
} from "lucide-react"

interface MetricsCardsProps {
  metrics: {
    totalProducts: number
    totalStock: number
    totalValue: number
    totalConsultas: number
    outOfStock: number
    lowStock: number
    outOfStockPercentage: number
    lowStockPercentage: number
    averagePrice: number
    averageConsultas: number
  }
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: "Total Productos",
      value: metrics.totalProducts.toLocaleString(),
      icon: Package,
      description: "Productos en inventario",
      color: "text-blue-500"
    },
    {
      title: "Stock Total",
      value: metrics.totalStock.toLocaleString(),
      icon: BarChart3,
      description: "Unidades disponibles",
      color: "text-green-500"
    },
    {
      title: "Valor Total",
      value: `$${metrics.totalValue.toLocaleString()}`,
      icon: DollarSign,
      description: "Valor del inventario",
      color: "text-yellow-500"
    },
    {
      title: "Total Consultas",
      value: metrics.totalConsultas.toLocaleString(),
      icon: Eye,
      description: "Consultas realizadas",
      color: "text-indigo-500"
    },
    {
      title: "Sin Stock",
      value: metrics.outOfStock.toString(),
      icon: AlertTriangle,
      description: `${metrics.outOfStockPercentage.toFixed(1)}% del total`,
      color: "text-red-500",
      badge: metrics.outOfStock > 0 ? "warning" : "default"
    },
    {
      title: "Stock Bajo",
      value: metrics.lowStock.toString(),
      icon: TrendingUp,
      description: `${metrics.lowStockPercentage.toFixed(1)}% del total`,
      color: "text-orange-500",
      badge: metrics.lowStock > 0 ? "secondary" : "default"
    },
    {
      title: "Precio Promedio",
      value: `$${metrics.averagePrice.toFixed(2)}`,
      icon: ShoppingCart,
      description: "Por unidad",
      color: "text-purple-500"
    },
    {
      title: "Consultas Promedio",
      value: metrics.averageConsultas.toFixed(1),
      icon: Activity,
      description: "Por producto",
      color: "text-cyan-500"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{card.description}</span>
              {card.badge && (
                <Badge variant={card.badge === "warning" ? "destructive" : "secondary"}>
                  {card.badge === "warning" ? "Alerta" : "Bajo"}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
