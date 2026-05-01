const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth',        require('./src/routes/auth'));
app.use('/api/referencias', require('./src/routes/referencias'));
app.use('/api/pedidos',     require('./src/routes/pedidos'));
app.use('/api/planillas',   require('./src/routes/planillas'));
app.use('/api/registros',   require('./src/routes/registros'));
app.use('/api/reportes',    require('./src/routes/reportes'));

app.get('/', (req, res) => res.json({ mensaje: '🏭 PlastiPak API funcionando' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
