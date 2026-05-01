const mongoose = require('mongoose');

const registroSelladoSchema = new mongoose.Schema({
  planilla: { type: mongoose.Schema.Types.ObjectId, ref: 'Planilla', required: true },
  operario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  selladora: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
  referencia: { type: mongoose.Schema.Types.ObjectId, ref: 'Referencia', required: true },
  numeroRollo: { type: String, required: true },
  horaInicio: { type: Date, required: true },
  horaFin: { type: Date },
  cantidadBolsas: { type: Number },
  pesoDesperdicios: { type: Number },
  estado: { 
    type: String, 
    enum: ['en_proceso', 'finalizado'], 
    default: 'en_proceso' 
  }
}, { timestamps: true });

module.exports = mongoose.model('RegistroSellado', registroSelladoSchema);
