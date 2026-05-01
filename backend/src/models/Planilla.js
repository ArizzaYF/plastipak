const mongoose = require('mongoose');

const planillaSchema = new mongoose.Schema({
  selladora: { 
    type: Number, 
    enum: [1, 2, 3, 4, 5], 
    required: true 
  },
  turno: { 
    type: String, 
    enum: ['manana', 'tarde', 'noche'], 
    required: true 
  },
  fecha: { type: Date, required: true },
  pedidos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pedido' }],
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  estado: { 
    type: String, 
    enum: ['pendiente', 'en_proceso', 'finalizada'], 
    default: 'pendiente' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Planilla', planillaSchema);
