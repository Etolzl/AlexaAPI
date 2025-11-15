const FocoRGB = require('../../models/FocoRGB');
const { 
  encenderFoco, 
  apagarFoco, 
  cambiarColorFoco, 
  cambiarBrilloFoco,
  configurarFoco,
  normalizeColorName,
  COLOR_MAP
} = require('../services/alexaDeviceService');

/**
 * Intent para encender el foco RGB
 */
const EncenderFocoIntent = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'EncenderFocoIntent';
  },
  async handle(handlerInput) {
    const { requestEnvelope } = handlerInput;
    const intent = requestEnvelope.request.intent;
    
    console.log('EncenderFocoIntent completo:', JSON.stringify(intent, null, 2));
    
    // Intentar obtener el nombre del foco
    let focoName = null;
    const focoNameSlot = intent.slots?.focoName;
    
    if (focoNameSlot && focoNameSlot.value) {
      focoName = focoNameSlot.value;
    } else if (focoNameSlot && focoNameSlot.resolutions?.resolutionsPerAuthority?.[0]?.values?.[0]) {
      focoName = focoNameSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    }
    
    // Si no hay nombre, buscar el foco por defecto o listar focos disponibles
    if (!focoName) {
      try {
        const focos = await FocoRGB.find({});
        if (focos.length === 1) {
          focoName = focos[0].nombreAlexa;
        } else if (focos.length > 1) {
          const nombres = focos.map(f => f.nombre).join(', ');
          return handlerInput.responseBuilder
            .speak(`Tienes varios focos disponibles: ${nombres}. ¿Cuál quieres encender?`)
            .reprompt('¿Qué foco quieres encender?')
            .withShouldEndSession(false)
            .getResponse();
        } else {
          return handlerInput.responseBuilder
            .speak('No tienes focos configurados. Configura un foco desde tu aplicación primero.')
            .reprompt('¿Hay algo más que pueda ayudarte?')
            .withShouldEndSession(false)
            .getResponse();
        }
      } catch (error) {
        console.error('Error buscando focos:', error);
      }
    }
    
    if (!focoName) {
      return handlerInput.responseBuilder
        .speak('No pude identificar qué foco quieres encender. ¿Podrías repetirlo?')
        .reprompt('¿Qué foco quieres encender?')
        .withShouldEndSession(false)
        .getResponse();
    }
    
    try {
      // Buscar el foco en la base de datos
      const foco = await FocoRGB.findOne({ 
        $or: [
          { nombre: { $regex: focoName, $options: 'i' } },
          { nombreAlexa: { $regex: focoName, $options: 'i' } }
        ]
      });
      
      if (!foco) {
        return handlerInput.responseBuilder
          .speak(`No encontré un foco llamado ${focoName}. ¿Podrías verificar el nombre?`)
          .reprompt('¿Qué foco quieres encender?')
          .withShouldEndSession(false)
          .getResponse();
      }
      
      // Controlar el dispositivo Alexa
      await encenderFoco(foco.nombreAlexa);
      
      // Actualizar estado en la base de datos
      foco.estado = true;
      await foco.save();
      
      return handlerInput.responseBuilder
        .speak(`Perfecto, he registrado que el foco ${foco.nombre} está encendido. Para controlarlo físicamente, di: "Alexa, enciende ${foco.nombreAlexa}". ¿Quieres cambiar el color o el brillo?`)
        .reprompt('¿Qué te gustaría hacer con el foco?')
        .withShouldEndSession(false)
        .getResponse();
        
    } catch (error) {
      console.error('Error encendiendo foco:', error);
      return handlerInput.responseBuilder
        .speak('Lo siento, tuve un problema al encender el foco. Inténtalo de nuevo.')
        .reprompt('¿Qué te gustaría hacer con el foco?')
        .withShouldEndSession(false)
        .getResponse();
    }
  }
};

/**
 * Intent para apagar el foco RGB
 */
