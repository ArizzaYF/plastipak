import { useState, useEffect } from 'react';
import api from '../services/api';

const estadoColor = (e) => {
  if (e === 'finalizada') return { color:'#16A34A', border:'#16A34A' };
  if (e === 'en_proceso') return { color:'#D97706', border:'#D97706' };
  return { color:'#6B7280', border:'#6B7280' };
};

const estadoLabel = (e) => {
  if (e === 'finalizada') return '✓ FINALIZADA';
  if (e === 'en_proceso') return '⟳ EN PROCESO';
  return '○ PENDIENTE';
};

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
    // Solo pedidos en produccion que no esten ya asignados a una planilla activa
    const pedidosAsignados = new Set(pl.data.filter(p => p.estado !== 'finalizada').flatMap(p => p.pedidos?.map(x => x._id || x) || []));
    setPedidos(pe.data.filter(p => p.estado === 'en_produccion' && !pedidosAsignados.has(p._id)));
  };

  const togglePedido = (id) => {
    const sel = form.pedidos.includes(id) ? form.pedidos.filter(p => p !== id) : [...form.pedidos, id];
    setForm({...form, pedidos: sel});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/planillas', form);
      setMsg('✅ Planilla creada exitosamente');
      setMostrarForm(false);
      setForm({ selladora:'1', turno:'manana', fecha:'', pedidos:[] });
      cargar();
    } catch(err) { setMsg('❌ ' + (err.response?.data?.mensaje || 'Error')); }
  };

  const turnoLabel = (t) => t === 'manana' ? 'Mañana' : t === 'tarde' ? 'Tarde' : 'Noche';

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <span style={s.tag}>// JEFE DE PRODUCCIÓN</span>
          <h2 style={s.title}>PLANILLAS DE PRODUCCIÓN</h2>
          <div style={s.underline}/>
        </div>
        {!mostrarForm
          ? <button className="neo-btn-primary" onClick={() => setMostrarForm(true)}>+ NUEVA PLANILLA</button>
          : <button className="neo-btn-secondary" onClick={() => setMostrarForm(false)}>CANCELAR</button>
        }
      </div>

      {msg && <div style={s.msg}>{msg}</div>}

      {mostrarForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>NUEVA PLANILLA DE PRODUCCIÓN</h3>
          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.grid3}>
              <div style={s.field}>
                <label style={s.label}>SELLADORA</label>
                <select value={form.selladora} onChange={e => setForm({...form, selladora:e.target.value})}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>Selladora {n}</option>)}
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>TURNO</label>
                <select value={form.turno} onChange={e => setForm({...form, turno:e.target.value})}>
                  <option value="manana">Mañana</option>
                  <option value="tarde">Tarde</option>
                  <option value="noche">Noche</option>
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>FECHA DE TRABAJO</label>
                <input type="date" value={form.fecha} onChange={e => setForm({...form, fecha:e.target.value})} required/>
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>// SELECCIONAR PEDIDOS A PRODUCIR</label>
              <div style={s.pedidosList}>
                {pedidos.length === 0
                  ? <p style={s.sinPedidos}>No hay pedidos disponibles para asignar</p>
                  : pedidos.map(p => (
                    <label key={p._id} style={s.checkRow}>
                      <input type="checkbox" checked={form.pedidos.includes(p._id)} onChange={() => togglePedido(p._id)} style={{accentColor:'var(--accent)',width:'16px',height:'16px',flexShrink:0}}/>
                      <div style={s.checkInfo}>
                        <span style={s.checkCodigo}>{p.numeroPedido}</span>
                        <span style={s.checkDetalle}>Cliente: {p.nombreCliente || 'Almacén propio'} · {p.items?.length} item(s) · Entrega: {new Date(p.fechaEntrega).toLocaleDateString()}</span>
                      </div>
                    </label>
                  ))
                }
              </div>
            </div>
            <button type="submit" className="neo-btn-primary" style={{alignSelf:'flex-start'}}>CREAR PLANILLA</button>
          </form>
        </div>
      )}

      {/* TABLA DE PLANILLAS */}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              {['SELLADORA','TURNO','FECHA DE TRABAJO','PEDIDOS ASIGNADOS','CREADA EL','ESTADO'].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {planillas.length === 0 && (
              <tr><td colSpan={6} style={s.empty}>No hay planillas creadas aún</td></tr>
            )}
            {planillas.map(p => {
              const ec = estadoColor(p.estado);
              return (
                <tr key={p._id} style={s.tr}>
                  <td style={s.tdDestacado}>SELLADORA {p.selladora}</td>
                  <td style={s.td}>{turnoLabel(p.turno)}</td>
                  <td style={s.tdMono}>{new Date(p.fecha).toLocaleDateString('es-CO', {day:'2-digit',month:'long',year:'numeric'})}</td>
                  <td style={s.td}>
                    <div style={s.pedidosBadges}>
                      {p.pedidos?.length > 0
                        ? p.pedidos.map((ped, i) => (
                          <span key={i} style={s.pedidoBadge}>
                            {ped.numeroPedido || `Pedido ${i+1}`}
                          </span>
                        ))
                        : <span style={{color:'var(--text-muted)'}}>Sin pedidos</span>
                      }
                    </div>
                  </td>
                  <td style={s.tdMono}>{new Date(p.createdAt).toLocaleDateString('es-CO', {day:'2-digit',month:'long',year:'numeric'})}</td>
                  <td style={s.td}>
                    <span style={{...s.estadoBadge, color: ec.color, borderColor: ec.border}}>
                      {estadoLabel(p.estado)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
  field:{display:'flex',flexDirection:'column',gap:'8px'},
  label:{fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'var(--text-muted)',letterSpacing:'0.15em'},
  pedidosList:{background:'#0d0f13',border:'2px solid var(--border-dim)',padding:'16px',display:'flex',flexDirection:'column',gap:'12px',borderRadius:'2px',maxHeight:'200px',overflowY:'auto'},
  sinPedidos:{fontFamily:'var(--font-mono)',fontSize:'0.78rem',color:'var(--text-muted)',textAlign:'center',padding:'12px'},
  checkRow:{display:'flex',alignItems:'flex-start',gap:'12px',cursor:'pointer',padding:'8px',borderRadius:'2px'},
  checkInfo:{display:'flex',flexDirection:'column',gap:'4px'},
  checkCodigo:{fontFamily:'var(--font-mono)',fontSize:'0.78rem',color:'var(--accent)'},
  checkDetalle:{fontFamily:'var(--font-mono)',fontSize:'0.7rem',color:'var(--text-muted)'},
  tableWrap:{background:'var(--bg-card)',border:'2px solid var(--border-dim)',boxShadow:'6px 6px 0 var(--border-dim)',borderRadius:'2px',overflow:'auto'},
  table:{width:'100%',borderCollapse:'collapse'},
  th:{padding:'14px 16px',textAlign:'left',fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'var(--accent)',letterSpacing:'0.12em',borderBottom:'2px solid var(--border-dim)',background:'#0d0f13',whiteSpace:'nowrap'},
  tr:{borderBottom:'1px solid var(--border-dim)'},
  td:{padding:'14px 16px',color:'var(--text-secondary)',fontSize:'0.88rem'},
  tdMono:{padding:'14px 16px',color:'var(--text)',fontFamily:'var(--font-mono)',fontSize:'0.78rem'},
  tdDestacado:{padding:'14px 16px',color:'var(--accent)',fontFamily:'var(--font-display)',fontSize:'1rem',fontWeight:'700'},
  estadoBadge:{border:'2px solid',padding:'4px 10px',fontFamily:'var(--font-mono)',fontSize:'0.65rem',fontWeight:'700',letterSpacing:'0.1em',borderRadius:'2px',whiteSpace:'nowrap'},
  pedidosBadges:{display:'flex',flexDirection:'column',gap:'4px'},
  pedidoBadge:{fontFamily:'var(--font-mono)',fontSize:'0.68rem',color:'var(--text-secondary)',background:'#0d0f13',border:'1px solid var(--border-dim)',padding:'2px 8px',borderRadius:'2px',display:'inline-block'},
  empty:{textAlign:'center',padding:'40px',color:'var(--text-muted)',fontFamily:'var(--font-mono)',fontSize:'0.8rem'},
};

export default Planillas;
