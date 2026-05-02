import { useState, useEffect } from 'react';
import api from '../services/api';

const Planillas = () => {
  const [planillas, setPlanillas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ selladora:'1', turno:'manana', fecha:'', pedidos:[] });

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    const [pl, pe] = await Promise.all([api.get('/planillas'), api.get('/pedidos')]);
    setPlanillas(pl.data);
    setPedidos(pe.data.filter(p => p.estado === 'en_produccion'));
  };

  const togglePedido = (id) => {
    const sel = form.pedidos.includes(id) ? form.pedidos.filter(p => p !== id) : [...form.pedidos, id];
    setForm({...form, pedidos: sel});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/planillas', form);
      setMsg('✅ Planilla creada');
      setMostrarForm(false);
      cargar();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.mensaje || 'Error'));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📋 Planillas de Producción</h2>
        <button style={styles.btnPrimary} onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cancelar' : '+ Nueva Planilla'}
        </button>
      </div>
      {msg && <div style={styles.msg}>{msg}</div>}
      {mostrarForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid3}>
            <div style={styles.field}>
              <label style={styles.label}>Selladora</label>
              <select value={form.selladora} onChange={e => setForm({...form, selladora:e.target.value})}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>Selladora {n}</option>)}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Turno</label>
              <select value={form.turno} onChange={e => setForm({...form, turno:e.target.value})}>
                <option value="manana">Mañana</option>
                <option value="tarde">Tarde</option>
                <option value="noche">Noche</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Fecha</label>
              <input type="date" value={form.fecha} onChange={e => setForm({...form, fecha:e.target.value})} required />
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Pedidos a asignar</label>
            <div style={styles.pedidosList}>
              {pedidos.length === 0 && <p style={{color:'#8892b0'}}>No hay pedidos en producción</p>}
              {pedidos.map(p => (
                <label key={p._id} style={styles.checkLabel}>
                  <input type="checkbox" checked={form.pedidos.includes(p._id)} onChange={() => togglePedido(p._id)} />
                  <span>{p.numeroPedido} — {p.nombreCliente || 'Almacén'} — {p.items?.length} item(s)</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" style={styles.btnPrimary}>Crear Planilla</button>
        </form>
      )}
      <div style={styles.grid}>
        {planillas.map(p => (
          <div key={p._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.selladora}>Selladora {p.selladora}</span>
              <span style={{...styles.badge, background: p.estado==='finalizada'?'#27ae60':p.estado==='en_proceso'?'#f39c12':'#8892b0'}}>{p.estado}</span>
            </div>
            <p style={styles.cardText}>🕐 Turno: {p.turno}</p>
            <p style={styles.cardText}>📅 {new Date(p.fecha).toLocaleDateString()}</p>
            <p style={styles.cardText}>📦 {p.pedidos?.length} pedido(s)</p>
          </div>
        ))}
        {planillas.length === 0 && <p style={styles.empty}>No hay planillas aún</p>}
      </div>
    </div>
  );
};

const styles = {
  container:{padding:'40px'}, header:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'},
  title:{color:'#ccd6f6',fontSize:'1.5rem'}, btnPrimary:{background:'#e94560',color:'#fff',border:'none',padding:'10px 20px',borderRadius:'8px',fontWeight:'bold'},
  msg:{padding:'10px',borderRadius:'8px',marginBottom:'16px',background:'rgba(255,255,255,0.05)',color:'#ccd6f6'},
  form:{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'24px',marginBottom:'24px',display:'flex',flexDirection:'column',gap:'16px'},
  grid3:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'},
  field:{display:'flex',flexDirection:'column',gap:'6px'}, label:{fontSize:'0.8rem',color:'#8892b0'},
  pedidosList:{display:'flex',flexDirection:'column',gap:'8px',padding:'12px',background:'rgba(0,0,0,0.2)',borderRadius:'8px'},
  checkLabel:{display:'flex',alignItems:'center',gap:'10px',color:'#a8b2d8',fontSize:'0.9rem',cursor:'pointer'},
  grid:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'16px'},
  card:{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'20px'},
  cardHeader:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'},
  selladora:{color:'#e94560',fontWeight:'bold',fontSize:'1rem'},
  badge:{padding:'2px 10px',borderRadius:'12px',fontSize:'0.75rem',color:'#fff'},
  cardText:{color:'#a8b2d8',fontSize:'0.85rem',marginBottom:'4px'},
  empty:{color:'#8892b0',gridColumn:'1/-1'}
};

export default Planillas;
