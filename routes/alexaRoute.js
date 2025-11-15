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

// Wrapper para capturar errores en los handlers
const wrappedHandlers = handlers.map((handler, index) => {
    return async (req, res, next) => {
        try {
            console.log(`🔄 Ejecutando handler ${index + 1}/${handlers.length}`);
            await handler(req, res, (err) => {
                if (err) {
                    console.error(`❌ Error en handler ${index + 1}:`, err);
                    console.error('Stack:', err.stack);
                    return next(err);
                }
                console.log(`✅ Handler ${index + 1} completado sin errores`);
                next();
            });
        } catch (error) {
            console.error(`❌ Excepción no capturada en handler ${index + 1}:`, error);
            console.error('Stack:', error.stack);
            next(error);
        }
    };
});

// Middleware para logging y luego los handlers envueltos
alexaApp.post('/', (req, res, next) => {
    console.log('🔄 Iniciando procesamiento del request...');
    
    // Agregar listener para cuando se envíe la respuesta
    const originalEnd = res.end;
    res.end = function(...args) {
        console.log('📤 Respuesta enviada, status:', res.statusCode);
        console.log('📤 Headers enviados:', res.headersSent);
        if (res.statusCode >= 400) {
            console.error('❌ Error HTTP:', res.statusCode);
        }
        return originalEnd.apply(this, args);
    };
    
    next();
}, ...wrappedHandlers);

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

