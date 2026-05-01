const Referencia = require('../models/Referencia');

exports.getReferencias = async (req, res) => {
  try {
    const referencias = await Referencia.find();
    res.json(referencias);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};

exports.crearReferencia = async (req, res) => {
  try {
    const referencia = await Referencia.create(req.body);
    res.status(201).json(referencia);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};
