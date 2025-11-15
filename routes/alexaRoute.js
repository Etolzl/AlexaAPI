const express = require('express');
const { ExpressAdapter } = require('ask-sdk-express-adapter');

const { createSkill } = require('../src/skillHandler');

const alexaApp = express();

// Middleware para parsear JSON (necesario para el adapter)
alexaApp.use(express.json());

// Logging de requests
alexaApp.use((req, res, next) => {
    console.log('📥 Request recibido:', {
        method: req.method,
        path: req.path,
        requestType: req.body?.request?.type || 'Unknown',
        timestamp: new Date().toISOString()
    });
    next();
});

const skill = createSkill();

const adapter = new ExpressAdapter(skill, false, false);

// Handler principal - el adapter maneja todo automáticamente
alexaApp.post('/', adapter.getRequestHandlers());

// Middleware de manejo de errores global (debe ir después de las rutas)
alexaApp.use((err, req, res, next) => {
    console.error('❌ Error no manejado:', err);
    console.error('Stack trace:', err.stack);
    
    // Responder con formato válido de Alexa solo si no se ha enviado respuesta
    if (!res.headersSent) {
        res.status(200).json({
            version: '1.0',
            response: {
                outputSpeech: {
                    type: 'PlainText',
                    text: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.'
                },
                shouldEndSession: true
            }
        });
    }
});

module.exports = alexaApp;

