const Alexa = require('ask-sdk-core');

const SessionEndedRequest = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const HelpIntent = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Te ayudo a controlar tus entornos y focos RGB. Para entornos, puedes decir: "activa" seguido del nombre del entorno, "apaga" para desactivarlo, o "lista mis entornos". Para focos, puedes decir: "enciende el foco", "apaga el foco", "cambia el color a rojo", o "pon el brillo al 50 por ciento". También puedes decir "lista mis focos" para ver los disponibles. Di "salir" cuando termines.')
            .reprompt('¿Qué te gustaría hacer? Puedes controlar entornos o focos RGB.')
            .withShouldEndSession(false)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = '¡Chao! ¡Gracias por usar nuestra skill!.';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Hello World', speechText)
            .withShouldEndSession(true)
            .getResponse();
    }
};

const UnhandledIntent = {
    canHandle() {
        return true;
    },
    handle(handlerInput) {
        const speechText = 'Lo siento, no entiendo lo que quieres decir, intenta preguntarme de otra forma';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    },
};


module.exports = {
    SessionEndedRequest,
    HelpIntent,
    CancelAndStopIntentHandler,
    UnhandledIntent
}