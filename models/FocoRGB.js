const mongoose = require('mongoose');

const FocoRGBSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true }, // Nombre del foco en Alexa
  nombreAlexa: { type: String, required: true }, // Nombre exacto como está en la app de Alexa
  estado: { type: Boolean, default: false }, // true = encendido, false = apagado
  brillo: { type: Number, min: 0, max: 100, default: 50 }, // Brillo del 0 al 100
  color: { 
    rojo: { type: Number, min: 0, max: 255, default: 255 },
    verde: { type: Number, min: 0, max: 255, default: 255 },
    azul: { type: Number, min: 0, max: 255, default: 255 }
  },
  colorNombre: { type: String, default: 'blanco' }, // Nombre del color (rojo, azul, verde, etc.)
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Usuario propietario (opcional)
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now }
});

// Middleware para actualizar fechaActualizacion antes de guardar
FocoRGBSchema.pre('save', function(next) {
  this.fechaActualizacion = Date.now();
  next();
});

module.exports = mongoose.model('FocoRGB', FocoRGBSchema);

