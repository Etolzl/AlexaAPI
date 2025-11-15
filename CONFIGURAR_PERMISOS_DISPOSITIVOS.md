# 🔐 Configurar Permisos para Detectar Dispositivos Alexa

## ⚠️ Importante

Para que la skill pueda detectar automáticamente tus focos vinculados en Alexa, necesitas configurar los **permisos de la skill** en la consola de desarrolladores.

## 📋 Pasos para Configurar Permisos

### 1. Ir a la Configuración de Permisos

1. Ve a [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Selecciona tu skill
3. Ve a **"Permissions"** en el menú lateral (o **"Permisos"**)

### 2. Habilitar Permisos de Dispositivos

Busca y habilita los siguientes permisos:

- ✅ **"Read device address information"** (Leer información de dirección del dispositivo)
- ✅ **"Read device location information"** (Leer información de ubicación del dispositivo)
- ✅ **"Read device list information"** (Leer información de lista de dispositivos) ⭐ **Este es el más importante**

### 3. Guardar y Reconstruir

1. Guarda los cambios
2. Ve a **"Build"** → **"Interaction Model"**
3. Haz click en **"Build Model"** (aunque no hayas cambiado el modelo, a veces es necesario después de cambiar permisos)

### 4. Probar la Funcionalidad

Una vez configurados los permisos, puedes probar:

**Comando:**
- "Alexa, abre work space y descubre mis focos"

**O simplemente:**
- "Alexa, abre work space y lista mis focos" (si no hay focos registrados, intentará descubrirlos automáticamente)

## 🔍 Verificar que los Permisos Estén Activos

Si los permisos no están configurados, verás un error como:
- "No tengo acceso a tu cuenta de Alexa"
- "Por favor, verifica los permisos de la skill"

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

**Solución:**
1. Verifica que los permisos estén habilitados en la consola
2. Reconstruye el modelo de interacción
3. Vuelve a probar la skill

### No encuentra focos

**Posibles causas:**
1. Los focos no tienen capacidad de color configurada en Alexa
2. Los focos no están vinculados correctamente
3. Los permisos no están habilitados

**Solución:**
- Verifica en la app de Alexa que tus focos tengan capacidad de color
- Asegúrate de que los focos estén vinculados a tu cuenta
- Verifica los permisos de la skill

### Error en la API

Si ves errores en los logs como "Error 403" o "Error 401":
- Los permisos no están configurados correctamente
- El token de acceso no tiene los permisos necesarios
- Verifica la configuración de permisos en la consola

## ✅ Verificación

Después de configurar los permisos, deberías poder:

1. ✅ Decir "descubre mis focos" y que la skill encuentre tus focos
2. ✅ Ver en los logs: "✅ Dispositivos obtenidos: X dispositivos"
3. ✅ Ver: "✅ Focos encontrados en Alexa: X"
4. ✅ Los focos se registran automáticamente en la base de datos

