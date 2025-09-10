# 🚀 Configuración Rápida del Dashboard

## 📋 Pasos para configurar tu dashboard con la hoja "interactions"

### 1. 📊 Preparar tu Google Sheet

Tu Google Sheet debe tener:
- **Nombre de la hoja**: `interactions`
- **Headers en la primera fila**:
  ```
  ID | Producto | Categoria | Precio | Stock | Consultas | UltimaActualizacion
  ```

### 2. 🔑 Obtener las variables de entorno

#### Sheet ID:
1. Abre tu Google Sheet
2. Copia el ID de la URL:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ES_TU_SHEET_ID]/edit
   ```

#### API Key:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto
3. Habilita "Google Sheets API"
4. Crea una "Clave de API"
5. Copia la clave (empieza con `AIza...`)

### 3. ⚙️ Configurar el proyecto

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SHEET_ID=tu_sheet_id_aqui
NEXT_PUBLIC_GOOGLE_API_KEY=tu_api_key_aqui
```

### 4. 🚀 Ejecutar

```bash
npm install
npm run dev
```

### 5. ✅ Verificar

Abre http://localhost:3000 y deberías ver:
- ✅ Datos cargados de tu Google Sheet
- ✅ Métricas de productos, stock, consultas
- ✅ Gráficas de stock y consultas por categoría
- ✅ Lista de productos con sus consultas

## 🔧 Solución de problemas

### Error: "Las variables de entorno son requeridas"
- Verifica que `.env.local` existe y tiene los valores correctos
- Reinicia el servidor después de cambiar las variables

### Error: "Error al obtener datos"
- Verifica que el Sheet ID es correcto
- Asegúrate de que la hoja se llama "interactions"
- Verifica que la API Key tiene permisos

### No se muestran datos
- Verifica que la primera fila tiene los headers exactos
- Asegúrate de que hay datos en las filas siguientes
- Verifica que el Google Sheet es público o la API Key tiene acceso

## 📝 Estructura de datos esperada

```
ID          | Producto        | Categoria   | Precio  | Stock | Consultas | UltimaActualizacion
PROD001     | Laptop Dell     | Electrónicos| 1299.99 | 15    | 45        | 2024-01-15
PROD002     | iPhone 15       | Electrónicos| 999.99  | 8     | 32        | 2024-01-16
```

¡Listo! Tu dashboard debería funcionar perfectamente con tus datos de "interactions".
