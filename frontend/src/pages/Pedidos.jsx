import { useState, useEffect } from 'react';
import api from '../services/api';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [referencias, setReferencias] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ tipoDestino:'cliente_externo', nombreCliente:'', fechaEntrega:'', items:[{referencia:'',cantidad:1,valorUnitario:0}] });

  useEffect(() => { cargar(); }, []);
  const cargar = async () => {
    const [p,r] = await Promise.all([api.get('/pedidos'),api.get('/referencias')]);
    setPedidos(p.data); setReferencias(r.data);
  };

  const addItem = () => setForm({...form,items:[...form.items,{referencia:'',cantidad:1,valorUnitario:0}]});
  const updateItem = (i,k,v) => {
    const items = [...form.items]; items[i][k]=v;
    if(k==='referencia'){const ref=referencias.find(r=>r._id===v); if(ref) items[i].valorUnitario=ref.precioMostrador;}
    setForm({...form,items});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/pedidos',form);
      setMsg('✅ Pedido creado y enviado a producción');
      setMostrarForm(false); cargar();
    } catch(err){ setMsg('❌ '+(err.response?.data?.mensaje||'Error')); }
  };

  const estadoColor = (e) => e==='finalizado' ? 'var(--success)' : 'var(--accent)';

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <span style={s.tag}>// VENTAS</span>
          <h2 style={s.title}>PEDIDOS</h2>
          <div style={s.underline}/>
        </div>
        <button className="neo-btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'CANCELAR' : '+ NUEVO PEDIDO'}
        </button>
      </div>

      {msg && <div style={s.msg}>{msg}</div>}

      {mostrarForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>NUEVO PEDIDO</h3>
          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.grid3}>
              <div style={s.field}>
                <label style={s.label}>TIPO DESTINO</label>
                <select value={form.tipoDestino} onChange={e=>setForm({...form,tipoDestino:e.target.value})}>
                  <option value="cliente_externo">Cliente Externo</option>
                  <option value="almacen_propio">Almacén Propio</option>
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>NOMBRE CLIENTE</label>
                <input value={form.nombreCliente} onChange={e=>setForm({...form,nombreCliente:e.target.value})}/>
              </div>
              <div style={s.field}>
                <label style={s.label}>FECHA ENTREGA (MÍN. 15 DÍAS)</label>
                <input type="date" value={form.fechaEntrega} onChange={e=>setForm({...form,fechaEntrega:e.target.value})} required/>
              </div>
            </div>

            <div style={s.itemsSection}>
              <span style={s.itemsLabel}>// ITEMS DEL PEDIDO</span>
              {form.items.map((item,i) => (
                <div key={i} style={s.itemRow}>
                  <div style={{...s.field,flex:3}}>
                    <label style={s.label}>REFERENCIA</label>
                    <select value={item.referencia} onChange={e=>updateItem(i,'referencia',e.target.value)} required>
                      <option value="">Seleccionar...</option>
                      {referencias.map(r=><option key={r._id} value={r._id}>{r.codigo} — {r.nombre}</option>)}
                    </select>
                  </div>
                  <div style={{...s.field,flex:1}}>
                    <label style={s.label}>CANTIDAD</label>
                    <input type="number" min="1" value={item.cantidad} onChange={e=>updateItem(i,'cantidad',e.target.value)} required/>
                  </div>
                  <div style={{...s.field,flex:1}}>
                    <label style={s.label}>VALOR UNIT.</label>
                    <input type="number" value={item.valorUnitario} onChange={e=>updateItem(i,'valorUnitario',e.target.value)} required/>
                  </div>
                </div>
              ))}
              <button type="button" className="neo-btn-secondary" style={{alignSelf:'flex-start',fontSize:'0.8rem',padding:'8px 14px'}} onClick={addItem}>+ AGREGAR ITEM</button>
            </div>

            <button type="submit" className="neo-btn-primary" style={{alignSelf:'flex-start'}}>CREAR PEDIDO</button>
          </form>
        </div>
      )}

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>{['#PEDIDO','CLIENTE','DESTINO','ITEMS','FECHA ENTREGA','ESTADO'].map(h=><th key={h} style={s.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {pedidos.map(p=>(
              <tr key={p._id} style={s.tr}>
                <td style={s.tdMono}>{p.numeroPedido}</td>
                <td style={s.td}>{p.nombreCliente||'—'}</td>
                <td style={s.td}>{p.tipoDestino}</td>
                <td style={s.tdMono}>{p.items?.length} item(s)</td>
                <td style={s.tdMono}>{new Date(p.fechaEntrega).toLocaleDateString()}</td>
                <td style={s.td}>
                  <span style={{...s.estadoBadge,borderColor:estadoColor(p.estado),color:estadoColor(p.estado)}}>
                    {p.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pedidos.length===0 && <p style={s.empty}>No hay pedidos aún</p>}
      </div>
    </div>
  );
};

const s = {
  page:{padding:'40px',maxWidth:'1200px'},
  header:{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'32px'},
  tag:{fontFamily:'var(--font-mono)',fontSize:'0.68rem',color:'var(--accent)',letterSpacing:'0.15em',display:'block',marginBottom:'6px'},
  title:{fontFamily:'var(--font-display)',fontSize:'1.8rem',fontWeight:'700',letterSpacing:'0.08em'},
  underline:{height:'3px',width:'40px',background:'var(--accent)',marginTop:'8px'},
  msg:{padding:'12px 16px',border:'2px solid var(--border-dim)',background:'var(--bg-card)',fontFamily:'var(--font-mono)',fontSize:'0.8rem',color:'var(--text)',marginBottom:'20px',borderRadius:'2px'},
  formCard:{background:'var(--bg-card)',border:'2px solid var(--border-dim)',boxShadow:'6px 6px 0 var(--border-dim)',padding:'28px',marginBottom:'28px',borderRadius:'2px'},
  formTitle:{fontFamily:'var(--font-mono)',fontSize:'0.8rem',color:'var(--accent)',letterSpacing:'0.15em',marginBottom:'20px'},
  form:{display:'flex',flexDirection:'column',gap:'20px'},
  grid3:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'},
  field:{display:'flex',flexDirection:'column',gap:'6px'},
  label:{fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'#cccccc',letterSpacing:'0.15em'},
  itemsSection:{display:'flex',flexDirection:'column',gap:'12px'},
  itemsLabel:{fontFamily:'var(--font-mono)',fontSize:'0.68rem',color:'var(--accent)',letterSpacing:'0.15em'},
  itemRow:{display:'flex',gap:'12px',alignItems:'flex-end'},
  tableWrap:{background:'var(--bg-card)',border:'2px solid var(--border-dim)',boxShadow:'6px 6px 0 var(--border-dim)',borderRadius:'2px',overflow:'auto'},
  table:{width:'100%',borderCollapse:'collapse'},
  th:{padding:'12px 16px',textAlign:'left',fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'var(--accent)',letterSpacing:'0.12em',borderBottom:'2px solid var(--border-dim)',background:'#0d0f13'},
  tr:{borderBottom:'1px solid var(--border-dim)'},
  td:{padding:'12px 16px',color:'#ffffff',fontSize:'0.88rem'},
  tdMono:{padding:'12px 16px',color:'var(--text)',fontFamily:'var(--font-mono)',fontSize:'0.8rem'},
  estadoBadge:{border:'2px solid',padding:'2px 10px',fontFamily:'var(--font-mono)',fontSize:'0.65rem',fontWeight:'700',letterSpacing:'0.1em',borderRadius:'2px'},
  empty:{textAlign:'center',padding:'40px',color:'#cccccc',fontFamily:'var(--font-mono)',fontSize:'0.8rem'},
};

export default Pedidos;
