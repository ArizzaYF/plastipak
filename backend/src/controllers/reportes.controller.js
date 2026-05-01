const RegistroSellado = require('../models/RegistroSellado');

exports.getReporteTurno = async (req, res) => {
  try {
    const { fecha, turno } = req.query;
    const registros = await RegistroSellado.find({ estado: 'finalizado' })
      .populate('operario', 'nombre')
      .populate('referencia', 'codigo nombre');

    const reporte = registros.map(r => ({
      selladora: r.selladora,
      operario: r.operario?.nombre,
      referencia: r.referencia?.codigo,
      numeroRollo: r.numeroRollo,
      horaInicio: r.horaInicio,
      horaFin: r.horaFin,
      cantidadBolsas: r.cantidadBolsas,
      pesoDesperdicios: r.pesoDesperdicios
    }));

    res.json({ turno, fecha, reporte });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};
