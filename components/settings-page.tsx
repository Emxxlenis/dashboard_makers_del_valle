'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Settings, 
  Database, 
  Bell, 
  Palette,
  Shield,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  TestTube
} from "lucide-react"

export function SettingsPage() {
  const [settings, setSettings] = useState({
    sheetId: '',
    apiKey: '',
    refreshInterval: '5',
    theme: 'dark',
    notifications: true,
    autoRefresh: true,
    stockThreshold: '10',
    consultasThreshold: '50',
    priceThreshold: '1000'
  })

  const [showApiKey, setShowApiKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    // Cargar configuración desde localStorage o variables de entorno
    const savedSettings = localStorage.getItem('dashboard-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    } else {
      // Cargar desde variables de entorno si están disponibles
      setSettings(prev => ({
        ...prev,
        sheetId: process.env.NEXT_PUBLIC_SHEET_ID || '',
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ''
      }))
    }
  }

  const saveSettings = () => {
    localStorage.setItem('dashboard-settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const testConnection = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${settings.sheetId}/values/interactions?key=${settings.apiKey}`
      )
      
      if (response.ok) {
        setTestResult('success')
      } else {
        setTestResult('error')
      }
    } catch (error) {
      setTestResult('error')
    } finally {
      setTesting(false)
    }
  }

  const resetSettings = () => {
    setSettings({
      sheetId: '',
      apiKey: '',
      refreshInterval: '5',
      theme: 'dark',
      notifications: true,
      autoRefresh: true,
      stockThreshold: '10',
      consultasThreshold: '50',
      priceThreshold: '1000'
    })
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">
            Personaliza tu dashboard y configura las conexiones
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {saved && (
            <div className="flex items-center space-x-1 text-green-500">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Guardado</span>
            </div>
          )}
          <Button onClick={saveSettings} className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Guardar</span>
          </Button>
        </div>
      </div>

      {/* Conexión a Google Sheets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Conexión a Google Sheets</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sheet ID</label>
              <Input
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                value={settings.sheetId}
                onChange={(e) => updateSetting('sheetId', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                ID de tu Google Sheet (se encuentra en la URL)
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">API Key</label>
              <div className="relative">
                <Input
                  type={showApiKey ? "text" : "password"}
                  placeholder="AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={settings.apiKey}
                  onChange={(e) => updateSetting('apiKey', e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Clave de API de Google Cloud Console
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              onClick={testConnection} 
              disabled={testing || !settings.sheetId || !settings.apiKey}
              className="flex items-center space-x-2"
            >
              {testing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4" />
              )}
              <span>{testing ? 'Probando...' : 'Probar Conexión'}</span>
            </Button>

            {testResult === 'success' && (
              <div className="flex items-center space-x-1 text-green-500">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Conexión exitosa</span>
              </div>
            )}

            {testResult === 'error' && (
              <div className="flex items-center space-x-1 text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Error de conexión</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuración de la aplicación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Configuración de la Aplicación</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Intervalo de actualización (minutos)</label>
              <Select value={settings.refreshInterval} onValueChange={(value) => updateSetting('refreshInterval', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minuto</SelectItem>
                  <SelectItem value="5">5 minutos</SelectItem>
                  <SelectItem value="10">10 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tema</label>
              <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Oscuro</SelectItem>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Actualización automática</h4>
                <p className="text-sm text-muted-foreground">
                  Actualizar datos automáticamente cada {settings.refreshInterval} minutos
                </p>
              </div>
              <Button
                variant={settings.autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => updateSetting('autoRefresh', !settings.autoRefresh)}
              >
                {settings.autoRefresh ? "Activado" : "Desactivado"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notificaciones</h4>
                <p className="text-sm text-muted-foreground">
                  Recibir alertas y notificaciones del sistema
                </p>
              </div>
              <Button
                variant={settings.notifications ? "default" : "outline"}
                size="sm"
                onClick={() => updateSetting('notifications', !settings.notifications)}
              >
                {settings.notifications ? "Activado" : "Desactivado"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Umbrales de alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Umbrales de Alertas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Stock bajo (unidades)</label>
              <Input
                type="number"
                value={settings.stockThreshold}
                onChange={(e) => updateSetting('stockThreshold', e.target.value)}
                placeholder="10"
              />
              <p className="text-xs text-muted-foreground">
                Alerta cuando el stock sea menor o igual
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Consultas altas</label>
              <Input
                type="number"
                value={settings.consultasThreshold}
                onChange={(e) => updateSetting('consultasThreshold', e.target.value)}
                placeholder="50"
              />
              <p className="text-xs text-muted-foreground">
                Alerta cuando las consultas superen este valor
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Precio alto ($)</label>
              <Input
                type="number"
                value={settings.priceThreshold}
                onChange={(e) => updateSetting('priceThreshold', e.target.value)}
                placeholder="1000"
              />
              <p className="text-xs text-muted-foreground">
                Alerta cuando el precio supere este valor
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información del sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Información del Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Versión</h4>
              <p className="text-sm text-muted-foreground">Dashboard v1.0.0</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Última actualización</h4>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Estado de conexión</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-500">Conectado</span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Datos cargados</h4>
              <p className="text-sm text-muted-foreground">
                {typeof window !== 'undefined' && localStorage.getItem('dashboard-data') 
                  ? 'Datos en caché disponibles' 
                  : 'Sin datos en caché'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button onClick={saveSettings} className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Guardar Configuración</span>
            </Button>
            <Button variant="outline" onClick={resetSettings}>
              Restablecer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
