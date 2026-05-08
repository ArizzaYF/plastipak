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
    const { codigo, nombre, tipoProducto, materiaPrima, sellado, precioMayorista, precioMostrador } = req.body;
    const referencia = await Referencia.create({ codigo, nombre, tipoProducto, materiaPrima, sellado, precioMayorista, precioMostrador });
    res.status(201).json(referencia);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};

exports.actualizarReferencia = async (req, res) => {
  try {
    const { codigo, nombre, tipoProducto, materiaPrima, sellado, precioMayorista, precioMostrador } = req.body;
    const referencia = await Referencia.findByIdAndUpdate(
      req.params.id,
      { codigo, nombre, tipoProducto, materiaPrima, sellado, precioMayorista, precioMostrador },
      { new: true }
    );
    res.json(referencia);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};

exports.eliminarReferencia = async (req, res) => {
  try {
    await Referencia.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Referencia eliminada' });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};
