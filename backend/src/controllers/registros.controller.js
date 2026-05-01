const RegistroSellado = require('../models/RegistroSellado');

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
    res.json(registro);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};
