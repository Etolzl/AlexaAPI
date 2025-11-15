# Configuración del Control de Foco RGB en Alexa Skill

## Descripción

Esta skill de Alexa te permite controlar focos RGB que están vinculados a tu cuenta de Alexa. Puedes encender, apagar, cambiar el color y ajustar el brillo de tus focos mediante comandos de voz.

## Características

- ✅ Encender/Apagar focos RGB
- ✅ Cambiar el color del foco (rojo, verde, azul, amarillo, naranja, morado, rosa, blanco, cian, magenta, verde lima, turquesa)
- ✅ Ajustar el brillo del 0 al 100%
- ✅ Listar focos disponibles
- ✅ Control por nombre de foco (si tienes múltiples focos)

## Instalación

### 1. Configurar el Foco en la Base de Datos

Antes de usar la skill, necesitas registrar tu foco RGB en la base de datos. Puedes hacerlo de dos formas:

#### Opción A: Desde tu aplicación móvil
Crea un endpoint en tu backend para registrar focos:

```javascript
// Ejemplo de endpoint POST /api/focos
{
  "nombre": "Foco Sala",
  "nombreAlexa": "Foco Sala", // Nombre exacto como aparece en la app de Alexa
  "usuario": "userId" // Opcional
}
```

#### Opción B: Directamente en MongoDB

```javascript
const FocoRGB = require('./models/FocoRGB');

const nuevoFoco = new FocoRGB({
  nombre: 'Foco Sala',
  nombreAlexa: 'Foco Sala', // IMPORTANTE: Debe coincidir con el nombre en Alexa
  estado: false,
  brillo: 50,
  color: {
    rojo: 255,
    verde: 255,
    azul: 255
  },
  colorNombre: 'blanco'
});

await nuevoFoco.save();
```

### 2. Actualizar el Modelo de Interacción

