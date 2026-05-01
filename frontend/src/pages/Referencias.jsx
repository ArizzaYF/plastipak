import { useState, useEffect } from 'react';
import api from '../services/api';

const Referencias = () => {
  const [referencias, setReferencias] = useState([]);
  const [form, setForm] = useState({ codigo:'', nombre:'', tipoProducto:'bolsa', materiaPrima:'', color:'', ancho:'', alto:'', calibre:'', sellado:'fondo', tieneImpresion:false, precioMayorista:0, precioMostrador:0 });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    const { data } = await api.get('/referencias');
    setReferencias(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/referencias', form);
      setMsg('✅ Referencia creada');
      setMostrarForm(false);
      cargar();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.mensaje || 'Error'));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📦 Referencias</h2>
        <button style={styles.btnPrimary} onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cancelar' : '+ Nueva Referencia'}
        </button>
      </div>
      {msg && <div style={styles.msg}>{msg}</div>}
      {mostrarForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid2}>
            {[['codigo','Código'],['nombre','Nombre'],['materiaPrima','Materia Prima'],['color','Color'],['ancho','Ancho'],['alto','Alto'],['calibre','Calibre'],['precioMayorista','Precio Mayorista'],['precioMostrador','Precio Mostrador']].map(([k,l]) => (
              <div key={k} style={styles.field}>
                <label style={styles.label}>{l}</label>
                <input value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} required={['codigo','nombre','materiaPrima'].includes(k)} />
              </div>
            ))}
            <div style={styles.field}>
              <label style={styles.label}>Tipo Producto</label>
              <select value={form.tipoProducto} onChange={e => setForm({...form,tipoProducto:e.target.value})}>
                <option value="bolsa">Bolsa</option>
                <option value="lamina">Lámina</option>
                <option value="cuelgue">Cuelgue</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Sellado</label>
              <select value={form.sellado} onChange={e => setForm({...form,sellado:e.target.value})}>
                <option value="fondo">Fondo</option>
                <option value="lateral">Lateral</option>
                <option value="ambos">Ambos</option>
              </select>
            </div>
          </div>
          <button type="submit" style={styles.btnPrimary}>Guardar Referencia</button>
        </form>
      )}
      <div style={styles.tabla}>
        <table style={styles.table}>
          <thead>
            <tr>{['Código','Nombre','Tipo','Materia Prima','Sellado','P.Mayorista','P.Mostrador'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {referencias.map(r => (
              <tr key={r._id} style={styles.tr}>
                <td style={styles.td}>{r.codigo}</td>
                <td style={styles.td}>{r.nombre}</td>
                <td style={styles.td}>{r.tipoProducto}</td>
                <td style={styles.td}>{r.materiaPrima}</td>
                <td style={styles.td}>{r.sellado}</td>
                <td style={styles.td}>${r.precioMayorista}</td>
                <td style={styles.td}>${r.precioMostrador}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {referencias.length === 0 && <p style={styles.empty}>No hay referencias aún</p>}
      </div>
    </div>
  );
};

const styles = {
  container: { padding:'40px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' },
  title: { color:'#ccd6f6', fontSize:'1.5rem' },
  btnPrimary: { background:'#e94560', color:'#fff', border:'none', padding:'10px 20px', borderRadius:'8px', fontWeight:'bold' },
  msg: { padding:'10px', borderRadius:'8px', marginBottom:'16px', background:'rgba(255,255,255,0.05)', color:'#ccd6f6' },
  form: { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', padding:'24px', marginBottom:'24px', display:'flex', flexDirection:'column', gap:'16px' },
  grid2: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px,1fr))', gap:'16px' },
  field: { display:'flex', flexDirection:'column', gap:'6px' },
  label: { fontSize:'0.8rem', color:'#8892b0' },
  tabla: { background:'rgba(255,255,255,0.03)', borderRadius:'12px', overflow:'auto' },
  table: { width:'100%', borderCollapse:'collapse' },
  th: { padding:'12px 16px', textAlign:'left', color:'#e94560', fontSize:'0.85rem', borderBottom:'1px solid rgba(255,255,255,0.1)' },
  tr: { borderBottom:'1px solid rgba(255,255,255,0.05)' },
  td: { padding:'12px 16px', color:'#a8b2d8', fontSize:'0.9rem' },
  empty: { textAlign:'center', padding:'40px', color:'#8892b0' }
};

export default Referencias;
