/**
 * Rutas opcionales para gestionar focos RGB desde tu aplicación móvil
 * 
 * Para usar estas rutas, agrégalas en index.js:
 * app.use('/api/focos', require('./routes/focoRoute'));
 */

const express = require('express');
const router = express.Router();
const FocoRGB = require('../models/FocoRGB');

// Middleware para parsear JSON
router.use(express.json());

/**
 * GET /api/focos
 * Obtener todos los focos
 */
router.get('/', async (req, res) => {
  try {
    const focos = await FocoRGB.find({});
    res.json({
      success: true,
      data: focos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo focos',
      error: error.message
    });
  }
});

/**
 * GET /api/focos/:id
 * Obtener un foco por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const foco = await FocoRGB.findById(req.params.id);
    
    if (!foco) {
      return res.status(404).json({
        success: false,
        message: 'Foco no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: foco
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo foco',
      error: error.message
    });
  }
});

/**
 * POST /api/focos
 * Crear un nuevo foco
 */
router.post('/', async (req, res) => {
  try {
    const { nombre, nombreAlexa, usuario } = req.body;
    
    if (!nombre || !nombreAlexa) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren los campos: nombre y nombreAlexa'
      });
    }
    
    // Verificar si ya existe
    const focoExistente = await FocoRGB.findOne({ nombre: nombre });
    if (focoExistente) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un foco con ese nombre'
      });
    }
    
    const nuevoFoco = new FocoRGB({
      nombre,
      nombreAlexa,
      estado: false,
      brillo: 50,
      color: {
        rojo: 255,
        verde: 255,
        azul: 255
      },
      colorNombre: 'blanco',
      usuario: usuario || null
    });
    
    await nuevoFoco.save();
    
    res.status(201).json({
      success: true,
      message: 'Foco creado exitosamente',
      data: nuevoFoco
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creando foco',
      error: error.message
    });
  }
});

/**
 * PUT /api/focos/:id
 * Actualizar un foco
 */
router.put('/:id', async (req, res) => {
  try {
    const { nombre, nombreAlexa, estado, brillo, color, colorNombre } = req.body;
    
    const foco = await FocoRGB.findById(req.params.id);
    
    if (!foco) {
      return res.status(404).json({
        success: false,
        message: 'Foco no encontrado'
      });
    }
    
    // Actualizar campos proporcionados
    if (nombre !== undefined) foco.nombre = nombre;
    if (nombreAlexa !== undefined) foco.nombreAlexa = nombreAlexa;
    if (estado !== undefined) foco.estado = estado;
    if (brillo !== undefined) foco.brillo = brillo;
    if (color !== undefined) foco.color = color;
    if (colorNombre !== undefined) foco.colorNombre = colorNombre;
    
    await foco.save();
    
    res.json({
      success: true,
      message: 'Foco actualizado exitosamente',
      data: foco
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error actualizando foco',
      error: error.message
    });
  }
});

/**
 * DELETE /api/focos/:id
 * Eliminar un foco
 */
router.delete('/:id', async (req, res) => {
  try {
    const foco = await FocoRGB.findByIdAndDelete(req.params.id);
    
    if (!foco) {
      return res.status(404).json({
        success: false,
        message: 'Foco no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Foco eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error eliminando foco',
      error: error.message
    });
  }
});

/**
 * GET /api/focos/usuario/:userId
 * Obtener focos de un usuario específico
 */
router.get('/usuario/:userId', async (req, res) => {
  try {
    const focos = await FocoRGB.find({ usuario: req.params.userId });
    res.json({
      success: true,
      data: focos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo focos del usuario',
      error: error.message
    });
  }
});

module.exports = router;

