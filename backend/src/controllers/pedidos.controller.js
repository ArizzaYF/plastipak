const Pedido = require('../models/Pedido');

exports.getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('vendedor', 'nombre email')
      .populate('items.referencia', 'codigo nombre');
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};

exports.crearPedido = async (req, res) => {
  try {
    const { tipoDestino, nombreCliente, items, fechaEntrega } = req.body;

    const fechaMin = new Date();
    fechaMin.setDate(fechaMin.getDate() + 15);
    if (new Date(fechaEntrega) < fechaMin) {
      return res.status(400).json({ mensaje: 'La fecha de entrega debe ser mínimo 15 días desde hoy' });
    }

    const numeroPedido = 'PED-' + Date.now();
    const pedido = await Pedido.create({
      numeroPedido,
      vendedor: req.usuario.id,
      tipoDestino,
      nombreCliente,
      items,
      fechaEntrega,
      estado: 'en_produccion'
    });

    res.status(201).json(pedido);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};
