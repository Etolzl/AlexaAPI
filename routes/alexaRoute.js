const express = require('express');
const { ExpressAdapter } = require('ask-sdk-express-adapter');

const { createSkill } = require('../src/skillHandler');

const alexaApp = express();

// IMPORTANTE: NO usar express.json() aquí - el ExpressAdapter maneja el parsing automáticamente
// Si usas express.json() antes del adapter, causará el error: "Do not register any parsers before using the adapter"

// Logging básico de requests (sin acceder a req.body ya que el adapter lo procesa)
alexaApp.use((req, res, next) => {
    console.log('📥 Request recibido:', {
        method: req.method,
        path: req.path,
        timestamp: new Date().toISOString()
    });
    next();
});

// Crear skill y adapter
let skill;
let adapter;

try {
    console.log('🔧 Creando skill...');
    skill = createSkill();
    console.log('✅ Skill creado exitosamente');
    
    adapter = new ExpressAdapter(skill, false, false);
    console.log('✅ Adapter creado exitosamente');
} catch (error) {
    console.error('❌ Error creando skill o adapter:', error);
    throw error;
}

// Handler principal - el adapter maneja todo automáticamente
// getRequestHandlers() devuelve un array de middlewares que Express puede usar directamente
const handlers = adapter.getRequestHandlers();
console.log('📋 Handlers obtenidos:', Array.isArray(handlers) ? `${handlers.length} handlers` : typeof handlers);

alexaApp.post('/', ...handlers);

// Middleware de manejo de errores global (debe ir después de las rutas)
alexaApp.use((err, req, res, next) => {
    console.error('❌ Error no manejado en middleware:', err);
    console.error('Stack trace:', err.stack);
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    
    // Responder con formato válido de Alexa solo si no se ha enviado respuesta
    if (!res.headersSent) {
        console.log('📤 Enviando respuesta de error...');
        try {
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
        } catch (sendError) {
            console.error('❌ Error enviando respuesta de error:', sendError);
        }
    } else {
        console.log('⚠️  Headers ya enviados, no se puede responder');
    }
});

// Capturar errores no manejados
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    console.error('Stack:', error.stack);
});

module.exports = alexaApp;