1. Ve a la [Consola de Desarrolladores de Alexa](https://developer.amazon.com/alexa/console/ask)
2. Selecciona tu skill
3. Ve a "Build" > "Interaction Model"
4. Importa el archivo `interaction-model-foco-rgb.json` o copia su contenido
5. Guarda y construye el modelo

### 3. Desplegar el Código

Asegúrate de que todos los archivos nuevos estén desplegados:
- `models/FocoRGB.js`
- `src/intents/FocoRGBIntents.js`
- `src/services/alexaDeviceService.js`
- `src/skillHandler.js` (actualizado)

## Comandos Disponibles

### Encender Foco
- "Enciende el foco"
- "Enciende [nombre del foco]"
- "Prende el foco"
- "Activa la luz"

### Apagar Foco
- "Apaga el foco"
- "Apaga [nombre del foco]"
- "Desactiva la luz"

### Cambiar Color
- "Cambia el color a rojo"
- "Pon el color azul"
- "Cambia a verde"
- "Pon [nombre del foco] en morado"

**Colores disponibles:**
- rojo, verde, azul, amarillo, naranja, morado, rosa, blanco, cian, magenta, verde lima, turquesa

### Cambiar Brillo
- "Pon el brillo al 50"
- "Cambia el brillo a 75 por ciento"
- "Brillo al 30"
- "Ajusta el brillo a 100"

### Listar Focos
- "Lista mis focos"
- "Qué focos tengo"
- "Muéstrame mis focos"

## Integración con Dispositivos Alexa

### Importante: Control Real del Dispositivo

El archivo `src/services/alexaDeviceService.js` contiene funciones base para controlar dispositivos. **Necesitas implementar la lógica real** para controlar tu foco RGB.

### Opciones de Integración

#### Opción 1: Smart Home Skill API (Recomendado para producción)
Requiere crear una Smart Home Skill adicional y certificación de Amazon. Esto permite control directo de dispositivos.

#### Opción 2: Backend IoT
Si tu foco se controla a través de un backend propio:

```javascript
// En alexaDeviceService.js, actualiza controlAlexaDevice:
async function controlAlexaDevice(deviceName, action, params = {}) {
  // Llamar a tu API IoT
  const response = await fetch('https://tu-api-iot.com/control', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      device: deviceName,
      action: action,
      ...params
    })
  });
  
  return await response.json();
}
```

#### Opción 3: Webhook a Servicio Externo
Si usas un servicio como IFTTT, Home Assistant, etc.:

```javascript
async function controlAlexaDevice(deviceName, action, params = {}) {
  // Enviar webhook
  await fetch('https://tu-webhook.com/alexa-control', {
    method: 'POST',
    body: JSON.stringify({ deviceName, action, params })
  });
}
```

#### Opción 4: Integración con API de Alexa (Avanzado)
Si tienes acceso a la API de Alexa para controlar dispositivos directamente:

```javascript
// Requiere autenticación OAuth y permisos de Smart Home
const alexaApi = require('alexa-smart-home-api');

async function controlAlexaDevice(deviceName, action, params = {}) {
  const device = await alexaApi.getDevice(deviceName);
  return await alexaApi.controlDevice(device.id, action, params);
}
```

## Estructura de Datos

### Modelo FocoRGB

```javascript
{
  nombre: String,              // Nombre amigable
  nombreAlexa: String,         // Nombre exacto en Alexa (IMPORTANTE)
  estado: Boolean,             // true = encendido
  brillo: Number,              // 0-100
  color: {
    rojo: Number,              // 0-255
    verde: Number,             // 0-255
    azul: Number               // 0-255
  },
  colorNombre: String,         // Nombre del color actual
  usuario: ObjectId,           // Usuario propietario (opcional)
  fechaCreacion: Date,
  fechaActualizacion: Date
}
```

## Solución de Problemas

### El foco no se enciende/apaga

1. **Verifica el nombre**: El `nombreAlexa` debe coincidir exactamente con el nombre del dispositivo en la app de Alexa
2. **Implementa el control real**: Asegúrate de haber implementado la lógica en `alexaDeviceService.js`
3. **Revisa los logs**: El código incluye logs detallados en la consola

### No reconoce el nombre del foco

- Usa el intent de texto libre: "Enciende [nombre completo del foco]"
- Verifica que el foco esté registrado en la base de datos
- Di "Lista mis focos" para verificar los nombres disponibles

### No reconoce el color

- Usa nombres simples: "rojo", "azul", "verde"
- Los colores disponibles están listados en `COLOR_MAP` en `alexaDeviceService.js`
- Puedes agregar más colores editando el `COLOR_MAP`

### El brillo no cambia

- Asegúrate de decir un número del 0 al 100
- Ejemplos: "Pon el brillo al 50", "Brillo a 75 por ciento"
- Verifica que la función `cambiarBrilloFoco` esté implementada correctamente

## Próximos Pasos

1. **Implementar control real**: Actualiza `alexaDeviceService.js` con tu lógica de control
2. **Agregar más colores**: Edita `COLOR_MAP` para agregar más opciones
3. **Autenticación de usuarios**: Si tienes múltiples usuarios, implementa autenticación
4. **Escenas predefinidas**: Crea intents para escenas de color predefinidas
5. **Control de múltiples focos**: Mejora la detección cuando hay varios focos

## Ejemplos de Uso

```
Usuario: "Alexa, abre work space"
Alexa: "Hola, bienvenido workspace..."

Usuario: "Enciende el foco"
Alexa: "Perfecto, he encendido el foco Foco Sala."

Usuario: "Cambia el color a rojo"
Alexa: "Perfecto, he cambiado el color del foco Foco Sala a rojo."

Usuario: "Pon el brillo al 80"
Alexa: "Perfecto, he ajustado el brillo del foco Foco Sala a 80 por ciento."

Usuario: "Apaga el foco"
Alexa: "Listo, he apagado el foco Foco Sala."
```

## Notas Importantes

⚠️ **El control real del dispositivo debe implementarse**. El código actual solo actualiza la base de datos y registra los comandos. Para que el foco realmente se controle, necesitas integrar con tu sistema IoT o la API de Alexa.

✅ **El nombre en Alexa es crítico**. Asegúrate de que `nombreAlexa` coincida exactamente con el nombre del dispositivo en la app de Alexa.

🔧 **Personaliza según tus necesidades**. El código está diseñado para ser extensible y fácil de modificar.

