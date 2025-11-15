const Alexa = require('ask-sdk-core');

const { SessionEndedRequest, HelpIntent, CancelAndStopIntentHandler, UnhandledIntent } = require('./intents/AmazonIntents');
const { HelloWorldIntentHandler } = require('./intents/HelloWorldIntent');
const { LaunchRequest } = require('./intents/LaunchIntent');
const { ActivateEnvironmentIntent, DeactivateEnvironmentIntent, ListEnvironmentsIntent, ActivateEnvironmentSimpleIntent, DeactivateEnvironmentSimpleIntent, ActivateEnvironmentFreeTextIntent, DeactivateEnvironmentFreeTextIntent, ExitSkillIntent } = require('./intents/EnvironmentIntents');
const { EncenderFocoIntent, ApagarFocoIntent, CambiarColorFocoIntent, CambiarBrilloFocoIntent, ListarFocosIntent } = require('./intents/FocoRGBIntents');

const createSkill = () => {
    const skillbuilder = Alexa.SkillBuilders.custom();
    
    // Si ALEXA_SKILL_ID está configurado, validar el skill ID
    if (process.env.ALEXA_SKILL_ID) {
        skillbuilder.withSkillId(process.env.ALEXA_SKILL_ID);
        console.log(`✅ Validación de Skill ID habilitada: ${process.env.ALEXA_SKILL_ID}`);
    } else {
        console.log('ℹ️  Validación de Skill ID deshabilitada (ALEXA_SKILL_ID no configurado)');
    }
    
    return skillbuilder.addRequestHandlers(
        LaunchRequest,
        HelloWorldIntentHandler,
        ActivateEnvironmentIntent,
        DeactivateEnvironmentIntent,
        ActivateEnvironmentSimpleIntent,
        DeactivateEnvironmentSimpleIntent,
        ActivateEnvironmentFreeTextIntent,
        DeactivateEnvironmentFreeTextIntent,
        ListEnvironmentsIntent,
        EncenderFocoIntent,
        ApagarFocoIntent,
        CambiarColorFocoIntent,
        CambiarBrilloFocoIntent,
        ListarFocosIntent,
        ExitSkillIntent,
        SessionEndedRequest,
        HelpIntent,
        UnhandledIntent
    )
        .withApiClient(new Alexa.DefaultApiClient())
        .withCustomUserAgent('workspace/v1')
        .create()
}

module.exports = { createSkill }