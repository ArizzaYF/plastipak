import { useState, useEffect } from 'react';
import api from '../services/api';

const Registro = () => {
  const [planillas, setPlanillas] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ planilla:'', selladora:'', referencia:'', numeroRollo:'' });
  const [referencias, setReferencias] = useState([]);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    const [pl, re, reg] = await Promise.all([api.get('/planillas'), api.get('/referencias'), api.get('/registros')]);
    setPlanillas(pl.data.filter(p => p.estado !== 'finalizada'));
    setReferencias(re.data);
    setRegistros(reg.data);
  };

  const handleIniciar = async (e) => {
    e.preventDefault();
    try {
      await api.post('/registros', form);
      setMsg('✅ Registro iniciado');
      setForm({ planilla:'', selladora:'', referencia:'', numeroRollo:'' });
      cargar();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.mensaje || 'Error'));
    }
  };

  const handleFinalizar = async (id) => {
    const cantidadBolsas = prompt('¿Cuántas bolsas salieron?');
    const pesoDesperdicios = prompt('¿Peso del desperdicio (kg)?');
    if (!cantidadBolsas) return;
    try {
      await api.put(`/registros/${id}/finalizar`, { cantidadBolsas: Number(cantidadBolsas), pesoDesperdicios: Number(pesoDesperdicios) });
      setMsg('✅ Registro finalizado');
      cargar();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.mensaje || 'Error'));
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔧 Registro de Sellado</h2>
      {msg && <div style={styles.msg}>{msg}</div>}
      <form onSubmit={handleIniciar} style={styles.form}>
        <h3 style={{color:'#e94560',marginBottom:'8px'}}>Iniciar Producción</h3>
        <div style={styles.grid2}>
          <div style={styles.field}>
            <label style={styles.label}>Planilla</label>
            <select value={form.planilla} onChange={e => setForm({...form, planilla:e.target.value})} required>
              <option value="">Seleccionar...</option>
              {planillas.map(p => <option key={p._id} value={p._id}>Selladora {p.selladora} — {p.turno} — {new Date(p.fecha).toLocaleDateString()}</option>)}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Selladora</label>
            <select value={form.selladora} onChange={e => setForm({...form, selladora:e.target.value})} required>
              <option value="">Seleccionar...</option>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>Selladora {n}</option>)}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Referencia</label>
            <select value={form.referencia} onChange={e => setForm({...form, referencia:e.target.value})} required>
              <option value="">Seleccionar...</option>
              {referencias.map(r => <option key={r._id} value={r._id}>{r.codigo} — {r.nombre}</option>)}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Número de Rollo</label>
            <input value={form.numeroRollo} onChange={e => setForm({...form, numeroRollo:e.target.value})} placeholder="Escanea o escribe el código" required />
          </div>
        </div>
        <button type="submit" style={styles.btnPrimary}>▶ Iniciar Producción</button>
      </form>
      <h3 style={{color:'#ccd6f6',marginBottom:'16px'}}>Registros del Turno</h3>
      <div style={styles.tabla}>
        <table style={styles.table}>
          <thead>
            <tr>{['Selladora','Referencia','Rollo','Inicio','Fin','Bolsas','Desperdicio','Acción'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {registros.map(r => (
              <tr key={r._id} style={styles.tr}>
                <td style={styles.td}>S{r.selladora}</td>
                <td style={styles.td}>{r.referencia?.codigo || '-'}</td>
                <td style={styles.td}>{r.numeroRollo}</td>
                <td style={styles.td}>{r.horaInicio ? new Date(r.horaInicio).toLocaleTimeString() : '-'}</td>
                <td style={styles.td}>{r.horaFin ? new Date(r.horaFin).toLocaleTimeString() : '-'}</td>
                <td style={styles.td}>{r.cantidadBolsas ?? '-'}</td>
                <td style={styles.td}>{r.pesoDesperdicios ?? '-'} kg</td>
                <td style={styles.td}>
                  {r.estado === 'en_proceso' && (
                    <button onClick={() => handleFinalizar(r._id)} style={styles.btnFin}>■ Finalizar</button>
                  )}
                  {r.estado === 'finalizado' && <span style={{color:'#27ae60'}}>✅</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {registros.length === 0 && <p style={styles.empty}>No hay registros aún</p>}
      </div>
    </div>
  );
};

const styles = {
  container:{padding:'40px'}, title:{color:'#ccd6f6',fontSize:'1.5rem',marginBottom:'24px'},
  msg:{padding:'10px',borderRadius:'8px',marginBottom:'16px',background:'rgba(255,255,255,0.05)',color:'#ccd6f6'},
  form:{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'24px',marginBottom:'32px',display:'flex',flexDirection:'column',gap:'16px'},
  grid2:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px'},
  field:{display:'flex',flexDirection:'column',gap:'6px'}, label:{fontSize:'0.8rem',color:'#8892b0'},
  btnPrimary:{background:'#e94560',color:'#fff',border:'none',padding:'10px 20px',borderRadius:'8px',fontWeight:'bold',alignSelf:'flex-start'},
  btnFin:{background:'transparent',color:'#f39c12',border:'1px solid #f39c12',padding:'4px 10px',borderRadius:'6px',fontSize:'0.8rem'},
  tabla:{background:'rgba(255,255,255,0.03)',borderRadius:'12px',overflow:'auto'},
  table:{width:'100%',borderCollapse:'collapse'}, th:{padding:'12px 16px',textAlign:'left',color:'#e94560',fontSize:'0.85rem',borderBottom:'1px solid rgba(255,255,255,0.1)'},
  tr:{borderBottom:'1px solid rgba(255,255,255,0.05)'}, td:{padding:'12px 16px',color:'#a8b2d8',fontSize:'0.9rem'},
  empty:{textAlign:'center',padding:'40px',color:'#8892b0'}
};

export default Registro;
