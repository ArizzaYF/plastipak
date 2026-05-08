const Planilla = require('../models/Planilla');

exports.getPlanillas = async (req, res) => {
  try {
    const planillas = await Planilla.find()
      .populate({
        path: 'pedidos',
        populate: { path: 'items.referencia', select: 'codigo nombre' }
      })
      .populate('creadoPor', 'nombre');
    res.json(planillas);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};

exports.crearPlanilla = async (req, res) => {
  try {
    const { selladora, turno, fecha, pedidos } = req.body;
    const planilla = await Planilla.create({
      selladora, turno, fecha, pedidos,
      creadoPor: req.usuario.id
    });
    res.status(201).json(planilla);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};
