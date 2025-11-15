# Guía para Registrar un Foco RGB

## 📋 Antes de Empezar

**IMPORTANTE**: Necesitas saber el **nombre exacto** del foco como aparece en la app de Alexa. Este nombre debe coincidir exactamente (mayúsculas, minúsculas, espacios, etc.).

Para encontrarlo:
1. Abre la app de Alexa en tu móvil
2. Ve a "Dispositivos" o "Devices"
3. Busca tu foco RGB
4. Copia el nombre exacto que aparece

---

## Método 1: Usando el Script (Más Fácil) ⭐

### Paso 1: Abre la terminal en la carpeta del proyecto

```bash
cd "c:\Users\Flami\OneDrive\Desktop\app\AlexaSkillNodeExpress-master"
```

### Paso 2: Ejecuta el script

**Opción A: Con parámetros (recomendado)**
```bash
node scripts/registrarFoco.js "Foco Sala" "Foco Sala"
```

Donde:
- Primer parámetro: Nombre que quieres usar en la skill (puede ser cualquier nombre)
- Segundo parámetro: **Nombre exacto del foco en Alexa** (debe coincidir exactamente)

**Ejemplo:**
```bash
# Si tu foco se llama "Luz RGB Sala" en Alexa:
node scripts/registrarFoco.js "Foco Sala" "Luz RGB Sala"

# Si tu foco se llama "Smart Light" en Alexa:
node scripts/registrarFoco.js "Foco Principal" "Smart Light"
```

**Opción B: Sin parámetros (usa valores por defecto)**
```bash
node scripts/registrarFoco.js
```
Esto creará un foco llamado "Foco Sala" (asegúrate de que coincida con el nombre en Alexa).

### Paso 3: Verifica el resultado

Si todo salió bien, verás:
```
✅ Foco registrado exitosamente!
Datos: { nombre: 'Foco Sala', nombreAlexa: 'Foco Sala', ... }
```

---

## Método 2: Usando la API REST (Desde tu App Móvil)

### Paso 1: Agregar las rutas en `index.js`

Abre `index.js` y agrega esta línea después de `app.use('/alexa', ...)`:

```javascript
app.use(express.json()); // Si no está ya
app.use('/api/focos', require('./routes/focoRoute'));
```

### Paso 2: Hacer una petición POST

Desde tu aplicación móvil o usando Postman/curl:

```bash
POST http://localhost:3000/api/focos
Content-Type: application/json

{
  "nombre": "Foco Sala",
  "nombreAlexa": "Foco Sala",
  "usuario": "userId" // Opcional
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:3000/api/focos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Foco Sala","nombreAlexa":"Foco Sala"}'
```

---

## Método 3: Directamente en MongoDB (Avanzado)

### Opción A: Usando MongoDB Compass o MongoDB Shell

1. Conecta a tu base de datos MongoDB
2. Selecciona la base de datos
3. Ve a la colección `focorgbs`
4. Inserta un documento:

```json
{
  "nombre": "Foco Sala",
  "nombreAlexa": "Foco Sala",
  "estado": false,
  "brillo": 50,
  "color": {
    "rojo": 255,
    "verde": 255,
    "azul": 255
  },
  "colorNombre": "blanco",
  "fechaCreacion": new Date(),
  "fechaActualizacion": new Date()
}
```

### Opción B: Usando un script Node.js personalizado

Crea un archivo `miScript.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const FocoRGB = require('./models/FocoRGB');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const foco = new FocoRGB({
    nombre: 'Foco Sala',
    nombreAlexa: 'Foco Sala', // ⚠️ Nombre exacto en Alexa
    estado: false,
    brillo: 50,
    color: { rojo: 255, verde: 255, azul: 255 },
    colorNombre: 'blanco'
  });
  
  await foco.save();
  console.log('✅ Foco registrado!');
  process.exit(0);
}

main();
```

Luego ejecuta:
```bash
node miScript.js
```

---

## ✅ Verificar que el Foco Está Registrado

### Opción 1: Usando la API

```bash
GET http://localhost:3000/api/focos
```

### Opción 2: Usando MongoDB

Consulta la colección `focorgbs` en tu base de datos.

### Opción 3: Usando Alexa

Di: **"Alexa, abre work space y lista mis focos"**

---

## 🔧 Solución de Problemas

### Error: "El foco ya existe"

El foco con ese nombre ya está registrado. Opciones:
- Usa un nombre diferente
- Elimina el foco existente desde MongoDB
- Actualiza el foco existente

### Error de conexión a MongoDB

Verifica que:
1. Tu archivo `.env` tenga `MONGODB_URI` correcto
2. MongoDB esté accesible
3. Las credenciales sean correctas

### El foco no responde en Alexa

1. **Verifica el nombre**: El `nombreAlexa` debe coincidir EXACTAMENTE con el nombre en la app de Alexa
2. **Verifica que el foco esté en Alexa**: El dispositivo debe estar vinculado a tu cuenta de Alexa
3. **Implementa el control real**: El código actual solo actualiza la BD, necesitas implementar el control en `alexaDeviceService.js`

### No reconoce el nombre del foco

- Usa el nombre exacto como aparece en la app de Alexa
- Respeta mayúsculas y minúsculas
- Respeta espacios y caracteres especiales

---

## 📝 Ejemplos Prácticos

### Ejemplo 1: Foco llamado "Luz RGB" en Alexa

```bash
node scripts/registrarFoco.js "Foco Principal" "Luz RGB"
```

### Ejemplo 2: Foco llamado "Smart Light Bedroom" en Alexa

```bash
node scripts/registrarFoco.js "Foco Dormitorio" "Smart Light Bedroom"
```

### Ejemplo 3: Múltiples focos

```bash
# Foco 1
node scripts/registrarFoco.js "Foco Sala" "Luz RGB Sala"

# Foco 2
node scripts/registrarFoco.js "Foco Cocina" "Luz RGB Cocina"

# Foco 3
node scripts/registrarFoco.js "Foco Dormitorio" "Smart Light Bedroom"
```

---

## 🎯 Próximos Pasos

Una vez registrado el foco:

1. ✅ Prueba con Alexa: "Alexa, abre work space y enciende el foco"
2. ✅ Verifica que el nombre coincida exactamente
3. ✅ Implementa el control real en `alexaDeviceService.js` (ver `FOCO_RGB_SETUP.md`)

---

## 💡 Consejos

- **Usa nombres descriptivos** para el campo `nombre` (es el que verás en la skill)
- **Copia exactamente** el nombre de Alexa para `nombreAlexa`
- **Registra todos tus focos** antes de usar la skill
- **Prueba con "lista mis focos"** para verificar que están registrados

