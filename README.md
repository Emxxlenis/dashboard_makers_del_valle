# Dashboard de Inventario

Un dashboard moderno y responsivo para gestión de inventario que se conecta directamente a Google Sheets API. Construido con Next.js 14, TailwindCSS y shadcn/ui.

## 🚀 Características

- **Conexión directa a Google Sheets**: Lee datos en tiempo real sin necesidad de backend
- **Dashboard completo**: 6 secciones con funcionalidades avanzadas
- **Métricas en tiempo real**: KPIs clave del inventario
- **Gráficas interactivas**: Visualizaciones con Recharts
- **Sistema de alertas inteligente**: Monitoreo automático de stock y consultas
- **Filtros y búsqueda**: Herramientas avanzadas de análisis
- **Exportación de datos**: Reportes en CSV y JSON
- **Configuración personalizable**: Umbrales y preferencias ajustables
- **Dark mode**: Interfaz oscura por defecto
- **Deploy en Vercel**: Optimizado para despliegue en Vercel

## 📊 Métricas Incluidas

- Total de productos en inventario
- Stock total disponible
- Valor total del inventario
- Total de consultas realizadas
- Productos sin stock
- Productos con stock bajo
- Precio promedio por unidad
- Consultas promedio por producto
- Categorías más frecuentes
- Stock por categoría
- Consultas por categoría

## 🛠️ Tecnologías

- **Next.js 14** - Framework de React
- **TailwindCSS** - Estilos utilitarios
- **shadcn/ui** - Componentes de UI
- **Recharts** - Gráficas y visualizaciones
- **TypeScript** - Tipado estático
- **Google Sheets API** - Fuente de datos

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_SHEET_ID=tu_sheet_id_aqui
NEXT_PUBLIC_GOOGLE_API_KEY=tu_api_key_aqui
```

### 2. Configuración de Google Sheets

#### Obtener Sheet ID:
1. Abre tu Google Sheet
2. El ID está en la URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`

#### Obtener API Key:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google Sheets
4. Ve a "Credenciales" → "Crear credenciales" → "Clave de API"
5. Copia la clave generada

#### Estructura del Google Sheet:

Tu Google Sheet debe tener una hoja llamada "interactions" con la siguiente estructura:

| A (ID) | B (Producto) | C (Categoria) | D (Precio) | E (Stock) | F (Consultas) | G (UltimaActualizacion) |
|--------|--------------|---------------|------------|-----------|---------------|-------------------------|
| PROD001 | Laptop Dell  | Electrónicos  | 1299.99    | 15        | 45            | 2024-01-15              |
| PROD002 | iPhone 15    | Electrónicos  | 999.99     | 8         | 32            | 2024-01-16              |

**Nota**: La primera fila debe contener los headers exactos. Todas las columnas son obligatorias.

### 3. Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🚀 Despliegue en Vercel

### 1. Preparación

1. Sube tu código a GitHub
2. Asegúrate de que el archivo `.env.local` esté en tu `.gitignore`

### 2. Configuración en Vercel

1. Ve a [Vercel](https://vercel.com) y conecta tu repositorio
2. En la configuración del proyecto, agrega las variables de entorno:
   - `NEXT_PUBLIC_SHEET_ID`: Tu Sheet ID
   - `NEXT_PUBLIC_GOOGLE_API_KEY`: Tu API Key de Google

### 3. Deploy

Vercel desplegará automáticamente tu aplicación. El dashboard estará disponible en la URL proporcionada.

## 📱 Uso

### 🏠 Dashboard Principal
- **Métricas generales**: KPIs clave del inventario
- **Gráficas interactivas**: Stock y consultas por categoría
- **Productos recientes**: Lista de los últimos productos
- **Estado del sistema**: Conexión y última actualización

### 📦 Inventario
- **Tabla completa**: Todos los productos con filtros avanzados
- **Búsqueda**: Por nombre, categoría o ID
- **Filtros**: Por categoría y estado de stock
- **Exportación**: Descargar datos en CSV
- **Estados visuales**: Badges de stock bajo/sin stock

### 📊 Reportes
- **Análisis detallado**: Métricas de rendimiento
- **Gráficas especializadas**: Rentabilidad y tendencias
- **Productos más consultados**: Ranking de popularidad
- **Exportación**: Reportes en JSON
- **Filtros temporales**: Análisis por período

### 📈 Tendencias
- **Análisis temporal**: Evolución de consultas y stock
- **Correlaciones**: Relación entre variables
- **Productos en crecimiento**: Identificación de tendencias
- **Insights automáticos**: Análisis inteligente
- **Períodos configurables**: 7, 30 o 90 días

### 🚨 Alertas
- **Monitoreo automático**: Detección de problemas
- **Alertas inteligentes**: Stock bajo, consultas altas, precios elevados
- **Severidad configurable**: Crítica, alta, media, baja
- **Resolución manual**: Marcar alertas como resueltas
- **Configuración de umbrales**: Personalizar criterios

### ⚙️ Configuración
- **Conexión**: Configurar Sheet ID y API Key
- **Prueba de conexión**: Verificar conectividad
- **Umbrales**: Personalizar alertas
- **Preferencias**: Tema, actualización automática
- **Información del sistema**: Estado y versión

## 🔧 Personalización

### Modificar Métricas

Edita el archivo `lib/google-sheets.ts` para agregar nuevas métricas:

```typescript
export function calculateInventoryMetrics(items: InventoryItem[]) {
  // Agregar nuevas métricas aquí
  const customMetric = items.filter(item => /* tu lógica */).length
  
  return {
    // ... métricas existentes
    customMetric
  }
}
```

### Agregar Nuevas Gráficas

Modifica `components/charts.tsx` para incluir nuevas visualizaciones:

```typescript
// Agregar nueva gráfica
<Card>
  <CardHeader>
    <CardTitle>Nueva Gráfica</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Tu gráfica aquí */}
  </CardContent>
</Card>
```

## 🐛 Solución de Problemas

### Error de CORS
- Asegúrate de que tu API Key tenga permisos para acceder a Google Sheets
- Verifica que el Sheet ID sea correcto

### Datos no se cargan
- Revisa que las variables de entorno estén configuradas
- Verifica que el Google Sheet sea público o que la API Key tenga acceso
- Comprueba la estructura de datos en el Sheet

### Gráficas no se muestran
- Asegúrate de que hay datos suficientes en el Sheet
- Verifica que las columnas tengan el formato correcto

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

---

**Nota**: Este dashboard está diseñado para ser desplegado como aplicación frontend pura. No requiere backend propio y se conecta directamente a Google Sheets API.
