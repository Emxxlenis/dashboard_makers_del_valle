'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  AlertTriangle,
  TrendingUp,
  Package
} from "lucide-react"
import { fetchSheetData, type InventoryItem } from "@/lib/google-sheets"

export function InventoryPage() {
  const [data, setData] = useState<InventoryItem[]>([])
  const [filteredData, setFilteredData] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterData()
  }, [data, searchTerm, categoryFilter, stockFilter])

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

  const filterData = () => {
    let filtered = data

    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.categoria === categoryFilter)
    }

    
    if (stockFilter === 'out') {
      filtered = filtered.filter(item => item.stock === 0)
    } else if (stockFilter === 'low') {
      filtered = filtered.filter(item => item.stock > 0 && item.stock <= 10)
    } else if (stockFilter === 'normal') {
      filtered = filtered.filter(item => item.stock > 10)
    }

    setFilteredData(filtered)
  }

  const getStockBadgeVariant = (stock: number) => {
    if (stock === 0) return "destructive"
    if (stock <= 10) return "secondary"
    return "default"
  }

  const getStockBadgeText = (stock: number) => {
    if (stock === 0) return "Sin Stock"
    if (stock <= 10) return "Stock Bajo"
    return "En Stock"
  }

  const categories = Array.from(new Set(data.map(item => item.categoria)))

  const exportToCSV = () => {
    const headers = ['ID', 'Producto', 'Categoría', 'Precio', 'Stock', 'Consultas', 'Última Actualización']
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => [
        item.id,
        `"${item.producto}"`,
        `"${item.categoria}"`,
        item.precio,
        item.stock,
        item.consultas,
        item.ultimaActualizacion
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'inventario.csv')
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
          <p>Cargando inventario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventario</h1>
          <p className="text-muted-foreground">
            Gestiona y visualiza todos los productos en tu inventario
          </p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Exportar CSV</span>
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado de stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="out">Sin stock</SelectItem>
                <SelectItem value="low">Stock bajo</SelectItem>
                <SelectItem value="normal">Stock normal</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{filteredData.length} productos</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de inventario */}
      <Card>
        <CardHeader>
          <CardTitle>Productos ({filteredData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Consultas</TableHead>
                  <TableHead>Última Actualización</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">
                      {item.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.producto}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.categoria}</Badge>
                    </TableCell>
                    <TableCell>
                      ${item.precio.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{item.stock}</span>
                        {item.stock === 0 && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        {item.stock > 0 && item.stock <= 10 && (
                          <TrendingUp className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>{item.consultas}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.ultimaActualizacion}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStockBadgeVariant(item.stock)}>
                        {getStockBadgeText(item.stock)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
