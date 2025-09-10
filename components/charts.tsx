'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Line
} from "recharts"

interface ChartsProps {
  stockByCategory: Array<{ category: string; stock: number }>
  topCategories: Array<{ category: string; count: number }>
  items: Array<{
    id: string
    producto: string
    categoria: string
    stock: number
    precio: number
    consultas: number
    ultimaActualizacion: string
  }>
}

// Colores para las gráficas
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'
]

export function Charts({ stockByCategory, topCategories, items }: ChartsProps) {
  
  const consultasByCategory = items.reduce((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + item.consultas
    return acc
  }, {} as Record<string, number>)

  const consultasByCategoryArray = Object.entries(consultasByCategory)
    .map(([category, consultas]) => ({ category, consultas }))
    .sort((a, b) => b.consultas - a.consultas)

  
  const evolutionData = items
    .filter(item => item.ultimaActualizacion)
    .slice(0, 10)
    .map((item, index) => ({
      fecha: item.ultimaActualizacion || `Día ${index + 1}`,
      consultas: item.consultas,
      stock: item.stock
    }))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Gráfica de Stock por Categoría */}
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

      {/* Gráfica de Consultas por Categoría */}
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

      {/* Gráfica de Evolución de Consultas y Stock */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Evolución de Consultas y Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="consultas" 
                stroke="#8884d8" 
                strokeWidth={2}
                name="Consultas"
              />
              <Line 
                type="monotone" 
                dataKey="stock" 
                stroke="#82ca9d" 
                strokeWidth={2}
                name="Stock"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
