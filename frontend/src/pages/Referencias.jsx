import { useState, useEffect } from 'react';
import api from '../services/api';

const camposVacios = { codigo:'', nombre:'', tipoProducto:'bolsa', materiaPrima:'', sellado:'fondo', precioMayorista:0, precioMostrador:0 };

const Referencias = () => {
  const [referencias, setReferencias] = useState([]);
  const [form, setForm] = useState(camposVacios);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { cargar(); }, []);
  const cargar = async () => { const { data } = await api.get('/referencias'); setReferencias(data); };

  const abrirNuevo = () => { setForm(camposVacios); setEditandoId(null); setMostrarForm(true); };
  const abrirEditar = (r) => { setForm({ codigo:r.codigo, nombre:r.nombre, tipoProducto:r.tipoProducto, materiaPrima:r.materiaPrima, sellado:r.sellado, precioMayorista:r.precioMayorista, precioMostrador:r.precioMostrador }); setEditandoId(r._id); setMostrarForm(true); };
  const cancelar = () => { setMostrarForm(false); setEditandoId(null); setForm(camposVacios); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await api.put(`/referencias/${editandoId}`, form);
        setMsg('✅ Referencia actualizada');
      } else {
        await api.post('/referencias', form);
        setMsg('✅ Referencia creada');
      }
      cancelar(); cargar();
    } catch (err) { setMsg('❌ ' + (err.response?.data?.mensaje || 'Error')); }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar esta referencia?')) return;
    try {
      await api.delete(`/referencias/${id}`);
      setMsg('✅ Referencia eliminada');
      cargar();
    } catch (err) { setMsg('❌ Error al eliminar'); }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <span style={s.tag}>// CATÁLOGO</span>
          <h2 style={s.title}>REFERENCIAS</h2>
          <div style={s.underline}/>
        </div>
        {!mostrarForm && <button className="neo-btn-primary" onClick={abrirNuevo}>+ NUEVA</button>}
        {mostrarForm && <button className="neo-btn-secondary" onClick={cancelar}>CANCELAR</button>}
      </div>

      {msg && <div style={s.msg}>{msg}</div>}

      {mostrarForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>{editandoId ? '// EDITAR REFERENCIA' : '// NUEVA REFERENCIA'}</h3>
          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.grid}>
              {[['codigo','CÓDIGO'],['nombre','NOMBRE'],['materiaPrima','MATERIA PRIMA'],['precioMayorista','P. MAYORISTA'],['precioMostrador','P. MOSTRADOR']].map(([k,l]) => (
                <div key={k} style={s.field}>
                  <label style={s.label}>{l}</label>
                  <input value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} required={['codigo','nombre','materiaPrima'].includes(k)}/>
                </div>
              ))}
              <div style={s.field}>
                <label style={s.label}>TIPO PRODUCTO</label>
                <select value={form.tipoProducto} onChange={e => setForm({...form,tipoProducto:e.target.value})}>
                  <option value="bolsa">Bolsa</option>
                  <option value="lamina">Lámina</option>
                  <option value="cuelgue">Cuelgue</option>
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>SELLADO</label>
                <select value={form.sellado} onChange={e => setForm({...form,sellado:e.target.value})}>
                  <option value="fondo">Fondo</option>
                  <option value="lateral">Lateral</option>
                  <option value="ambos">Ambos</option>
                </select>
              </div>
            </div>
            <button type="submit" className="neo-btn-primary" style={{alignSelf:'flex-start'}}>
              {editandoId ? 'GUARDAR CAMBIOS' : 'GUARDAR REFERENCIA'}
            </button>
          </form>
        </div>
      )}

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>{['CÓDIGO','NOMBRE','TIPO','MATERIA PRIMA','SELLADO','P.MAYOR','P.MOSTRADOR','ACCIONES'].map(h=><th key={h} style={s.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {referencias.map(r=>(
              <tr key={r._id} style={s.tr}>
                <td style={s.tdMono}>{r.codigo}</td>
                <td style={s.td}>{r.nombre}</td>
                <td style={s.td}><span style={s.badge}>{r.tipoProducto}</span></td>
                <td style={s.td}>{r.materiaPrima}</td>
                <td style={s.td}>{r.sellado}</td>
                <td style={s.tdMono}>${r.precioMayorista}</td>
                <td style={s.tdMono}>${r.precioMostrador}</td>
                <td style={s.td}>
                  <div style={s.acciones}>
                    <button onClick={() => abrirEditar(r)} style={s.btnEdit}>EDITAR</button>
                    <button onClick={() => handleEliminar(r._id)} style={s.btnDel}>BORRAR</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {referencias.length===0 && <p style={s.empty}>No hay referencias aún</p>}
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
  form:{display:'flex',flexDirection:'column',gap:'16px'},
  grid:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'16px'},
  field:{display:'flex',flexDirection:'column',gap:'6px'},
  label:{fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'var(--text-muted)',letterSpacing:'0.15em'},
  tableWrap:{background:'var(--bg-card)',border:'2px solid var(--border-dim)',boxShadow:'6px 6px 0 var(--border-dim)',borderRadius:'2px',overflow:'auto'},
  table:{width:'100%',borderCollapse:'collapse'},
  th:{padding:'12px 16px',textAlign:'left',fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'var(--accent)',letterSpacing:'0.12em',borderBottom:'2px solid var(--border-dim)',background:'#0d0f13'},
  tr:{borderBottom:'1px solid var(--border-dim)'},
  td:{padding:'12px 16px',color:'var(--text-secondary)',fontSize:'0.88rem'},
  tdMono:{padding:'12px 16px',color:'var(--text)',fontFamily:'var(--font-mono)',fontSize:'0.8rem'},
  badge:{border:'1px solid var(--border-dim)',padding:'2px 8px',fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'var(--text-secondary)',borderRadius:'2px'},
  acciones:{display:'flex',gap:'8px'},
  btnEdit:{background:'transparent',border:'2px solid var(--accent)',color:'var(--accent)',padding:'4px 10px',fontFamily:'var(--font-mono)',fontSize:'0.65rem',fontWeight:'700',borderRadius:'2px',boxShadow:'2px 2px 0 var(--accent)',cursor:'pointer'},
  btnDel:{background:'transparent',border:'2px solid var(--danger)',color:'var(--danger)',padding:'4px 10px',fontFamily:'var(--font-mono)',fontSize:'0.65rem',fontWeight:'700',borderRadius:'2px',boxShadow:'2px 2px 0 var(--danger)',cursor:'pointer'},
  empty:{textAlign:'center',padding:'40px',color:'var(--text-muted)',fontFamily:'var(--font-mono)',fontSize:'0.8rem'},
};

export default Referencias;
