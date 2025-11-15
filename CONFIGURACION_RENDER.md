# 🚀 Configuración para Render

## Configuración del Servicio en Render

### 1. Variables de Entorno en Render

Ve a tu servicio en Render → **Environment** y agrega estas variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
PORT=10000
```

**Nota**: Render asigna automáticamente el puerto, pero es buena práctica tener `PORT` configurado.

### 2. Configuración del Build

- **Build Command**: `npm install` (o déjalo vacío si Render lo detecta automáticamente)
- **Start Command**: `npm start`

### 3. Verificar que el Servicio Esté Activo

1. Ve a tu servicio en Render
2. Verifica que el estado sea **"Live"** (verde)
3. Revisa los logs para ver si hay errores

### 4. Logs Esperados al Iniciar

Cuando el servicio se inicia correctamente, deberías ver en los logs:

```
MongoDB Connected: ...
Server running on port 10000
🔧 Creando skill...
ℹ️  Validación de Skill ID deshabilitada (ALEXA_SKILL_ID no configurado)
✅ Skill creado exitosamente
✅ Adapter creado exitosamente
```

## Configuración del Endpoint en Alexa

1. Ve a [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Selecciona tu skill
3. Ve a **"Endpoint"**
4. Configura:
   - **HTTPS**
   - **Default Region**: `https://alexaapi-lx2z.onrender.com/alexa`
   - **Certificate**: "My development endpoint is a sub-domain of a domain that has a wildcard certificate from a certificate authority"

## Verificar que el Endpoint Funcione

### Opción 1: Desde los Logs de Render

1. Ve a tu servicio en Render
2. Click en **"Logs"**
3. Intenta abrir la skill: "Alexa, abre work space"
4. Deberías ver en los logs:

```
📥 Request recibido: { method: 'POST', path: '/', requestType: 'LaunchRequest', ... }
🚀 LaunchRequest recibido
```

### Opción 2: Probar con curl (desde tu terminal)

```bash
curl -X POST https://alexaapi-lx2z.onrender.com/alexa \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0",
    "session": {
      "new": true,
      "sessionId": "test",
      "application": {
        "applicationId": "amzn1.ask.skill.4e927fd5-44e5-4e95-ad3f-5ec8a118e378"
      }
    },
    "request": {
      "type": "LaunchRequest",
      "requestId": "test"
    }
  }'
```

**Nota**: Esto puede fallar por validación de firma de Alexa, pero deberías ver logs en Render.

## Problemas Comunes en Render

### El servicio no inicia

**Solución**:
- Verifica que `MONGODB_URI` esté configurado correctamente
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build para ver errores

### El servicio inicia pero no responde

**Solución**:
- Verifica que el endpoint en Alexa sea correcto: `https://alexaapi-lx2z.onrender.com/alexa`
- Verifica que el servicio esté en estado "Live"
- Revisa los logs para ver si hay errores cuando llegan requests

### Timeout en las respuestas

**Solución**:
- Render tiene un timeout de 30 segundos para servicios gratuitos
- Si MongoDB tarda mucho en responder, podría causar timeouts
- Considera usar un plan de pago si necesitas más tiempo

### No veo logs cuando intento usar la skill

**Solución**:
- Verifica que el endpoint en Alexa sea correcto
- Verifica que el servicio esté activo en Render
- Verifica que la URL sea accesible desde internet

## Verificar Variables de Entorno

En Render, las variables de entorno se configuran en:
1. Tu servicio → **Environment**
2. Agrega las variables necesarias:
   - `MONGODB_URI` (requerido)
   - `PORT` (opcional, Render lo asigna automáticamente)
   - `ALEXA_SKILL_ID` (opcional, solo si quieres validar el Skill ID)

## Próximos Pasos

1. ✅ Verifica que el servicio esté "Live" en Render
2. ✅ Verifica que las variables de entorno estén configuradas
3. ✅ Verifica que el endpoint en Alexa sea correcto
4. ✅ Intenta abrir la skill: "Alexa, abre work space"
5. ✅ Revisa los logs de Render para ver qué está pasando

## Logs de Debug

Si necesitas más información, los logs mostrarán:
- ✅ Cuando se recibe un request
- ✅ Cuando se procesa un LaunchRequest
- ❌ Cualquier error que ocurra

Revisa los logs en Render → **Logs** para diagnosticar problemas.

