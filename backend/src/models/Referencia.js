const mongoose = require('mongoose');

const referenciaSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  tipoProducto: { 
    type: String, 
    enum: ['bolsa', 'lamina', 'cuelgue'], 
    required: true 
  },
  materiaPrima: { type: String, required: true },
  color: { type: String },
  troquelado: { type: String },
  ancho: { type: Number },
  fuelleIzquierdo: { type: Number },
  fuelleDerecho: { type: Number },
  alto: { type: Number },
  calibre: { type: Number },
  sellado: { 
    type: String, 
    enum: ['fondo', 'lateral', 'ambos'] 
  },
  tieneImpresion: { type: Boolean, default: false },
  medida: { type: String },
  precioMayorista: { type: Number, default: 0 },
  precioMostrador: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Referencia', referenciaSchema);
