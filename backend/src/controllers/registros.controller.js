const RegistroSellado = require('../models/RegistroSellado');
const Planilla = require('../models/Planilla');
const Pedido = require('../models/Pedido');

exports.getRegistros = async (req, res) => {
  try {
    const registros = await RegistroSellado.find()
      .populate('operario', 'nombre')
      .populate('referencia', 'codigo nombre');
    res.json(registros);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};

exports.crearRegistro = async (req, res) => {
  try {
    const { planilla, selladora, referencia, numeroRollo } = req.body;
    const registro = await RegistroSellado.create({
      planilla, selladora, referencia, numeroRollo,
      operario: req.usuario.id,
      horaInicio: new Date(),
      estado: 'en_proceso'
    });
    await Planilla.findByIdAndUpdate(planilla, { estado: 'en_proceso' });
    res.status(201).json(registro);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};

exports.finalizarRegistro = async (req, res) => {
  try {
    const { cantidadBolsas, pesoDesperdicios } = req.body;
    const registro = await RegistroSellado.findByIdAndUpdate(
      req.params.id,
      { cantidadBolsas, pesoDesperdicios, horaFin: new Date(), estado: 'finalizado' },
      { new: true }
    );

    // Si no quedan registros en proceso para esta planilla, finalizarla
    const pendientes = await RegistroSellado.find({ planilla: registro.planilla, estado: 'en_proceso' });
    if (pendientes.length === 0) {
      await Planilla.findByIdAndUpdate(registro.planilla, { estado: 'finalizada' });
    }

    // Buscar si hay pedidos relacionados a esta planilla y finalizarlos
    const planilla = await Planilla.findById(registro.planilla);
    if (planilla && planilla.pedidos) {
      for (const pedidoId of planilla.pedidos) {
        const registrosPedido = await RegistroSellado.find({ estado: 'en_proceso' });
        if (registrosPedido.length === 0) {
          await Pedido.findByIdAndUpdate(pedidoId, { estado: 'finalizado' });
        }
      }
    }

    res.json(registro);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};
