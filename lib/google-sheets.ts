export interface InventoryItem {
  id: string
  producto: string
  categoria: string
  precio: number
  stock: number
  consultas: number
  ultimaActualizacion: string
}

export interface SheetData {
  values: string[][]
}

export async function fetchSheetData(): Promise<InventoryItem[]> {
  const sheetId = process.env.NEXT_PUBLIC_SHEET_ID
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  if (!sheetId || !apiKey) {
    throw new Error('Las variables de entorno NEXT_PUBLIC_SHEET_ID y NEXT_PUBLIC_GOOGLE_API_KEY son requeridas')
  }

  try {
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/interactions?key=${apiKey}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.status} ${response.statusText}`)
    }

    const data: SheetData = await response.json()
    
    
    if (!data.values || data.values.length < 2) {
      return []
    }

    const headers = data.values[0]
    const rows = data.values.slice(1)

    return rows.map((row, index) => {
      const item: InventoryItem = {
        id: row[0] || `item-${index}`, // ID
        producto: row[1] || '', // Producto
        categoria: row[2] || '', // Categoria
        precio: parseFloat(row[3]) || 0, // Precio
        stock: parseInt(row[4]) || 0, // Stock
        consultas: parseInt(row[5]) || 0, // Consultas
        ultimaActualizacion: row[6] || '', // UltimaActualizacion
      }
      return item
    })
  } catch (error) {
    console.error('Error al obtener datos de Google Sheets:', error)
    throw error
  }
}

// Función para calcular métricas del inventario
export function calculateInventoryMetrics(items: InventoryItem[]) {
  const totalProducts = items.length
  const totalStock = items.reduce((sum, item) => sum + item.stock, 0)
  const totalValue = items.reduce((sum, item) => sum + (item.stock * item.precio), 0)
  const totalConsultas = items.reduce((sum, item) => sum + item.consultas, 0)
  const outOfStock = items.filter(item => item.stock === 0).length
  const lowStock = items.filter(item => item.stock > 0 && item.stock <= 10).length
  
  // Categorías más frecuentes
  const categoryCount = items.reduce((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const topCategories = Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }))

  // Stock por categoría
  const stockByCategory = items.reduce((acc, item) => {
    acc[item.categoria] = (acc[item.categoria] || 0) + item.stock
    return acc
  }, {} as Record<string, number>)

  const stockByCategoryArray = Object.entries(stockByCategory)
    .map(([category, stock]) => ({ category, stock }))
    .sort((a, b) => b.stock - a.stock)

  return {
    totalProducts,
    totalStock,
    totalValue,
    totalConsultas,
    outOfStock,
    lowStock,
    outOfStockPercentage: totalProducts > 0 ? (outOfStock / totalProducts) * 100 : 0,
    lowStockPercentage: totalProducts > 0 ? (lowStock / totalProducts) * 100 : 0,
    averagePrice: totalProducts > 0 ? totalValue / totalStock : 0,
    averageConsultas: totalProducts > 0 ? totalConsultas / totalProducts : 0,
    topCategories,
    stockByCategory: stockByCategoryArray
  }
}
