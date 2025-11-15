# 🔍 Diagnóstico de Error "INVALID_RESPONSE" en Alexa Skill

## Problema

Cuando intentas abrir la skill diciendo "abre work space", recibes el error:
```
Hubo un problema con la respuesta de la Skill que solicitaste.
```

Y en los logs de Alexa aparece:
```json
{
  "reason": "ERROR",
  "error": {
    "type": "INVALID_RESPONSE",
    "message": "An exception occurred while dispatching the request to the skill."
  }
}
```

## Cambios Realizados

Se han realizado las siguientes mejoras para diagnosticar y solucionar el problema:

### 1. Mejorado el Manejo de Errores
- ✅ Agregado logging detallado de requests
- ✅ Agregado manejo de errores global
- ✅ Agregado try-catch en LaunchRequest

### 2. Mejorado el LaunchRequest
- ✅ Agregado manejo de errores
- ✅ Mejorado el mensaje de bienvenida
- ✅ Agregado logging

## Pasos para Diagnosticar

### 1. Verificar que el Servidor Esté Corriendo

```bash
npm start
```

Deberías ver:
```
MongoDB Connected: ...
Server running on port 3000
✅ Validación de Skill ID habilitada: ... (o mensaje de deshabilitada)
```

### 2. Verificar la Conexión a MongoDB

El servidor necesita conectarse a MongoDB. Verifica:

1. **Archivo `.env` existe y tiene `MONGODB_URI`**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
   ```

2. **MongoDB está accesible**: Si el servidor no puede conectarse, verás un error y el proceso se detendrá.

### 3. Verificar el Endpoint en la Consola de Alexa

1. Ve a [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Selecciona tu skill
3. Ve a **"Endpoint"**
4. Verifica que la URL sea correcta:
   - Si usas ngrok: `https://xxxxxx.ngrok.io/alexa`
   - Si usas Render/Heroku: `https://tu-app.onrender.com/alexa`
   - **IMPORTANTE**: Debe terminar en `/alexa`

### 4. Revisar los Logs del Servidor

Cuando intentas abrir la skill, deberías ver en la consola del servidor:

```
📥 Request recibido: { method: 'POST', path: '/', requestType: 'LaunchRequest', ... }
🚀 LaunchRequest recibido
```

Si no ves estos logs:
- El servidor no está recibiendo el request
- Verifica que el endpoint esté configurado correctamente
- Verifica que el servidor esté accesible desde internet (ngrok, Render, etc.)

Si ves errores:
- Revisa el stack trace completo
- Verifica la conexión a MongoDB
- Verifica que todas las dependencias estén instaladas

### 5. Verificar el Skill ID (si está configurado)

Si tienes `ALEXA_SKILL_ID` en tu `.env`, verifica que coincida con el Skill ID de tu skill:

1. En la consola de Alexa, ve a tu skill
2. Copia el Skill ID (formato: `amzn1.ask.skill.xxxxx`)
3. Compara con el que tienes en `.env`

Si no coinciden, el servidor rechazará el request.

### 6. Probar el Endpoint Manualmente

Puedes probar el endpoint con curl o Postman:

```bash
curl -X POST https://tu-url.com/alexa \
  -H "Content-Type: application/json" \
  -d '{
    "version": "1.0",
    "session": {
      "new": true,
      "sessionId": "test",
      "application": {
        "applicationId": "amzn1.ask.skill.test"
      }
    },
    "request": {
      "type": "LaunchRequest",
      "requestId": "test"
    }
  }'
```

**Nota**: Esto puede fallar por validación de firma, pero deberías ver logs en el servidor.

## Soluciones Comunes

### Error: "MongoDB connection failed"

**Solución**: 
- Verifica que `MONGODB_URI` sea correcto
- Verifica que MongoDB esté accesible
- Verifica las credenciales

### Error: "Skill ID validation failed"

**Solución**:
- Elimina `ALEXA_SKILL_ID` de `.env` temporalmente para probar
- O verifica que el Skill ID sea correcto

### Error: "Cannot find module"

**Solución**:
```bash
npm install
```

### El servidor no recibe requests

**Solución**:
- Verifica que el endpoint en la consola de Alexa sea correcto
- Verifica que el servidor esté accesible desde internet
- Si usas ngrok, verifica que esté corriendo y actualiza la URL en la consola

## Próximos Pasos

1. **Reinicia el servidor**:
   ```bash
   npm start
   ```

2. **Intenta abrir la skill de nuevo**: "Alexa, abre work space"

3. **Revisa los logs del servidor** para ver qué está pasando

4. **Si ves errores**, comparte los logs completos para diagnosticar mejor

## Logs Esperados

Cuando todo funciona correctamente, deberías ver:

```
MongoDB Connected: ...
Server running on port 3000
ℹ️  Validación de Skill ID deshabilitada (ALEXA_SKILL_ID no configurado)
📥 Request recibido: { method: 'POST', path: '/', requestType: 'LaunchRequest', ... }
🚀 LaunchRequest recibido
```

Si ves errores después de estos logs, el problema está en el handler específico.