const ApagarFocoIntent = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ApagarFocoIntent';
  },
  async handle(handlerInput) {
    const { requestEnvelope } = handlerInput;
    const intent = requestEnvelope.request.intent;
    
    console.log('ApagarFocoIntent completo:', JSON.stringify(intent, null, 2));
    
    let focoName = null;
    const focoNameSlot = intent.slots?.focoName;
    
    if (focoNameSlot && focoNameSlot.value) {
      focoName = focoNameSlot.value;
    } else if (focoNameSlot && focoNameSlot.resolutions?.resolutionsPerAuthority?.[0]?.values?.[0]) {
      focoName = focoNameSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    }
    
    if (!focoName) {
      try {
        const focos = await FocoRGB.find({ estado: true });
        if (focos.length === 1) {
          focoName = focos[0].nombreAlexa;
        } else if (focos.length > 1) {
          const nombres = focos.map(f => f.nombre).join(', ');
          return handlerInput.responseBuilder
            .speak(`Tienes varios focos encendidos: ${nombres}. ¿Cuál quieres apagar?`)
            .reprompt('¿Qué foco quieres apagar?')
            .withShouldEndSession(false)
            .getResponse();
        } else {
          return handlerInput.responseBuilder
            .speak('No hay focos encendidos en este momento.')
            .reprompt('¿Hay algo más que pueda ayudarte?')
            .withShouldEndSession(false)
            .getResponse();
        }
      } catch (error) {
        console.error('Error buscando focos:', error);
      }
    }
    
    if (!focoName) {
      return handlerInput.responseBuilder
        .speak('No pude identificar qué foco quieres apagar. ¿Podrías repetirlo?')
        .reprompt('¿Qué foco quieres apagar?')
        .withShouldEndSession(false)
        .getResponse();
    }
    
    try {
      const foco = await FocoRGB.findOne({ 
        $or: [
          { nombre: { $regex: focoName, $options: 'i' } },
          { nombreAlexa: { $regex: focoName, $options: 'i' } }
        ]
      });
      
      if (!foco) {
        return handlerInput.responseBuilder
          .speak(`No encontré un foco llamado ${focoName}. ¿Podrías verificar el nombre?`)
          .reprompt('¿Qué foco quieres apagar?')
          .withShouldEndSession(false)
          .getResponse();
      }
      
      await apagarFoco(foco.nombreAlexa);
      
      foco.estado = false;
      await foco.save();
      
      return handlerInput.responseBuilder
        .speak(`Listo, he registrado que el foco ${foco.nombre} está apagado. Para controlarlo físicamente, di: "Alexa, apaga ${foco.nombreAlexa}". ¿Hay algo más que pueda ayudarte?`)
        .reprompt('¿Hay algo más que pueda ayudarte?')
        .withShouldEndSession(false)
        .getResponse();
        
    } catch (error) {
      console.error('Error apagando foco:', error);
      return handlerInput.responseBuilder
        .speak('Lo siento, tuve un problema al apagar el foco. Inténtalo de nuevo.')
        .reprompt('¿Qué te gustaría hacer?')
        .withShouldEndSession(false)
        .getResponse();
    }
  }
};

/**
 * Intent para cambiar el color del foco RGB
 */
