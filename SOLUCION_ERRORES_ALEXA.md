# 🔧 Solución de Errores de Validación de Alexa

## Problema

Alexa estaba reportando errores de validación porque algunos utterances usaban múltiples slots donde al menos uno era de tipo `AMAZON.SearchQuery` (slot de frase). **Alexa no permite usar `AMAZON.SearchQuery` junto con otros slots en el mismo utterance**.

### Errores Reportados

```
Sample utterance "Cambia {focoName} a {color}" in intent "CambiarColorFocoIntent" 
cannot include both a phrase slot and another intent slot.

Sample utterance "Pon {focoName} en {color}" in intent "CambiarColorFocoIntent" 
cannot include both a phrase slot and another intent slot.

Sample utterance "Cambia el color de {focoName} a {color}" in intent "CambiarColorFocoIntent" 
cannot include both a phrase slot and another intent slot.

Sample utterance "Pon el color de {focoName} en {color}" in intent "CambiarColorFocoIntent" 
cannot include both a phrase slot and another intent slot.

Sample utterance "Pon el brillo de {focoName} al {brillo}" in intent "CambiarBrilloFocoIntent" 
cannot include both a phrase slot and another intent slot.
```

## Solución Aplicada

Se eliminaron los utterances problemáticos del archivo `interaction-model-foco-rgb.json`. Los utterances que quedan son válidos y funcionan correctamente.

### Cambios Realizados

#### CambiarColorFocoIntent

**Eliminados:**
- ❌ "Cambia {focoName} a {color}"
- ❌ "Pon {focoName} en {color}"
- ❌ "Cambia el color de {focoName} a {color}"
- ❌ "Pon el color de {focoName} en {color}"

**Mantenidos (válidos):**
- ✅ "Cambia el color a {color}"
- ✅ "Pon el color {color}"
- ✅ "Cambia a {color}"
- ✅ "Pon {color}"
- ✅ "Color {color}"
- ✅ "Cambia el color del foco a {color}"
- ✅ "Pon el color del foco en {color}"
- ✅ "Cambia la luz a {color}"
- ✅ "Pon la luz en {color}"

#### CambiarBrilloFocoIntent

**Eliminados:**
- ❌ "Pon el brillo de {focoName} al {brillo}"
- ❌ "Cambia el brillo de {focoName} a {brillo}"

**Mantenidos (válidos):**
- ✅ "Pon el brillo al {brillo}"
- ✅ "Cambia el brillo a {brillo}"
- ✅ "Brillo al {brillo}"
- ✅ "Pon el brillo a {brillo} por ciento"
- ✅ "Cambia el brillo a {brillo} por ciento"
- ✅ "Ajusta el brillo a {brillo}"
- ✅ "Pon el brillo del foco al {brillo}"
- ✅ "Cambia el brillo del foco a {brillo}"
- ✅ "Pon el brillo de la luz al {brillo}"
- ✅ "Cambia el brillo de la luz a {brillo}"
- ✅ "Pon el brillo al {brilloText}"
- ✅ "Cambia el brillo a {brilloText}"
- ✅ "Brillo al {brilloText} por ciento"

## Cómo Funciona Ahora

### Especificar el Nombre del Foco

Aunque los utterances que especifican el nombre del foco junto con el color/brillo fueron eliminados, **el código del backend ya maneja esto automáticamente**:

1. **Si no especificas el nombre del foco**: El sistema usa el foco por defecto (el único foco disponible o el único encendido).

2. **Si tienes múltiples focos**: El sistema te preguntará cuál quieres usar.

3. **Para especificar un foco específico**: Puedes usar los intents `EncenderFocoIntent` o `ApagarFocoIntent` con el nombre del foco primero, y luego cambiar el color/brillo.

### Ejemplos de Uso

#### Cambiar Color (sin especificar foco)
```
Usuario: "Alexa, abre work space y cambia el color a rojo"
→ Cambia el color del foco por defecto a rojo
```

#### Cambiar Brillo (sin especificar foco)
```
Usuario: "Alexa, abre work space y pon el brillo al 50 por ciento"
→ Ajusta el brillo del foco por defecto al 50%
```

#### Especificar Foco en Comandos Separados
```
Usuario: "Alexa, abre work space y enciende el foco sala"
→ Enciende el foco sala

Usuario: "cambia el color a azul"
→ Cambia el color del foco sala (que está encendido) a azul
```

## Importar el Modelo Corregido

1. Ve a la [Consola de Desarrolladores de Alexa](https://developer.amazon.com/alexa/console/ask)
2. Selecciona tu skill
3. Ve a **"Build"** > **"Interaction Model"**
4. Haz click en **"JSON Editor"** (o importa el archivo)
5. Copia el contenido de `interaction-model-foco-rgb.json`
6. Pega el contenido en el editor
7. Click en **"Save Model"**
8. Click en **"Build Model"**

## Verificación

Después de importar el modelo corregido, deberías ver:
- ✅ **0 errores de validación** en la consola de Alexa
- ✅ El modelo se construye exitosamente
- ✅ Los intents funcionan correctamente en las pruebas

## Notas Técnicas

### ¿Por qué no se puede usar AMAZON.SearchQuery con otros slots?

`AMAZON.SearchQuery` es un slot de tipo "frase" que captura texto libre. Alexa no permite combinarlo con otros slots en el mismo utterance porque:

1. **Ambigüedad**: Sería difícil determinar dónde termina un slot y comienza el otro
2. **Procesamiento**: Los slots de frase requieren procesamiento especial que no es compatible con múltiples slots
3. **Limitación de la plataforma**: Es una restricción de diseño de Alexa

### Alternativas Consideradas

1. **Separar en intents diferentes**: Crear intents separados para cuando se especifica el foco vs cuando no (complicado y redundante)

2. **Cambiar tipo de slot**: Cambiar `focoName` de `AMAZON.SearchQuery` a un tipo específico (limita la flexibilidad para nombres personalizados)

3. **Eliminar utterances problemáticos** (✅ Solución elegida): La más simple y el código ya maneja el caso de foco no especificado

## Referencias

- [Alexa Skills Kit Documentation - Slot Types](https://developer.amazon.com/en-US/docs/alexa/custom-skills/slot-type-reference.html)
- [Interaction Model Schema](https://developer.amazon.com/en-US/docs/alexa/ask-overviews/ask-sdk-interaction-model.html)

