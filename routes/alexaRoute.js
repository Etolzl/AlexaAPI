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
    console.log('📦 Body recibido:', JSON.stringify(req.body).substring(0, 200) + '...');
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

// Middleware para logging y luego los handlers del adapter
alexaApp.post('/', (req, res, next) => {
    console.log('🔄 Iniciando procesamiento del request...');
    // Agregar listener para cuando se envíe la respuesta
    const originalEnd = res.end;
    res.end = function(...args) {
        console.log('📤 Respuesta enviada, status:', res.statusCode);
        console.log('📤 Headers enviados:', res.headersSent);
        return originalEnd.apply(this, args);
    };
    next();
}, ...handlers);

// Middleware de manejo de errores global (debe ir después de las rutas)
alexaApp.use((err, req, res, next) => {
    console.error('❌ Error no manejado en middleware:', err);
    console.error('Stack trace:', err.stack);
    
    // Responder con formato válido de Alexa solo si no se ha enviado respuesta
    if (!res.headersSent) {
        console.log('📤 Enviando respuesta de error...');
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
    } else {
        console.log('⚠️  Headers ya enviados, no se puede responder');
    }
});

module.exports = alexaApp;