const CambiarColorFocoIntent = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'CambiarColorFocoIntent';
  },
  async handle(handlerInput) {
    const { requestEnvelope } = handlerInput;
    const intent = requestEnvelope.request.intent;
    
    console.log('CambiarColorFocoIntent completo:', JSON.stringify(intent, null, 2));
    
    let focoName = null;
    let colorName = null;
    
    // Obtener nombre del foco
    const focoNameSlot = intent.slots?.focoName;
    if (focoNameSlot && focoNameSlot.value) {
      focoName = focoNameSlot.value;
    }
    
    // Obtener color
    const colorSlot = intent.slots?.color;
    if (colorSlot && colorSlot.value) {
      colorName = colorSlot.value;
    } else if (colorSlot && colorSlot.resolutions?.resolutionsPerAuthority?.[0]?.values?.[0]) {
      colorName = colorSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    }
    
    if (!colorName) {
      const coloresDisponibles = Object.keys(COLOR_MAP).join(', ');
      return handlerInput.responseBuilder
        .speak(`No pude entender el color. Los colores disponibles son: ${coloresDisponibles}. ¿Qué color quieres?`)
        .reprompt('¿Qué color quieres para el foco?')
        .withShouldEndSession(false)
        .getResponse();
    }
    
    // Normalizar el color
    const colorInfo = normalizeColorName(colorName);
    if (!colorInfo) {
      const coloresDisponibles = Object.keys(COLOR_MAP).join(', ');
      return handlerInput.responseBuilder
        .speak(`No reconozco el color ${colorName}. Los colores disponibles son: ${coloresDisponibles}.`)
        .reprompt('¿Qué color quieres para el foco?')
        .withShouldEndSession(false)
        .getResponse();
    }
    
    // Si no hay nombre de foco, buscar el foco encendido o el único disponible
    if (!focoName) {
      try {
        const focos = await FocoRGB.find({ estado: true });
        if (focos.length === 1) {
          focoName = focos[0].nombreAlexa;
        } else if (focos.length > 1) {
          const nombres = focos.map(f => f.nombre).join(', ');
          return handlerInput.responseBuilder
            .speak(`Tienes varios focos encendidos: ${nombres}. ¿En cuál quieres cambiar el color?`)
            .reprompt('¿Qué foco quieres cambiar?')
            .withShouldEndSession(false)
            .getResponse();
        } else {
          // Buscar cualquier foco
          const todosFocos = await FocoRGB.find({});
          if (todosFocos.length === 1) {
            focoName = todosFocos[0].nombreAlexa;
          }
        }
      } catch (error) {
        console.error('Error buscando focos:', error);
      }
    }
    
    if (!focoName) {
      return handlerInput.responseBuilder
        .speak('No pude identificar qué foco quieres cambiar. ¿Podrías repetirlo?')
        .reprompt('¿Qué foco quieres cambiar?')
        .withShouldEndSession(false)
        .getResponse();
    }
    
    try {
      const foco = await FocoRGB.findOne({ 
        $or: [
          { nombre: { $regex: focoName, $options: 'i' } },
          { nombreAlexa: { $regex: focoName, $options: 'i' } }
        ]
      });
      
      if (!foco) {
        return handlerInput.responseBuilder
          .speak(`No encontré un foco llamado ${focoName}. ¿Podrías verificar el nombre?`)
          .reprompt('¿Qué foco quieres cambiar?')
          .withShouldEndSession(false)
          .getResponse();
      }
      
      await cambiarColorFoco(foco.nombreAlexa, colorInfo.nombre);
      
      // Actualizar en la base de datos
      foco.color.rojo = colorInfo.rgb.r;
      foco.color.verde = colorInfo.rgb.g;
      foco.color.azul = colorInfo.rgb.b;
      foco.colorNombre = colorInfo.nombre;
      await foco.save();
      
      return handlerInput.responseBuilder
        .speak(`Perfecto, he cambiado el color del foco ${foco.nombre} a ${colorInfo.nombre}.`)
        .reprompt('¿Quieres ajustar el brillo o cambiar a otro color?')
        .withShouldEndSession(false)
        .getResponse();
        
    } catch (error) {
      console.error('Error cambiando color:', error);
      return handlerInput.responseBuilder
        .speak('Lo siento, tuve un problema al cambiar el color. Inténtalo de nuevo.')
        .reprompt('¿Qué te gustaría hacer?')
        .withShouldEndSession(false)
        .getResponse();
    }
  }
};

/**
 * Intent para cambiar el brillo del foco RGB
 */
