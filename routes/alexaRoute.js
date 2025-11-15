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

// Middleware para logging y captura de errores antes de los handlers
alexaApp.post('/', (req, res, next) => {
    console.log('🔄 Iniciando procesamiento del request...');
    
    // Capturar errores en el response
    res.on('error', (err) => {
        console.error('❌ Error en response object:', err);
        console.error('Stack:', err.stack);
    });
    
    // Agregar listener para cuando se envíe la respuesta
    const originalEnd = res.end;
    const originalJson = res.json;
    const originalSend = res.send;
    
    res.end = function(...args) {
        console.log('📤 res.end() llamado, status:', res.statusCode);
        console.log('📤 Headers enviados:', res.headersSent);
        if (res.statusCode >= 400) {
            console.error('❌ Error HTTP:', res.statusCode);
            // Intentar leer el body si hay error
            if (args[0]) {
                console.error('📤 Body de error:', String(args[0]).substring(0, 500));
            }
        }
        return originalEnd.apply(this, args);
    };
    
    res.json = function(...args) {
        console.log('📤 res.json() llamado, status:', res.statusCode);
        if (res.statusCode >= 400) {
            console.error('❌ Error en res.json(), body:', JSON.stringify(args[0]).substring(0, 500));
        }
        return originalJson.apply(this, args);
    };
    
    res.send = function(...args) {
        console.log('📤 res.send() llamado, status:', res.statusCode);
        if (res.statusCode >= 400) {
            console.error('❌ Error en res.send()');
        }
        return originalSend.apply(this, args);
    };
    
    // Wrapper para capturar errores en next()
    const wrappedNext = (err) => {
        if (err) {
            console.error('❌ Error pasado a next():', err);
            console.error('Stack:', err.stack);
        }
        return next(err);
    };
    
    // Ejecutar handlers con manejo de errores
    let handlerIndex = 0;
    const executeHandlers = () => {
        if (handlerIndex < handlers.length) {
            const handler = handlers[handlerIndex];
            handlerIndex++;
            try {
                handler(req, res, (err) => {
                    if (err) {
                        console.error(`❌ Error en handler ${handlerIndex}:`, err);
                        return wrappedNext(err);
                    }
                    executeHandlers();
                });
            } catch (error) {
                console.error(`❌ Excepción en handler ${handlerIndex}:`, error);
                console.error('Stack:', error.stack);
                wrappedNext(error);
            }
        }
    };
    
    executeHandlers();
});

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

