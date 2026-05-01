import { useState, useEffect } from 'react';
import api from '../services/api';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [referencias, setReferencias] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ tipoDestino:'cliente_externo', nombreCliente:'', fechaEntrega:'', items:[{ referencia:'', cantidad:1, valorUnitario:0 }] });

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    const [p, r] = await Promise.all([api.get('/pedidos'), api.get('/referencias')]);
    setPedidos(p.data);
    setReferencias(r.data);
  };

  const addItem = () => setForm({...form, items:[...form.items,{referencia:'',cantidad:1,valorUnitario:0}]});
  const updateItem = (i, k, v) => {
    const items = [...form.items];
    items[i][k] = v;
    if (k === 'referencia') {
      const ref = referencias.find(r => r._id === v);
      if (ref) items[i].valorUnitario = ref.precioMostrador;
    }
    setForm({...form, items});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/pedidos', form);
      setMsg('✅ Pedido creado y enviado a producción');
      setMostrarForm(false);
      cargar();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.mensaje || 'Error'));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🛒 Pedidos</h2>
        <button style={styles.btnPrimary} onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cancelar' : '+ Nuevo Pedido'}
        </button>
      </div>
      {msg && <div style={styles.msg}>{msg}</div>}
      {mostrarForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Tipo Destino</label>
              <select value={form.tipoDestino} onChange={e => setForm({...form,tipoDestino:e.target.value})}>
                <option value="cliente_externo">Cliente Externo</option>
                <option value="almacen_propio">Almacén Propio</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Nombre Cliente</label>
              <input value={form.nombreCliente} onChange={e => setForm({...form,nombreCliente:e.target.value})} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Fecha Entrega (mín. 15 días)</label>
              <input type="date" value={form.fechaEntrega} onChange={e => setForm({...form,fechaEntrega:e.target.value})} required />
            </div>
          </div>
          <h4 style={{color:'#e94560'}}>Items del Pedido</h4>
          {form.items.map((item, i) => (
            <div key={i} style={styles.grid3}>
              <div style={styles.field}>
                <label style={styles.label}>Referencia</label>
                <select value={item.referencia} onChange={e => updateItem(i,'referencia',e.target.value)} required>
                  <option value="">Seleccionar...</option>
                  {referencias.map(r => <option key={r._id} value={r._id}>{r.codigo} - {r.nombre}</option>)}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Cantidad</label>
                <input type="number" min="1" value={item.cantidad} onChange={e => updateItem(i,'cantidad',e.target.value)} required />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Valor Unitario</label>
                <input type="number" value={item.valorUnitario} onChange={e => updateItem(i,'valorUnitario',e.target.value)} required />
              </div>
            </div>
          ))}
          <button type="button" onClick={addItem} style={styles.btnSecondary}>+ Agregar Item</button>
          <button type="submit" style={styles.btnPrimary}>Crear Pedido</button>
        </form>
      )}
      <div style={styles.tabla}>
        <table style={styles.table}>
          <thead>
            <tr>{['#Pedido','Cliente','Destino','Items','Fecha Entrega','Estado'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {pedidos.map(p => (
              <tr key={p._id} style={styles.tr}>
                <td style={styles.td}>{p.numeroPedido}</td>
                <td style={styles.td}>{p.nombreCliente || '-'}</td>
                <td style={styles.td}>{p.tipoDestino}</td>
                <td style={styles.td}>{p.items?.length} item(s)</td>
                <td style={styles.td}>{new Date(p.fechaEntrega).toLocaleDateString()}</td>
                <td style={styles.td}><span style={{...styles.badge, background: p.estado==='finalizado'?'#27ae60':'#e94560'}}>{p.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {pedidos.length === 0 && <p style={styles.empty}>No hay pedidos aún</p>}
      </div>
    </div>
  );
};

const styles = {
  container:{padding:'40px'}, header:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'},
  title:{color:'#ccd6f6',fontSize:'1.5rem'}, btnPrimary:{background:'#e94560',color:'#fff',border:'none',padding:'10px 20px',borderRadius:'8px',fontWeight:'bold'},
  btnSecondary:{background:'transparent',color:'#e94560',border:'1px solid #e94560',padding:'8px 16px',borderRadius:'8px'},
  msg:{padding:'10px',borderRadius:'8px',marginBottom:'16px',background:'rgba(255,255,255,0.05)',color:'#ccd6f6'},
  form:{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'24px',marginBottom:'24px',display:'flex',flexDirection:'column',gap:'16px'},
  grid2:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px'},
  grid3:{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:'16px'},
  field:{display:'flex',flexDirection:'column',gap:'6px'}, label:{fontSize:'0.8rem',color:'#8892b0'},
  tabla:{background:'rgba(255,255,255,0.03)',borderRadius:'12px',overflow:'auto'},
  table:{width:'100%',borderCollapse:'collapse'}, th:{padding:'12px 16px',textAlign:'left',color:'#e94560',fontSize:'0.85rem',borderBottom:'1px solid rgba(255,255,255,0.1)'},
  tr:{borderBottom:'1px solid rgba(255,255,255,0.05)'}, td:{padding:'12px 16px',color:'#a8b2d8',fontSize:'0.9rem'},
  badge:{padding:'2px 10px',borderRadius:'12px',fontSize:'0.8rem',color:'#fff'}, empty:{textAlign:'center',padding:'40px',color:'#8892b0'}
};

export default Pedidos;
