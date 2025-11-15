const LaunchRequest = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
      try {
        console.log('🚀 LaunchRequest recibido');
        const speechText = 'Hola, bienvenido a workspace, tu asistente de control de entornos y focos RGB. Puedes decir: lista mis focos, enciende el foco, o cambia el color a rojo. ¿En qué te puedo ayudar?';
  
        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt('¿Qué te gustaría hacer? Puedes controlar tus focos o entornos.')
          .withShouldEndSession(false)
          .getResponse();
      } catch (error) {
        console.error('❌ Error en LaunchRequest:', error);
        return handlerInput.responseBuilder
          .speak('Lo siento, hubo un error al iniciar la skill. Por favor, intenta de nuevo.')
          .withShouldEndSession(true)
          .getResponse();
      }
    },
  };
  
  module.exports = { LaunchRequest }