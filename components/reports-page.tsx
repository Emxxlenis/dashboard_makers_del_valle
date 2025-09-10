'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts"
import { 
  Download, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Package,
  Eye,
  Calendar,
  Filter
} from "lucide-react"
import { fetchSheetData, calculateInventoryMetrics, type InventoryItem } from "@/lib/google-sheets"

export function ReportsPage() {
  const [data, setData] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [reportType, setReportType] = useState('overview')
  const [timeRange, setTimeRange] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const items = await fetchSheetData()
      setData(items)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const metrics = calculateInventoryMetrics(data)

  
  const stockByCategory = metrics.stockByCategory
  const topCategories = metrics.topCategories
  
  
  const consultasByCategory = data.reduce((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + item.consultas
    return acc
  }, {} as Record<string, number>)

  const consultasByCategoryArray = Object.entries(consultasByCategory)
    .map(([category, consultas]) => ({ category, consultas }))
    .sort((a, b) => b.consultas - a.consultas)

  
  const topProducts = data
    .sort((a, b) => b.consultas - a.consultas)
    .slice(0, 10)
    .map(item => ({
      producto: item.producto.length > 20 ? item.producto.substring(0, 20) + '...' : item.producto,
      consultas: item.consultas,
      stock: item.stock,
      precio: item.precio
    }))

  
  const profitabilityData = data.map(item => ({
    producto: item.producto.length > 15 ? item.producto.substring(0, 15) + '...' : item.producto,
    valor: item.stock * item.precio,
    consultas: item.consultas,
    ratio: item.consultas > 0 ? (item.stock * item.precio) / item.consultas : 0
  })).sort((a, b) => b.valor - a.valor).slice(0, 10)

  const exportReport = () => {
    const reportData = {
      fecha: new Date().toLocaleDateString(),
      resumen: {
        totalProductos: metrics.totalProducts,
        totalStock: metrics.totalStock,
        valorTotal: metrics.totalValue,
        totalConsultas: metrics.totalConsultas,
        productosSinStock: metrics.outOfStock,
        productosStockBajo: metrics.lowStock
      },
      topCategorias: topCategories,
      topProductos: topProducts,
      rentabilidad: profitabilityData
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `reporte-inventario-${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Generando reportes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reportes</h1>
          <p className="text-muted-foreground">
            Análisis detallado del rendimiento de tu inventario
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tipo de reporte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Resumen General</SelectItem>
              <SelectItem value="performance">Rendimiento</SelectItem>
              <SelectItem value="profitability">Rentabilidad</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Inventario total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consultas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalConsultas.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Interacciones totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Sin Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{metrics.outOfStock}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.outOfStockPercentage.toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{metrics.lowStock}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.lowStockPercentage.toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficas principales */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Stock por Categoría */}
        <Card>
          <CardHeader>
            <CardTitle>Stock por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Consultas por Categoría */}
        <Card>
          <CardHeader>
            <CardTitle>Consultas por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={consultasByCategoryArray}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="consultas" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Productos más consultados */}
      <Card>
        <CardHeader>
          <CardTitle>Productos Más Consultados</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topProducts} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="producto" type="category" width={150} fontSize={12} />
              <Tooltip />
              <Bar dataKey="consultas" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Análisis de rentabilidad */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Rentabilidad</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={profitabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="producto" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="valor" 
                stackId="1" 
                stroke="#8884d8" 
                fill="#8884d8" 
                name="Valor"
              />
              <Area 
                type="monotone" 
                dataKey="consultas" 
                stackId="2" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                name="Consultas"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resumen de categorías */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Categorías por Cantidad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topCategories.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{category.category}</Badge>
                  </div>
                  <div className="text-sm font-medium">{category.count} productos</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorías por Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {consultasByCategoryArray.slice(0, 5).map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{category.category}</Badge>
                  </div>
                  <div className="text-sm font-medium">{category.consultas} consultas</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
