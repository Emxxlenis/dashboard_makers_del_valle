# Script de Configuración

## Pasos para configurar el proyecto:

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
cp env.example .env.local

# Editar .env.local con tus valores reales
```

### 3. Configurar Google Sheets

#### Crear un Google Sheet con la estructura correcta:
- Abre [Google Sheets](https://sheets.google.com)
- Crea una nueva hoja
- En la primera fila, agrega estos headers:
  ```
  nombre | categoria | stock | precio | fecha_entrada | fecha_salida | proveedor | descripcion
  ```
- Agrega algunos datos de ejemplo (ver `data/sample-sheet-structure.md`)

#### Obtener Sheet ID:
- Copia el ID de la URL del sheet
- Ejemplo: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
- El ID es: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

#### Obtener API Key:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Habilita la "Google Sheets API"
4. Ve a "Credenciales" → "Crear credenciales" → "Clave de API"
5. Copia la clave generada

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

### 5. Verificar funcionamiento
- Abre http://localhost:3000
- Deberías ver el dashboard cargando datos de tu Google Sheet

## Para deploy en Vercel:

### 1. Subir a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

### 2. Conectar con Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. En "Environment Variables", agrega:
   - `NEXT_PUBLIC_SHEET_ID`: Tu Sheet ID
   - `NEXT_PUBLIC_GOOGLE_API_KEY`: Tu API Key
4. Deploy

¡Listo! Tu dashboard estará disponible en la URL de Vercel.
