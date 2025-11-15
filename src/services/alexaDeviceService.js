/**
 * Servicio para controlar dispositivos de Alexa
 * 
 * NOTA: Para controlar dispositivos Smart Home desde una Custom Skill,
 * necesitarías usar la Smart Home Skill API de Alexa, que requiere
 * certificación adicional. Esta es una implementación base que puedes
 * extender según tus necesidades.
 */

/**
 * Obtiene los dispositivos vinculados en la cuenta de Alexa
 * @param {string} apiAccessToken - Token de acceso de Alexa (viene en context.System.apiAccessToken)
 * @param {string} apiEndpoint - Endpoint de la API de Alexa (viene en context.System.apiEndpoint)
 * @returns {Promise<Array>} Lista de dispositivos
 */
async function obtenerDispositivosAlexa(apiAccessToken, apiEndpoint = 'https://api.amazonalexa.com') {
  try {
    console.log('🔍 Obteniendo dispositivos de Alexa...');
    
    const response = await fetch(`${apiEndpoint}/v2/devices`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiAccessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error obteniendo dispositivos:', response.status, errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Dispositivos obtenidos: ${data.devices?.length || 0} dispositivos`);
    
    return data.devices || [];
  } catch (error) {
    console.error('❌ Error en obtenerDispositivosAlexa:', error);
    throw error;
  }
}

/**
 * Filtra dispositivos que son focos/luces con capacidad de color
 * @param {Array} dispositivos - Lista de dispositivos de Alexa
 * @returns {Array} Lista de focos filtrados
 */
function filtrarFocos(dispositivos) {
  if (!dispositivos || !Array.isArray(dispositivos)) {
    return [];
  }
  
  return dispositivos.filter(dispositivo => {
    console.log('🔍 Analizando dispositivo:', dispositivo.displayName || dispositivo.friendlyName, {
      displayCategories: dispositivo.displayCategories,
      capabilities: dispositivo.capabilities?.map(c => c.interface || c.type)
    });
    
    // Verificar categoría de display (más confiable)
    const esLuz = dispositivo.displayCategories?.some(cat => 
      cat === 'LIGHT' || cat === 'SMARTPLUG' || cat === 'SWITCH'
    );
    
    // Verificar capacidades
    const tieneCapacidades = dispositivo.capabilities?.some(cap => {
      const interfaceName = cap.interface || cap.type;
      return interfaceName === 'Alexa.PowerController' || 
             interfaceName === 'Alexa.ColorController' ||
             interfaceName === 'Alexa.BrightnessController';
    });
    
    // Verificar si tiene capacidad de color
    const tieneColor = dispositivo.capabilities?.some(cap => {
      const interfaceName = cap.interface || cap.type;
      return interfaceName === 'Alexa.ColorController';
    });
    
    // Si es una luz, la incluimos (especialmente si tiene brillo, que indica RGB)
    // O si tiene capacidad de color explícita
    const tieneBrillo = dispositivo.capabilities?.some(cap => {
      const interfaceName = cap.interface || cap.type;
      return interfaceName === 'Alexa.BrightnessController';
    });
    
    // Incluir si:
    // 1. Es una luz Y tiene brillo (probablemente RGB)
    // 2. O tiene capacidad de color explícita
    // 3. O es una luz con capacidades básicas (puede ser RGB)
    const esFoco = (esLuz && tieneBrillo) || tieneColor || (esLuz && tieneCapacidades);
    
    if (esFoco) {
      console.log('✅ Dispositivo identificado como foco:', dispositivo.displayName || dispositivo.friendlyName);
    }
    
    return esFoco;
  });
}

/**
 * Mapeo de nombres de colores a valores RGB
 */
const COLOR_MAP = {
  'rojo': { r: 255, g: 0, b: 0 },
  'verde': { r: 0, g: 255, b: 0 },
  'azul': { r: 0, g: 0, b: 255 },
  'amarillo': { r: 255, g: 255, b: 0 },
  'naranja': { r: 255, g: 165, b: 0 },
  'morado': { r: 128, g: 0, b: 128 },
  'rosa': { r: 255, g: 192, b: 203 },
  'blanco': { r: 255, g: 255, b: 255 },
  'cian': { r: 0, g: 255, b: 255 },
  'magenta': { r: 255, g: 0, b: 255 },
  'verde lima': { r: 50, g: 205, b: 50 },
  'turquesa': { r: 64, g: 224, b: 208 }
};

/**
 * Normaliza el nombre de un color
 */
function normalizeColorName(colorName) {
  if (!colorName) return null;
  
  const normalized = colorName.toLowerCase().trim();
  
  // Buscar coincidencia exacta o parcial
  for (const [key, value] of Object.entries(COLOR_MAP)) {
    if (key === normalized || normalized.includes(key)) {
      return { nombre: key, rgb: value };
    }
  }
  
  return null;
}

/**
 * Convierte un valor de brillo del 0-100 a porcentaje
 */
function normalizeBrightness(brightness) {
  if (typeof brightness === 'string') {
    brightness = parseInt(brightness);
  }
  
  if (isNaN(brightness)) return 50;
  
  return Math.max(0, Math.min(100, brightness));
}

/**
 * Controla un dispositivo Alexa (implementación base)
 * 
 * En producción, esto debería integrarse con:
 * - Smart Home Skill API de Alexa
 * - API de tu proveedor de dispositivos IoT
 * - Webhook a tu backend que controle el dispositivo
 */
async function controlAlexaDevice(deviceName, action, params = {}) {
  console.log(`Controlando dispositivo: ${deviceName}, Acción: ${action}`, params);
  
  // Aquí implementarías la lógica real para controlar el dispositivo
  // Por ejemplo:
  // - Llamar a la Smart Home Skill API
  // - Enviar comando a tu backend IoT
  // - Usar webhook a servicio externo
  
  // Por ahora, retornamos éxito (en producción implementarías la lógica real)
  return {
    success: true,
    message: `Comando ${action} enviado a ${deviceName}`,
    deviceName,
    action,
    params
  };
}

/**
 * Enciende un foco RGB
 */
async function encenderFoco(deviceName) {
  return await controlAlexaDevice(deviceName, 'encender');
}

/**
 * Apaga un foco RGB
 */
async function apagarFoco(deviceName) {
  return await controlAlexaDevice(deviceName, 'apagar');
}

/**
 * Cambia el color de un foco RGB
 */
async function cambiarColorFoco(deviceName, colorName) {
  const colorInfo = normalizeColorName(colorName);
  
  if (!colorInfo) {
    throw new Error(`Color "${colorName}" no reconocido`);
  }
  
  return await controlAlexaDevice(deviceName, 'cambiarColor', {
    color: colorInfo.nombre,
    rgb: colorInfo.rgb
  });
}

/**
 * Cambia el brillo de un foco RGB
 */
async function cambiarBrilloFoco(deviceName, brillo) {
  const brilloNormalizado = normalizeBrightness(brillo);
  
  return await controlAlexaDevice(deviceName, 'cambiarBrillo', {
    brillo: brilloNormalizado
  });
}

/**
 * Establece color y brillo simultáneamente
 */
async function configurarFoco(deviceName, colorName, brillo) {
  const colorInfo = normalizeColorName(colorName);
  const brilloNormalizado = normalizeBrightness(brillo);
  
  if (colorInfo) {
    return await controlAlexaDevice(deviceName, 'configurar', {
      color: colorInfo.nombre,
      rgb: colorInfo.rgb,
      brillo: brilloNormalizado
    });
  }
  
  return await controlAlexaDevice(deviceName, 'configurar', {
    brillo: brilloNormalizado
  });
}

module.exports = {
  encenderFoco,
  apagarFoco,
  cambiarColorFoco,
  cambiarBrilloFoco,
  configurarFoco,
  normalizeColorName,
  normalizeBrightness,
  COLOR_MAP,
  obtenerDispositivosAlexa,
  filtrarFocos
};

