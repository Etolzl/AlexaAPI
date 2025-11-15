# 🔧 Configuración para Skill Personal de Alexa

## Situación

Si estás usando un proyecto compartido pero quieres probar la skill en tu cuenta personal de Alexa/Amazon, necesitas configurar tu skill personal para que apunte al mismo backend.

---

## ✅ Pasos para Configurar tu Skill Personal

### 1. Crear o Seleccionar tu Skill en la Consola de Alexa

1. Ve a [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Si ya tienes una skill personal, selecciónala
3. Si no, crea una nueva skill:
   - Click en "Create Skill"
   - Elige un nombre (ej: "Mi Workspace Personal")
   - Selecciona "Custom" como tipo
   - Elige "Provision your own" como método de hospedaje

### 2. Configurar el Endpoint

1. En tu skill, ve a **"Endpoint"** en el menú lateral
2. Selecciona **"HTTPS"**
3. En **"Default Region"**, ingresa la URL de tu backend:
   ```
   https://tu-url.com/alexa
   ```
   O si estás usando ngrok localmente:
   ```
   https://xxxxxx.ngrok.io/alexa
   ```
3. Selecciona **"My development endpoint is a sub-domain of a domain that has a valid wildcard certificate from a certificate authority"**
4. Click en **"Save Endpoints"**

### 3. Configurar el Modelo de Interacción

1. Ve a **"Build"** > **"Interaction Model"**
2. Si el proyecto tiene archivos JSON de modelo de interacción, cópialos:
   - Busca archivos como `interaction-model-*.json` en el proyecto
   - Copia el contenido JSON
   - Pégalo en la consola de Alexa o impórtalo
3. Si no hay archivos JSON, configura manualmente los intents necesarios:
   - `LaunchRequest` (ya viene por defecto)
   - `AMAZON.HelpIntent` (ya viene por defecto)
   - `AMAZON.CancelIntent` (ya viene por defecto)
   - `AMAZON.StopIntent` (ya viene por defecto)
   - Intents personalizados para focos RGB (ver sección siguiente)

### 4. Intents Necesarios para Focos RGB

Agrega estos intents en el modelo de interacción:

#### ListarFocosIntent
- **Intent Name**: `ListarFocosIntent`
- **Ejemplos de utterances**:
  - "lista mis focos"
  - "qué focos tengo"
  - "muéstrame mis focos"

#### EncenderFocoIntent
- **Intent Name**: `EncenderFocoIntent`
- **Ejemplos de utterances**:
  - "enciende el foco"
  - "prende el foco"
  - "activa el foco"
  - "enciende {nombreFoco}"
  - "prende {nombreFoco}"

#### ApagarFocoIntent
- **Intent Name**: `ApagarFocoIntent`
- **Ejemplos de utterances**:
  - "apaga el foco"
  - "desactiva el foco"
  - "apaga {nombreFoco}"

#### CambiarColorFocoIntent
- **Intent Name**: `CambiarColorFocoIntent`
- **Slots**:
  - `color` (tipo: `AMAZON.Color` o `AMAZON.SearchQuery`)
- **Ejemplos de utterances**:
  - "cambia el color a {color}"
  - "pon el color {color}"
  - "cambia el color del foco a {color}"

#### CambiarBrilloFocoIntent
- **Intent Name**: `CambiarBrilloFocoIntent`
- **Slots**:
  - `brillo` (tipo: `AMAZON.NUMBER`)
- **Ejemplos de utterances**:
  - "pon el brillo al {brillo} por ciento"
  - "ajusta el brillo a {brillo}"
  - "cambia el brillo a {brillo}"

### 5. Guardar y Construir

1. Click en **"Save Model"**
2. Click en **"Build Model"**
3. Espera a que termine la construcción (puede tardar unos minutos)

### 6. Probar tu Skill

1. Ve a **"Test"** en el menú lateral
2. Habilita el modo de prueba
3. Prueba comandos como:
   - "abre [nombre de tu skill]"
   - "lista mis focos"
   - "enciende el foco"

---

## 🔒 Opcional: Validar Skill ID (Recomendado)

Si quieres que tu backend solo acepte requests de tu skill personal, puedes habilitar la validación del skill ID (ya está implementada en el código).

### Paso 1: Obtener tu Skill ID

1. En la consola de Alexa, ve a tu skill
2. En la parte superior, verás el **Skill ID** (formato: `amzn1.ask.skill.xxxxx-xxxxx-xxxxx`)
3. Cópialo

### Paso 2: Habilitar Validación

Agrega el Skill ID a tu archivo `.env`:

```env
ALEXA_SKILL_ID=amzn1.ask.skill.tu-skill-id-aqui
```

### Paso 3: Reiniciar el Servidor

Reinicia tu servidor para que cargue la nueva configuración:

```bash
npm start
```

Verás en la consola:
- `✅ Validación de Skill ID habilitada: amzn1.ask.skill.xxxxx` (si está configurado)
- `ℹ️  Validación de Skill ID deshabilitada` (si no está configurado)

**Nota**: Si no configuras `ALEXA_SKILL_ID`, el backend aceptará requests de cualquier skill (útil para proyectos compartidos).

---

## ⚠️ Importante

- **Mismo Backend, Diferentes Skills**: El mismo backend puede servir a múltiples skills sin problema
- **Base de Datos Compartida**: Si usas la misma base de datos, los focos registrados estarán disponibles para todas las skills
- **Endpoints Diferentes**: Cada skill debe tener su propio endpoint configurado en la consola de Alexa
- **Modelo de Interacción**: Cada skill necesita su propio modelo de interacción configurado

---

## 🐛 Solución de Problemas

### Error: "The request signature we calculated does not match"

- Verifica que la URL del endpoint sea correcta
- Asegúrate de que el endpoint termine en `/alexa`
- Verifica que tu servidor esté corriendo

### Error: "Skill not found" o "Invalid skill"

- Verifica que el Skill ID en `.env` sea correcto
- Asegúrate de que la skill esté en modo desarrollo o certificada

### La skill no responde

- Verifica que el servidor esté corriendo
- Revisa los logs del servidor para ver errores
- Verifica que el modelo de interacción esté construido correctamente

---

## 📝 Notas

- Si estás usando ngrok, recuerda actualizar la URL en la consola de Alexa cada vez que reinicies ngrok
- Para producción, considera usar un servicio como Render, Heroku, o AWS Lambda
- El nombre de invocación de tu skill puede ser diferente al del proyecto compartido

