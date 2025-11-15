# 🚀 Instrucciones Rápidas para Registrar un Foco

## Método Más Rápido (Recomendado)

### 1. Encuentra el nombre exacto del foco en Alexa

Abre la app de Alexa → Dispositivos → Busca tu foco RGB → **Copia el nombre exacto**

### 2. Ejecuta el script

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
npm run registrar-foco "Foco Sala" "Nombre Exacto en Alexa"
```

**Ejemplo:**
```bash
# Si tu foco se llama "Luz RGB Sala" en Alexa:
npm run registrar-foco "Foco Sala" "Luz RGB Sala"

# Si tu foco se llama "Smart Light" en Alexa:
npm run registrar-foco "Foco Principal" "Smart Light"
```

### 3. ¡Listo! 

El foco quedó registrado. Prueba diciendo:
- "Alexa, abre work space y lista mis focos"
- "Alexa, abre work space y enciende el foco"

---

## Alternativa: Sin npm

```bash
node scripts/registrarFoco.js "Foco Sala" "Nombre Exacto en Alexa"
```

---

## ⚠️ Importante

- El **segundo parámetro** debe ser el **nombre exacto** como aparece en la app de Alexa
- Respeta mayúsculas, minúsculas, espacios y caracteres especiales
- Si no estás seguro del nombre, usa la app de Alexa para verificar

---

## 📖 Más información

Para más detalles, consulta `GUIA_REGISTRO_FOCO.md`