const CambiarBrilloFocoIntent = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'CambiarBrilloFocoIntent';
  },
  async handle(handlerInput) {
    const { requestEnvelope } = handlerInput;
    const intent = requestEnvelope.request.intent;
    
    console.log('CambiarBrilloFocoIntent completo:', JSON.stringify(intent, null, 2));
    
    let focoName = null;
    let brillo = null;
    
    // Obtener nombre del foco
    const focoNameSlot = intent.slots?.focoName;
    if (focoNameSlot && focoNameSlot.value) {
      focoName = focoNameSlot.value;
    }
    
    // Obtener brillo
    const brilloSlot = intent.slots?.brillo;
    if (brilloSlot && brilloSlot.value) {
      brillo = parseInt(brilloSlot.value);
    }
    
    // También intentar extraer número del texto
    if (!brillo || isNaN(brillo)) {
      const brilloTextSlot = intent.slots?.brilloText;
      if (brilloTextSlot && brilloTextSlot.value) {
        const match = brilloTextSlot.value.match(/\d+/);
        if (match) {
          brillo = parseInt(match[0]);
        }
      }
    }
    
    if (!brillo || isNaN(brillo)) {
      return handlerInput.responseBuilder
        .speak('No pude entender el nivel de brillo. Por favor, di un número del 0 al 100.')
        .reprompt('¿Qué nivel de brillo quieres? Di un número del 0 al 100.')
        .withShouldEndSession(false)
        .getResponse();
    }
    
    // Validar rango
    brillo = Math.max(0, Math.min(100, brillo));
    
    // Si no hay nombre de foco, buscar el foco encendido
    if (!focoName) {
      try {
        const focos = await FocoRGB.find({ estado: true });
        if (focos.length === 1) {
          focoName = focos[0].nombreAlexa;
        } else if (focos.length > 1) {
          const nombres = focos.map(f => f.nombre).join(', ');
          return handlerInput.responseBuilder
            .speak(`Tienes varios focos encendidos: ${nombres}. ¿En cuál quieres cambiar el brillo?`)
            .reprompt('¿Qué foco quieres cambiar?')
            .withShouldEndSession(false)
            .getResponse();
        } else {
          const todosFocos = await FocoRGB.find({});
          if (todosFocos.length === 1) {
            focoName = todosFocos[0].nombreAlexa;
          }
        }
      } catch (error) {
        console.error('Error buscando focos:', error);
      }
    }
    
    if (!focoName) {
      return handlerInput.responseBuilder
        .speak('No pude identificar qué foco quieres cambiar. ¿Podrías repetirlo?')
        .reprompt('¿Qué foco quieres cambiar?')
        .withShouldEndSession(false)
        .getResponse();
    }
    
    try {
      const foco = await FocoRGB.findOne({ 
        $or: [
          { nombre: { $regex: focoName, $options: 'i' } },
          { nombreAlexa: { $regex: focoName, $options: 'i' } }
        ]
      });
      
      if (!foco) {
        return handlerInput.responseBuilder
          .speak(`No encontré un foco llamado ${focoName}. ¿Podrías verificar el nombre?`)
          .reprompt('¿Qué foco quieres cambiar?')
          .withShouldEndSession(false)
          .getResponse();
      }
      
      await cambiarBrilloFoco(foco.nombreAlexa, brillo);
      
      foco.brillo = brillo;
      await foco.save();
      
      return handlerInput.responseBuilder
        .speak(`Perfecto, he ajustado el brillo del foco ${foco.nombre} a ${brillo} por ciento.`)
        .reprompt('¿Quieres cambiar el color o ajustar más el brillo?')
        .withShouldEndSession(false)
        .getResponse();
        
    } catch (error) {
      console.error('Error cambiando brillo:', error);
      return handlerInput.responseBuilder
        .speak('Lo siento, tuve un problema al cambiar el brillo. Inténtalo de nuevo.')
        .reprompt('¿Qué te gustaría hacer?')
        .withShouldEndSession(false)
        .getResponse();
    }
  }
};

/**
 * Intent para listar focos disponibles
 */
const ListarFocosIntent = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ListarFocosIntent';
  },
  async handle(handlerInput) {
    try {
      const focos = await FocoRGB.find({});
      
      if (!focos || focos.length === 0) {
        return handlerInput.responseBuilder
          .speak('No tienes focos configurados aún. Configura un foco desde tu aplicación primero.')
          .reprompt('¿Hay algo más que pueda ayudarte?')
          .withShouldEndSession(false)
          .getResponse();
      }
      
      const estados = focos.map(f => {
        const estado = f.estado ? 'encendido' : 'apagado';
        return `${f.nombre}, ${estado}`;
      });
      
      let speechText;
      if (estados.length === 1) {
        speechText = `Tienes un foco: ${estados[0]}.`;
      } else {
        const ultimo = estados.pop();
        speechText = `Tus focos son: ${estados.join(', ')} y ${ultimo}.`;
      }
      
      speechText += ' Puedes decir "enciende" seguido del nombre del foco, o "cambia el color" para modificarlo.';
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt('¿Qué foco quieres controlar?')
        .withShouldEndSession(false)
        .getResponse();
        
    } catch (error) {
      console.error('Error listando focos:', error);
      return handlerInput.responseBuilder
        .speak('Lo siento, tuve un problema al obtener la lista de focos. Inténtalo de nuevo.')
        .reprompt('¿Qué te gustaría hacer?')
        .withShouldEndSession(false)
        .getResponse();
    }
  }
};

module.exports = {
  EncenderFocoIntent,
  ApagarFocoIntent,
  CambiarColorFocoIntent,
  CambiarBrilloFocoIntent,
  ListarFocosIntent
};

