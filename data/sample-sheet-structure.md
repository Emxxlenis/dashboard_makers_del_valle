# Estructura de Google Sheet - Ejemplo

## Headers (Primera fila)
```
ID | Producto | Categoria | Precio | Stock | Consultas | UltimaActualizacion
```

## Datos de ejemplo (Filas 2 en adelante)
```
PROD001 | Laptop Dell XPS 13 | Electrónicos | 1299.99 | 15 | 45 | 2024-01-15
PROD002 | iPhone 15 Pro | Electrónicos | 999.99 | 8 | 32 | 2024-01-16
PROD003 | Camiseta Nike | Ropa | 29.99 | 50 | 28 | 2024-01-17
PROD004 | Zapatos Adidas | Ropa | 89.99 | 25 | 19 | 2024-01-18
PROD005 | Monitor Samsung | Electrónicos | 299.99 | 12 | 15 | 2024-01-19
PROD006 | Pantalón Levis | Ropa | 59.99 | 30 | 22 | 2024-01-20
PROD007 | Teclado Logitech | Electrónicos | 79.99 | 45 | 8 | 2024-01-21
PROD008 | Mouse Razer | Electrónicos | 69.99 | 20 | 12 | 2024-01-22
PROD009 | Chaqueta North Face | Ropa | 149.99 | 18 | 35 | 2024-01-23
PROD010 | Tablet iPad | Electrónicos | 329.99 | 10 | 41 | 2024-01-24
```

## Notas importantes:
- La primera fila DEBE contener los headers exactos
- Todas las columnas son obligatorias
- El ID debe ser único para cada producto
- El stock y consultas deben ser números enteros
- El precio debe ser un número decimal
- La fecha debe estar en formato YYYY-MM-DD
- El nombre de la hoja debe ser "interactions"
