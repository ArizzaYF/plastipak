const mongoose = require('mongoose');

const itemPedidoSchema = new mongoose.Schema({
  referencia: { type: mongoose.Schema.Types.ObjectId, ref: 'Referencia', required: true },
  cantidad: { type: Number, required: true },
  valorUnitario: { type: Number, required: true }
});

const pedidoSchema = new mongoose.Schema({
  numeroPedido: { type: String, required: true, unique: true },
  vendedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  tipoDestino: { 
    type: String, 
    enum: ['cliente_externo', 'almacen_propio'], 
    required: true 
  },
  nombreCliente: { type: String },
  items: [itemPedidoSchema],
  fechaEntrega: { type: Date, required: true },
  estado: { 
    type: String, 
    enum: ['en_produccion', 'finalizado'], 
    default: 'en_produccion' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Pedido', pedidoSchema);
