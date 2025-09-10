'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { MetricsCards } from "@/components/metrics-cards"
import { Charts } from "@/components/charts"
import { InventoryPage } from "@/components/inventory-page"
import { ReportsPage } from "@/components/reports-page"
import { TrendsPage } from "@/components/trends-page"
import { AlertsPage } from "@/components/alerts-page"
import { SettingsPage } from "@/components/settings-page"
import { fetchSheetData, calculateInventoryMetrics, type InventoryItem } from "@/lib/google-sheets"
import { RefreshCw, AlertCircle, CheckCircle } from "lucide-react"

export function Dashboard() {
  const [data, setData] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [currentPage, setCurrentPage] = useState('dashboard')

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const items = await fetchSheetData()
      setData(items)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const metrics = calculateInventoryMetrics(data)

  const renderPage = () => {
    switch (currentPage) {
      case 'inventory':
        return <InventoryPage />
      case 'reports':
        return <ReportsPage />
      case 'trends':
        return <TrendsPage />
      case 'alerts':
        return <AlertsPage />
      case 'settings':
        return <SettingsPage />
      default:
        return renderDashboard()
    }
  }

  const renderDashboard = () => (
    <>
      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Error al cargar datos</h3>
                <p className="text-sm">{error}</p>
                <p className="text-xs mt-1">
                  Verifica que las variables de entorno estén configuradas correctamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && !error && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Cargando datos del inventario...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && data.length === 0 && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <AlertCircle className="h-5 w-5" />
              <span>No se encontraron datos en el inventario.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && data.length > 0 && (
        <>
          {/* Status Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Estado del Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Badge variant="default" className="bg-green-500">
                  Conectado a Google Sheets
                </Badge>
                <Badge variant="secondary">
                  {data.length} productos cargados
                </Badge>
                <Badge variant="outline">
                  Última actualización: {lastUpdated?.toLocaleTimeString()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Cards */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Métricas Generales</h3>
            <MetricsCards metrics={metrics} />
          </div>

          {/* Charts */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Análisis Visual</h3>
            <Charts 
              stockByCategory={metrics.stockByCategory}
              topCategories={metrics.topCategories}
              items={data}
            />
          </div>

          {/* Recent Items */}
          <Card>
            <CardHeader>
              <CardTitle>Productos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.slice(0, 10).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.producto}</h4>
                      <p className="text-sm text-muted-foreground">{item.categoria}</p>
                      <p className="text-xs text-muted-foreground">Consultas: {item.consultas}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${item.precio.toFixed(2)}</div>
                      <Badge variant={item.stock === 0 ? "destructive" : item.stock <= 10 ? "secondary" : "default"}>
                        Stock: {item.stock}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-card border-r">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            </div>
            <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          
          <header className="bg-card border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {currentPage === 'dashboard' ? 'Panel de Inventario' :
                   currentPage === 'inventory' ? 'Inventario' :
                   currentPage === 'reports' ? 'Reportes' :
                   currentPage === 'trends' ? 'Tendencias' :
                   currentPage === 'alerts' ? 'Alertas' :
                   currentPage === 'settings' ? 'Configuración' : 'Dashboard'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {currentPage === 'dashboard' ? 'Monitoreo en tiempo real de tu inventario' :
                   currentPage === 'inventory' ? 'Gestiona y visualiza todos los productos' :
                   currentPage === 'reports' ? 'Análisis detallado del rendimiento' :
                   currentPage === 'trends' ? 'Análisis de patrones y tendencias' :
                   currentPage === 'alerts' ? 'Monitoreo inteligente de tu inventario' :
                   currentPage === 'settings' ? 'Personaliza tu dashboard' : 'Dashboard'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {currentPage === 'dashboard' && lastUpdated && (
                  <div className="text-sm text-muted-foreground">
                    Última actualización: {lastUpdated.toLocaleTimeString()}
                  </div>
                )}
                {currentPage === 'dashboard' && (
                  <button
                    onClick={loadData}
                    disabled={loading}
                    className="flex items-center space-x-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Actualizar</span>
                  </button>
                )}
              </div>
            </div>
          </header>

          
          <main className="flex-1 overflow-y-auto p-6">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  )
}
