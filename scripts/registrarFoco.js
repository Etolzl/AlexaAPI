/**
 * Script de ejemplo para registrar un foco RGB en la base de datos
 * 
 * Uso:
 * node scripts/registrarFoco.js "Foco Sala" "Foco Sala"
 * 
 * O edita los valores directamente en el script
 */

require('dotenv').config();
const mongoose = require('mongoose');
const FocoRGB = require('../models/FocoRGB');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

async function registrarFoco() {
  await connectDB();
  
  // Obtener argumentos de la línea de comandos o usar valores por defecto
  const nombre = process.argv[2] || 'Foco Sala';
  const nombreAlexa = process.argv[3] || nombre; // Por defecto usa el mismo nombre
  
  try {
    // Verificar si el foco ya existe
    const focoExistente = await FocoRGB.findOne({ nombre: nombre });
    
    if (focoExistente) {
      console.log(`El foco "${nombre}" ya existe.`);
      console.log('Datos actuales:', focoExistente);
      
      // Preguntar si quiere actualizar (en producción usarías un prompt interactivo)
      console.log('\nPara actualizar, elimina el foco primero o edita directamente en MongoDB.');
      process.exit(0);
    }
    
    // Crear nuevo foco
    const nuevoFoco = new FocoRGB({
      nombre: nombre,
      nombreAlexa: nombreAlexa,
      estado: false,
      brillo: 50,
      color: {
        rojo: 255,
        verde: 255,
        azul: 255
      },
      colorNombre: 'blanco'
    });
    
    await nuevoFoco.save();
    
    console.log('\n✅ Foco registrado exitosamente!');
    console.log('\n📋 Datos del foco:');
    console.log('   Nombre (en la skill):', nuevoFoco.nombre);
    console.log('   Nombre en Alexa:', nuevoFoco.nombreAlexa);
    console.log('   Estado:', nuevoFoco.estado ? 'Encendido' : 'Apagado');
    console.log('   Brillo:', nuevoFoco.brillo + '%');
    console.log('   Color:', nuevoFoco.colorNombre);
    console.log('\n⚠️  IMPORTANTE:');
    console.log('   - El campo "nombreAlexa" debe coincidir EXACTAMENTE con el nombre del dispositivo en la app de Alexa');
    console.log('   - Verifica mayúsculas, minúsculas, espacios y caracteres especiales');
    console.log('\n🎯 Próximos pasos:');
    console.log('   1. Verifica que el nombre en Alexa coincida exactamente');
    console.log('   2. Prueba con: "Alexa, abre work space y lista mis focos"');
    console.log('   3. Implementa el control real en alexaDeviceService.js');
    
    process.exit(0);
  } catch (error) {
    console.error('Error registrando foco:', error);
    process.exit(1);
  }
}

// Ejecutar
registrarFoco();

