const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();
connectDB();

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/auth',        require('./src/routes/auth'));
app.use('/api/referencias', require('./src/routes/referencias'));
app.use('/api/pedidos',     require('./src/routes/pedidos'));
app.use('/api/planillas',   require('./src/routes/planillas'));
app.use('/api/registros',   require('./src/routes/registros'));
app.use('/api/reportes',    require('./src/routes/reportes'));

app.get('/', (req, res) => res.json({ mensaje: 'PlastiPak API funcionando' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Servidor corriendo en puerto ' + PORT));
