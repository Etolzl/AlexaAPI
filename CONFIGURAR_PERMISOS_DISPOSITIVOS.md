# 🔐 Configurar Permisos para Detectar Dispositivos Alexa

## ⚠️ Importante - Limitación de Custom Skills

**Las Custom Skills de Alexa tienen acceso limitado a la API de dispositivos**. La API `/v2/devices` puede no estar disponible directamente desde Custom Skills sin permisos especiales que no aparecen en la lista estándar de permisos.

## 🔍 Situación Actual

Después de revisar los permisos disponibles en la consola de Alexa, **no existe un permiso específico** para "leer lista de dispositivos" en Custom Skills. Los permisos disponibles son principalmente para:
- Dirección del dispositivo
- Información del cliente (nombre, email, teléfono)
- Listas de Alexa
- Recordatorios
- Servicios de ubicación
- Personalización

## 🧪 Prueba Directa

El código implementado intentará usar el `apiAccessToken` que viene automáticamente en cada request. **Puede funcionar sin permisos adicionales** si Alexa proporciona acceso básico a la API de dispositivos.

### Pasos para Probar:

1. **No necesitas configurar permisos adicionales** (por ahora)
2. Prueba directamente diciendo: **"Alexa, abre work space y descubre mis focos"**
3. Revisa los logs del servidor para ver si la API responde correctamente

### Si Funciona:
- ✅ Verás en los logs: "✅ Dispositivos obtenidos: X dispositivos"
- ✅ Los focos se registrarán automáticamente

### Si NO Funciona:
- ❌ Verás errores como "Error 403" o "Error 401" en los logs
- ❌ La skill dirá: "No tengo acceso a tu cuenta de Alexa"

### 4. Probar la Funcionalidad

Una vez configurados los permisos, puedes probar:

**Comando:**
- "Alexa, abre work space y descubre mis focos"

**O simplemente:**
- "Alexa, abre work space y lista mis focos" (si no hay focos registrados, intentará descubrirlos automáticamente)

## 🔄 Alternativa: Registro Manual

Si la detección automática no funciona (debido a limitaciones de la API), puedes registrar tus focos manualmente:

### Opción 1: Usar el Script de Registro

```bash
npm run registrar-foco
```

Sigue las instrucciones para registrar tu foco "Foco Sala".

### Opción 2: Registrar desde la Skill

Puedes decir: **"Alexa, abre work space y enciende Foco Sala"** y la skill intentará registrar el foco automáticamente si no existe.

## 📝 Notas Importantes

1. **Primera vez**: La primera vez que uses la skill, Alexa puede pedirte que autorices los permisos. Acepta para que la skill pueda acceder a tus dispositivos.

2. **Permisos requeridos**: El permiso más importante es **"Read device list information"** que permite a la skill obtener la lista de tus dispositivos.

3. **Filtrado automático**: La skill solo detectará dispositivos que:
   - Sean luces/focos
   - Tengan capacidad de color (ColorController)
   - Estén vinculados a tu cuenta de Alexa

## 🎯 Qué Hace la Función de Descubrimiento

Cuando dices "descubre mis focos", la skill:

1. ✅ Se conecta a la API de Alexa usando tu token de acceso
2. ✅ Obtiene la lista de todos tus dispositivos
3. ✅ Filtra solo los focos/luces con capacidad de color
4. ✅ Los registra automáticamente en la base de datos
5. ✅ Te informa cuántos encontró y registró

## 🐛 Solución de Problemas

### Error: "No tengo acceso a tu cuenta de Alexa"

**Causa:** El `apiAccessToken` no está disponible o no tiene permisos para acceder a la API de dispositivos.

**Solución:**
1. **Registra tus focos manualmente** usando el script o diciendo el nombre del foco
2. La skill funcionará normalmente para gestionar los focos registrados
3. La detección automática es una funcionalidad adicional que puede no estar disponible

### Error 403 o 401 en los logs

**Causa:** La API de dispositivos no está disponible para Custom Skills sin permisos especiales.

**Solución:**
- Usa el registro manual de focos
- La skill seguirá funcionando para gestionar los focos que registres

### No encuentra focos

**Posibles causas:**
1. La API de dispositivos no está disponible para Custom Skills
2. Los focos no tienen capacidad de color configurada en Alexa
3. Los focos no están vinculados correctamente

**Solución:**
- **Registra tus focos manualmente** (esta es la forma más confiable)
- Verifica en la app de Alexa que tus focos estén vinculados
- Usa comandos directos de Alexa para controlar los focos físicamente

## ✅ Verificación

### Si la Detección Automática Funciona:

1. ✅ Decir "descubre mis focos" y que la skill encuentre tus focos
2. ✅ Ver en los logs: "✅ Dispositivos obtenidos: X dispositivos"
3. ✅ Ver: "✅ Focos encontrados en Alexa: X"
4. ✅ Los focos se registran automáticamente en la base de datos

### Si la Detección Automática NO Funciona (Más Probable):

1. ✅ Usa registro manual: `npm run registrar-foco`
2. ✅ O di: "Alexa, abre work space y enciende Foco Sala" (la skill lo registrará si no existe)
3. ✅ Una vez registrado, la skill funcionará normalmente para gestionar el foco

## 📝 Nota Final

**La detección automática es una funcionalidad experimental**. Si no funciona debido a limitaciones de la API de Alexa, no es un problema: puedes registrar tus focos manualmente y la skill funcionará perfectamente para gestionarlos.

