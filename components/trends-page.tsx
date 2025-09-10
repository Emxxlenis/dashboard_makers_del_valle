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
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  Calendar,
  Target,
  Zap,
  BarChart3
} from "lucide-react"
import { fetchSheetData, type InventoryItem } from "@/lib/google-sheets"

export function TrendsPage() {
  const [data, setData] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [trendType, setTrendType] = useState('consultas')

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

  
  const generateTrendData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const trendData = []
    
    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      // Simular tendencias basadas en los datos reales
      const baseConsultas = data.reduce((sum, item) => sum + item.consultas, 0) / data.length
      const baseStock = data.reduce((sum, item) => sum + item.stock, 0) / data.length
      
      trendData.push({
        fecha: date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        consultas: Math.floor(baseConsultas * (0.8 + Math.random() * 0.4)),
        stock: Math.floor(baseStock * (0.9 + Math.random() * 0.2)),
        ventas: Math.floor(Math.random() * 20 + 5),
        ingresos: Math.floor(Math.random() * 1000 + 200)
      })
    }
    
    return trendData
  }

  const trendData = generateTrendData()

  
  const categoryTrends = data.reduce((acc, item) => {
    if (!acc[item.categoria]) {
      acc[item.categoria] = {
        categoria: item.categoria,
        totalConsultas: 0,
        totalStock: 0,
        promedioConsultas: 0,
        productos: 0
      }
    }
    acc[item.categoria].totalConsultas += item.consultas
    acc[item.categoria].totalStock += item.stock
    acc[item.categoria].productos += 1
    return acc
  }, {} as Record<string, any>)

  const categoryTrendsArray = Object.values(categoryTrends).map(cat => ({
    ...cat,
    promedioConsultas: cat.totalConsultas / cat.productos
  })).sort((a, b) => b.totalConsultas - a.totalConsultas)

  
  const topGrowingProducts = data
    .sort((a, b) => b.consultas - a.consultas)
    .slice(0, 10)
    .map(item => ({
      producto: item.producto.length > 20 ? item.producto.substring(0, 20) + '...' : item.producto,
      consultas: item.consultas,
      stock: item.stock,
      ratio: item.stock > 0 ? item.consultas / item.stock : 0,
      categoria: item.categoria
    }))

  
  const correlationData = data.map(item => ({
    consultas: item.consultas,
    stock: item.stock,
    precio: item.precio,
    valor: item.stock * item.precio
  }))

  const getTrendIcon = (value: number, threshold: number) => {
    if (value > threshold) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (value < threshold) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Activity className="h-4 w-4 text-blue-500" />
  }

  const getTrendColor = (value: number, threshold: number) => {
    if (value > threshold) return "text-green-500"
    if (value < threshold) return "text-red-500"
    return "text-blue-500"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Analizando tendencias...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tendencias</h1>
          <p className="text-muted-foreground">
            Análisis de patrones y tendencias en tu inventario
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 días</SelectItem>
              <SelectItem value="30d">30 días</SelectItem>
              <SelectItem value="90d">90 días</SelectItem>
            </SelectContent>
          </Select>
          <Select value={trendType} onValueChange={setTrendType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consultas">Consultas</SelectItem>
              <SelectItem value="stock">Stock</SelectItem>
              <SelectItem value="ventas">Ventas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Métricas de tendencias */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendencia Consultas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getTrendIcon(trendData[trendData.length - 1]?.consultas || 0, 20)}
              <span className="text-2xl font-bold">
                {trendData[trendData.length - 1]?.consultas || 0}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Último día
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crecimiento Stock</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getTrendIcon(trendData[trendData.length - 1]?.stock || 0, 50)}
              <span className="text-2xl font-bold">
                {trendData[trendData.length - 1]?.stock || 0}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Promedio diario
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.filter(item => item.consultas > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Con consultas recientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.length > 0 ? (data.reduce((sum, item) => sum + item.consultas, 0) / data.length).toFixed(1) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Consultas por producto
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica principal de tendencias */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución Temporal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="consultas" 
                stackId="1" 
                stroke="#8884d8" 
                fill="#8884d8" 
                name="Consultas"
              />
              <Area 
                type="monotone" 
                dataKey="stock" 
                stackId="2" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                name="Stock"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tendencias por categoría */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryTrendsArray}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="categoria" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalConsultas" fill="#8884d8" name="Consultas" />
                <Bar dataKey="totalStock" fill="#82ca9d" name="Stock" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos con Mayor Crecimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topGrowingProducts} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="producto" type="category" width={120} fontSize={10} />
                <Tooltip />
                <Bar dataKey="consultas" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Análisis de correlación */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Correlación</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={correlationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="consultas" name="Consultas" />
              <YAxis dataKey="stock" name="Stock" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter dataKey="valor" fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resumen de tendencias */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>Categorías en Crecimiento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categoryTrendsArray.slice(0, 3).map((category, index) => (
                <div key={category.categoria} className="flex items-center justify-between">
                  <Badge variant="outline">{category.categoria}</Badge>
                  <span className="text-sm font-medium">{category.totalConsultas} consultas</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <span>Productos Más Activos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topGrowingProducts.slice(0, 3).map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm truncate">{product.producto}</span>
                  <span className="text-sm font-medium">{product.consultas}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-500" />
              <span>Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{(data.filter(item => item.consultas > 0).length / data.length * 100).toFixed(1)}% productos activos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Promedio {data.length > 0 ? (data.reduce((sum, item) => sum + item.consultas, 0) / data.length).toFixed(1) : 0} consultas/producto</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>{categoryTrendsArray.length} categorías activas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
