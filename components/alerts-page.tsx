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
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  XCircle,
  Package,
  TrendingDown,
  TrendingUp,
  Eye,
  DollarSign,
  Clock,
  Filter,
  Settings
} from "lucide-react"
import { fetchSheetData, type InventoryItem } from "@/lib/google-sheets"

interface Alert {
  id: string
  type: 'stock' | 'consultas' | 'precio' | 'categoria'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  productId: string
  productName: string
  value: number
  threshold: number
  timestamp: Date
  resolved: boolean
}

export function AlertsPage() {
  const [data, setData] = useState<InventoryItem[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (data.length > 0) {
      generateAlerts()
    }
  }, [data])

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

  const generateAlerts = () => {
    const newAlerts: Alert[] = []

    data.forEach(item => {
      
      if (item.stock === 0) {
        newAlerts.push({
          id: `stock-${item.id}`,
          type: 'stock',
          severity: 'critical',
          title: 'Producto sin stock',
          description: `${item.producto} no tiene stock disponible`,
          productId: item.id,
          productName: item.producto,
          value: item.stock,
          threshold: 0,
          timestamp: new Date(),
          resolved: false
        })
      } else if (item.stock <= 10) {
        newAlerts.push({
          id: `stock-low-${item.id}`,
          type: 'stock',
          severity: 'high',
          title: 'Stock bajo',
          description: `${item.producto} tiene solo ${item.stock} unidades`,
          productId: item.id,
          productName: item.producto,
          value: item.stock,
          threshold: 10,
          timestamp: new Date(),
          resolved: false
        })
      }

      
      if (item.consultas > 50) {
        newAlerts.push({
          id: `consultas-${item.id}`,
          type: 'consultas',
          severity: 'medium',
          title: 'Alto interés',
          description: `${item.producto} tiene ${item.consultas} consultas`,
          productId: item.id,
          productName: item.producto,
          value: item.consultas,
          threshold: 50,
          timestamp: new Date(),
          resolved: false
        })
      }

      
      if (item.precio > 1000) {
        newAlerts.push({
          id: `precio-${item.id}`,
          type: 'precio',
          severity: 'low',
          title: 'Precio elevado',
          description: `${item.producto} tiene un precio de $${item.precio}`,
          productId: item.id,
          productName: item.producto,
          value: item.precio,
          threshold: 1000,
          timestamp: new Date(),
          resolved: false
        })
      }
    })

    
    const categories = data.reduce((acc, item) => {
      if (!acc[item.categoria]) {
        acc[item.categoria] = { total: 0, outOfStock: 0 }
      }
      acc[item.categoria].total++
      if (item.stock === 0) {
        acc[item.categoria].outOfStock++
      }
      return acc
    }, {} as Record<string, { total: number; outOfStock: number }>)

    Object.entries(categories).forEach(([category, stats]) => {
      const percentage = (stats.outOfStock / stats.total) * 100
      if (percentage > 30) {
        newAlerts.push({
          id: `categoria-${category}`,
          type: 'categoria',
          severity: 'high',
          title: 'Categoría con problemas',
          description: `${category} tiene ${percentage.toFixed(1)}% de productos sin stock`,
          productId: category,
          productName: category,
          value: percentage,
          threshold: 30,
          timestamp: new Date(),
          resolved: false
        })
      }
    })

    setAlerts(newAlerts)
  }

  const resolveAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-50 border-red-200'
      case 'high': return 'text-orange-500 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-blue-500 bg-blue-50 border-blue-200'
      default: return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-5 w-5" />
      case 'high': return <AlertTriangle className="h-5 w-5" />
      case 'medium': return <Bell className="h-5 w-5" />
      case 'low': return <CheckCircle className="h-5 w-5" />
      default: return <Bell className="h-5 w-5" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stock': return <Package className="h-4 w-4" />
      case 'consultas': return <Eye className="h-4 w-4" />
      case 'precio': return <DollarSign className="h-4 w-4" />
      case 'categoria': return <TrendingDown className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filterType !== 'all' && alert.type !== filterType) return false
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false
    return !alert.resolved
  })

  const resolvedAlerts = alerts.filter(alert => alert.resolved)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Bell className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Analizando alertas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alertas</h1>
          <p className="text-muted-foreground">
            Monitoreo inteligente de tu inventario
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="stock">Stock</SelectItem>
              <SelectItem value="consultas">Consultas</SelectItem>
              <SelectItem value="precio">Precio</SelectItem>
              <SelectItem value="categoria">Categoría</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Severidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="critical">Crítica</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resumen de alertas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {alerts.filter(a => a.severity === 'critical' && !a.resolved).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Sin stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {alerts.filter(a => a.type === 'stock' && a.severity === 'high' && !a.resolved).length}
            </div>
            <p className="text-xs text-muted-foreground">
              ≤ 10 unidades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resueltas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{resolvedAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Completadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de alertas activas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Alertas Activas ({filteredAlerts.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">¡Todo en orden!</h3>
                <p className="text-muted-foreground">No hay alertas activas en este momento.</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold">{alert.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {alert.severity}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            {getTypeIcon(alert.type)}
                            <span>{alert.type}</span>
                          </div>
                        </div>
                        <p className="text-sm mb-2">{alert.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Producto: {alert.productName}</span>
                          <span>Valor: {alert.value}</span>
                          <span>Umbral: {alert.threshold}</span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{alert.timestamp.toLocaleTimeString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveAlert(alert.id)}
                      className="ml-4"
                    >
                      Resolver
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alertas resueltas */}
      {resolvedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Alertas Resueltas ({resolvedAlerts.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resolvedAlerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg border bg-green-50 border-green-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <p className="text-xs text-muted-foreground">{alert.productName}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {alert.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuración de alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Configuración de Alertas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Umbrales de Stock</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>• Stock crítico: 0 unidades</div>
                <div>• Stock bajo: ≤ 10 unidades</div>
                <div>• Stock normal: > 10 unidades</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Umbrales de Consultas</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>• Alto interés: > 50 consultas</div>
                <div>• Interés medio: 20-50 consultas</div>
                <div>• Bajo interés: &lt; 20 consultas</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
