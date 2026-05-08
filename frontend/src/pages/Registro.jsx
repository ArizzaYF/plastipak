import { useState, useEffect } from 'react';
import api from '../services/api';

const fmtFecha = (d) => d ? new Date(d).toLocaleString('es-CO', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—';

const Modal = ({ registro, cantidadPedida, onConfirm, onCancel }) => {
  const [bolsas, setBolsas] = useState('');
  const [desperdicio, setDesperdicio] = useState('');
  const [error, setError] = useState('');

  const handleChangeBolsas = (val) => {
    const limpio = val.replace(/[^0-9]/g, '');
    if (cantidadPedida && parseInt(limpio) > cantidadPedida) {
      setError(`No puedes reportar más bolsas de las pedidas (máximo ${cantidadPedida})`);
      setBolsas(String(cantidadPedida));
      return;
    }
    setError('');
    setBolsas(limpio);
  };

  const handleConfirm = () => {
    const b = parseInt(bolsas);
    const d = parseFloat(desperdicio);
    if (!bolsas || isNaN(b) || b <= 0) { setError('Las bolsas deben ser un número entero mayor a 0'); return; }
    if (cantidadPedida && b > cantidadPedida) { setError(`Máximo ${cantidadPedida} bolsas`); return; }
    if (desperdicio === '' || isNaN(d) || d < 0) { setError('El desperdicio debe ser 0 o mayor'); return; }
    onConfirm(b, d);
  };

  return (
    <div style={m.overlay}>
      <div style={m.modal}>
        <h3 style={m.title}>FINALIZAR PRODUCCIÓN</h3>
        <div style={m.info}>
          <p style={m.infoLine}><span style={m.infoKey}>SELLADORA</span><span style={m.infoVal}>{registro.selladora}</span></p>
          <p style={m.infoLine}><span style={m.infoKey}>REFERENCIA</span><span style={m.infoVal}>{registro.referencia?.codigo}</span></p>
          <p style={m.infoLine}><span style={m.infoKey}>ROLLO</span><span style={m.infoVal}>{registro.numeroRollo}</span></p>
          {cantidadPedida && <p style={m.infoLine}><span style={m.infoKey}>PEDIDO SOLICITÓ</span><strong style={{color:'var(--accent)'}}>{cantidadPedida} bolsas</strong></p>}
        </div>
        <div style={m.fields}>
          <div style={m.field}>
            <label style={m.label}>BOLSAS PRODUCIDAS {cantidadPedida ? `(máximo ${cantidadPedida})` : '(solo números enteros)'}</label>
            <input
              type="number" min="1" step="1"
              max={cantidadPedida || undefined}
              value={bolsas}
              onChange={e => handleChangeBolsas(e.target.value)}
              placeholder={cantidadPedida ? `Máximo ${cantidadPedida}` : 'Ej: 850'}
              style={m.input}
              autoFocus
            />
            {cantidadPedida && bolsas && parseInt(bolsas) <= cantidadPedida && (
              <span style={{...m.hint, color: parseInt(bolsas) === cantidadPedida ? 'var(--success)' : 'var(--warning)'}}>
                {parseInt(bolsas) === cantidadPedida ? '✓ Pedido completado exactamente' : `⚠ Faltan ${cantidadPedida - parseInt(bolsas)} bolsas del pedido`}
              </span>
            )}
          </div>
          <div style={m.field}>
            <label style={m.label}>PESO DEL DESPERDICIO en kg (permite decimales, ej: 1.5)</label>
            <input
              type="number" min="0" step="0.01"
              value={desperdicio}
              onChange={e => setDesperdicio(e.target.value)}
              placeholder="Ej: 1.5"
              style={m.input}
            />
          </div>
        </div>
        {error && <div style={m.error}>⚠ {error}</div>}
        <div style={m.btns}>
          <button onClick={onCancel} style={m.btnCancel}>CANCELAR</button>
          <button onClick={handleConfirm} style={m.btnConfirm}>CONFIRMAR FINALIZACIÓN</button>
        </div>
      </div>
    </div>
  );
};

const m = {
  overlay:{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000},
  modal:{background:'var(--bg-card)',border:'2px solid var(--accent)',boxShadow:'8px 8px 0 var(--accent)',padding:'32px',width:'100%',maxWidth:'480px',borderRadius:'2px'},
  title:{fontFamily:'var(--font-display)',fontSize:'1.2rem',fontWeight:'700',color:'var(--accent)',letterSpacing:'0.1em',marginBottom:'20px'},
  info:{background:'#0d0f13',border:'1px solid var(--border-dim)',padding:'16px',borderRadius:'2px',marginBottom:'20px',display:'flex',flexDirection:'column',gap:'8px'},
  infoLine:{fontFamily:'var(--font-mono)',fontSize:'0.78rem',display:'flex',gap:'12px',alignItems:'center'},
  infoKey:{color:'#ffffff',minWidth:'130px',fontWeight:'600'},
  infoVal:{color:'#ffffff'},
  fields:{display:'flex',flexDirection:'column',gap:'16px',marginBottom:'16px'},
  field:{display:'flex',flexDirection:'column',gap:'6px'},
  label:{fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'#ffffff',letterSpacing:'0.1em',fontWeight:'600'},
  input:{fontFamily:'var(--font-mono)',fontSize:'0.9rem',background:'#0d0f13',border:'2px solid var(--border-dim)',color:'#ffffff',padding:'10px 14px',borderRadius:'2px',width:'100%'},
  hint:{fontFamily:'var(--font-mono)',fontSize:'0.7rem',marginTop:'4px'},
  error:{background:'rgba(220,38,38,0.1)',border:'2px solid var(--danger)',color:'#fca5a5',padding:'10px 14px',fontFamily:'var(--font-mono)',fontSize:'0.78rem',borderRadius:'2px',marginBottom:'16px'},
  btns:{display:'flex',gap:'12px',justifyContent:'flex-end'},
  btnCancel:{background:'transparent',border:'2px solid var(--border-dim)',color:'#ffffff',padding:'10px 20px',fontFamily:'var(--font-mono)',fontSize:'0.75rem',fontWeight:'700',borderRadius:'2px',cursor:'pointer'},
  btnConfirm:{background:'var(--accent)',border:'2px solid #000',color:'#000',padding:'10px 20px',fontFamily:'var(--font-display)',fontSize:'0.9rem',fontWeight:'700',borderRadius:'2px',boxShadow:'3px 3px 0 #000',cursor:'pointer'},
};

const Registro = () => {
  const [planillas, setPlanillas] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [msg, setMsg] = useState('');
  const [planillaSeleccionada, setPlanillaSeleccionada] = useState(null);
  const [referenciaSeleccionada, setReferenciaSeleccionada] = useState('');
  const [cantidadPedida, setCantidadPedida] = useState(null);
  const [numeroRollo, setNumeroRollo] = useState('');
  const [selladora, setSelladora] = useState('');
  const [modalRegistro, setModalRegistro] = useState(null);
  const [modalCantidadPedida, setModalCantidadPedida] = useState(null);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    const [pl, reg] = await Promise.all([api.get('/planillas'), api.get('/registros')]);
    setPlanillas(pl.data.filter(p => p.estado === 'pendiente' || p.estado === 'en_proceso'));
    setRegistros(reg.data);
  };

  const handleSeleccionarPlanilla = (id) => {
    const p = planillas.find(x => x._id === id);
    setPlanillaSeleccionada(p || null);
    setReferenciaSeleccionada('');
    setCantidadPedida(null);
    setSelladora('');
    setNumeroRollo('');
  };

  const getRefsDisponibles = () => {
    if (!planillaSeleccionada) return [];
    const refs = new Map();
    planillaSeleccionada.pedidos?.forEach(ped => {
      ped.items?.forEach(item => {
        const ref = item.referencia;
        if (ref && ref._id) {
          const yaEnProceso = registros.some(r =>
            (r.referencia?._id || r.referencia) === ref._id &&
            (r.planilla === planillaSeleccionada._id || r.planilla?._id === planillaSeleccionada._id)
          );
          if (!yaEnProceso) {
            refs.set(ref._id, { _id: ref._id, codigo: ref.codigo, nombre: ref.nombre, cantidad: item.cantidad });
          }
        }
      });
    });
    return Array.from(refs.values());
  };

  const getSelladrasDisponibles = () => {
    const ocupadas = new Set(registros.filter(r => r.estado === 'en_proceso').map(r => r.selladora));
    return [1,2,3,4,5].filter(n => !ocupadas.has(n));
  };

  const handleSeleccionarReferencia = (refId) => {
    setReferenciaSeleccionada(refId);
    if (!planillaSeleccionada) return;
    let total = 0;
    planillaSeleccionada.pedidos?.forEach(ped => {
      ped.items?.forEach(item => {
        if ((item.referencia?._id || item.referencia) === refId) total += Number(item.cantidad);
      });
    });
    setCantidadPedida(total > 0 ? total : null);
  };

  const handleIniciar = async (e) => {
    e.preventDefault();
    if (!planillaSeleccionada || !referenciaSeleccionada || !numeroRollo || !selladora) {
      setMsg('❌ Completa todos los campos'); return;
    }
    try {
      await api.post('/registros', { planilla: planillaSeleccionada._id, selladora: Number(selladora), referencia: referenciaSeleccionada, numeroRollo });
      setMsg('✅ Producción iniciada correctamente');
      setPlanillaSeleccionada(null); setReferenciaSeleccionada(''); setCantidadPedida(null); setNumeroRollo(''); setSelladora('');
      cargar();
    } catch(err) { setMsg('❌ ' + (err.response?.data?.mensaje || 'Error')); }
  };

  const abrirModal = (registro) => {
    let total = 0;
    planillas.forEach(p => p.pedidos?.forEach(ped => ped.items?.forEach(item => {
      if ((item.referencia?._id || item.referencia) === (registro.referencia?._id || registro.referencia)) total += Number(item.cantidad);
    })));
    setModalCantidadPedida(total > 0 ? total : null);
    setModalRegistro(registro);
  };

  const handleFinalizar = async (bolsas, desperdicio) => {
    try {
      await api.put(`/registros/${modalRegistro._id}/finalizar`, { cantidadBolsas: bolsas, pesoDesperdicios: desperdicio });
      setMsg('✅ Producción finalizada correctamente');
      setModalRegistro(null);
      cargar();
    } catch(err) { setMsg('❌ ' + (err.response?.data?.mensaje || 'Error')); }
  };

  const refsDisponibles = getRefsDisponibles();
  const selladrasDisponibles = getSelladrasDisponibles();

  return (
    <div style={s.page}>
      {modalRegistro && <Modal registro={modalRegistro} cantidadPedida={modalCantidadPedida} onConfirm={handleFinalizar} onCancel={() => setModalRegistro(null)}/>}

      <div style={s.header}>
        <div>
          <span style={s.tag}>// OPERARIO</span>
          <h2 style={s.title}>REGISTRO DE SELLADO</h2>
          <div style={s.underline}/>
        </div>
      </div>

      {msg && <div style={s.msg}>{msg}</div>}

      <div style={s.formCard}>
        <h3 style={s.formTitle}>INICIAR NUEVA PRODUCCIÓN</h3>
        <form onSubmit={handleIniciar} style={s.form}>
          <div style={s.step}>
            <span style={s.stepNum}>01</span>
            <div style={s.stepContent}>
              <label style={s.label}>SELECCIONA TU PLANILLA ASIGNADA</label>
              <select value={planillaSeleccionada?._id || ''} onChange={e => handleSeleccionarPlanilla(e.target.value)} required>
                <option value="">Seleccionar planilla...</option>
                {planillas.map(p => (
                  <option key={p._id} value={p._id}>
                    Selladora {p.selladora} — {p.turno === 'manana' ? 'Mañana' : p.turno === 'tarde' ? 'Tarde' : 'Noche'} — {new Date(p.fecha).toLocaleDateString()} — {p.pedidos?.length} pedido(s)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {planillaSeleccionada && (
            <div style={s.step}>
              <span style={s.stepNum}>02</span>
              <div style={s.stepContent}>
                <label style={s.label}>REFERENCIA A PRODUCIR (solo pendientes del pedido)</label>
                {refsDisponibles.length === 0
                  ? <div style={s.infoBox}>✓ Todas las referencias de esta planilla ya están en producción o finalizadas.</div>
                  : (
                    <select value={referenciaSeleccionada} onChange={e => handleSeleccionarReferencia(e.target.value)} required>
                      <option value="">Seleccionar referencia...</option>
                      {refsDisponibles.map(r => (
                        <option key={r._id} value={r._id}>{r.codigo} — {r.nombre} ({r.cantidad} unidades pedidas)</option>
                      ))}
                    </select>
                  )
                }
                {cantidadPedida && (
                  <div style={s.infoBox}>📦 El pedido requiere <strong style={{color:'var(--accent)'}}>{cantidadPedida} bolsas</strong> de esta referencia</div>
                )}
              </div>
            </div>
          )}

          {referenciaSeleccionada && (
            <div style={s.step}>
              <span style={s.stepNum}>03</span>
              <div style={{...s.stepContent,...s.grid2}}>
                <div style={s.field}>
                  <label style={s.label}>SELLADORA DISPONIBLE</label>
                  {selladrasDisponibles.length === 0
                    ? <div style={s.warning}>⚠ Todas las selladoras están ocupadas</div>
                    : (
                      <select value={selladora} onChange={e => setSelladora(e.target.value)} required>
                        <option value="">Seleccionar...</option>
                        {selladrasDisponibles.map(n => <option key={n} value={n}>Selladora {n}</option>)}
                      </select>
                    )
                  }
                </div>
                <div style={s.field}>
                  <label style={s.label}>CÓDIGO DEL ROLLO</label>
                  <input value={numeroRollo} onChange={e => setNumeroRollo(e.target.value)} placeholder="Escanea o escribe el código" required/>
                </div>
              </div>
            </div>
          )}

          {referenciaSeleccionada && numeroRollo && selladora && (
            <button type="submit" className="neo-btn-primary" style={{alignSelf:'flex-start',marginTop:'8px'}}>▶ INICIAR PRODUCCIÓN</button>
          )}
        </form>
      </div>

      <div style={s.section}>
        <span style={s.sectionTag}>// HISTORIAL DE PRODUCCIÓN DEL TURNO</span>
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>{['SELLADORA','REFERENCIA','ROLLO','INICIO DE PRODUCCIÓN','FIN DE PRODUCCIÓN','BOLSAS','DESPERDICIO','ESTADO'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {registros.length === 0 && <tr><td colSpan={8} style={s.empty}>No hay registros aún</td></tr>}
              {registros.map(r => (
                <tr key={r._id} style={s.tr}>
                  <td style={s.tdAccent}>SELLADORA {r.selladora}</td>
                  <td style={s.tdMono}>{r.referencia?.codigo || '—'}</td>
                  <td style={s.tdMono}>{r.numeroRollo}</td>
                  <td style={s.td}>{fmtFecha(r.horaInicio)}</td>
                  <td style={s.td}>{fmtFecha(r.horaFin)}</td>
                  <td style={s.tdMono}>{r.cantidadBolsas ?? '—'}</td>
                  <td style={s.tdMono}>{r.pesoDesperdicios != null ? `${r.pesoDesperdicios} kg` : '—'}</td>
                  <td style={s.td}>
                    {r.estado === 'en_proceso'
                      ? <button onClick={() => abrirModal(r)} style={s.finBtn}>■ FINALIZAR</button>
                      : <span style={s.doneIcon}>✓ FINALIZADO</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const s = {
  page:{padding:'40px',maxWidth:'1400px'},
  header:{marginBottom:'32px'},
  tag:{fontFamily:'var(--font-mono)',fontSize:'0.68rem',color:'var(--accent)',letterSpacing:'0.15em',display:'block',marginBottom:'6px'},
  title:{fontFamily:'var(--font-display)',fontSize:'1.8rem',fontWeight:'700',letterSpacing:'0.08em',color:'#ffffff'},
  underline:{height:'3px',width:'40px',background:'var(--accent)',marginTop:'8px'},
  msg:{padding:'12px 16px',border:'2px solid var(--border-dim)',background:'var(--bg-card)',fontFamily:'var(--font-mono)',fontSize:'0.8rem',color:'#ffffff',marginBottom:'20px',borderRadius:'2px'},
  formCard:{background:'var(--bg-card)',border:'2px solid var(--border-dim)',boxShadow:'6px 6px 0 var(--border-dim)',padding:'28px',marginBottom:'32px',borderRadius:'2px'},
  formTitle:{fontFamily:'var(--font-mono)',fontSize:'0.8rem',color:'var(--accent)',letterSpacing:'0.15em',marginBottom:'24px'},
  form:{display:'flex',flexDirection:'column',gap:'20px'},
  step:{display:'flex',gap:'16px',alignItems:'flex-start'},
  stepNum:{fontFamily:'var(--font-mono)',fontSize:'1.4rem',fontWeight:'700',color:'var(--accent)',opacity:0.5,minWidth:'32px',marginTop:'20px'},
  stepContent:{flex:1,display:'flex',flexDirection:'column',gap:'8px'},
  grid2:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'},
  field:{display:'flex',flexDirection:'column',gap:'6px'},
  label:{fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'#ffffff',letterSpacing:'0.12em',fontWeight:'600'},
  infoBox:{background:'rgba(245,158,11,0.08)',border:'2px solid rgba(245,158,11,0.3)',borderRadius:'2px',padding:'12px 16px',fontFamily:'var(--font-mono)',fontSize:'0.78rem',color:'#ffffff',marginTop:'4px'},
  warning:{background:'rgba(220,38,38,0.08)',border:'2px solid rgba(220,38,38,0.3)',borderRadius:'2px',padding:'12px 16px',fontFamily:'var(--font-mono)',fontSize:'0.78rem',color:'#fca5a5'},
  section:{},
  sectionTag:{fontFamily:'var(--font-mono)',fontSize:'0.68rem',color:'#ffffff',letterSpacing:'0.15em',display:'block',marginBottom:'14px'},
  tableWrap:{background:'var(--bg-card)',border:'2px solid var(--border-dim)',boxShadow:'6px 6px 0 var(--border-dim)',borderRadius:'2px',overflow:'auto'},
  table:{width:'100%',borderCollapse:'collapse'},
  th:{padding:'12px 16px',textAlign:'left',fontFamily:'var(--font-mono)',fontSize:'0.62rem',color:'var(--accent)',letterSpacing:'0.1em',borderBottom:'2px solid var(--border-dim)',background:'#0d0f13',whiteSpace:'nowrap'},
  tr:{borderBottom:'1px solid var(--border-dim)'},
  td:{padding:'12px 16px',color:'#ffffff',fontSize:'0.82rem',whiteSpace:'nowrap'},
  tdMono:{padding:'12px 16px',color:'#ffffff',fontFamily:'var(--font-mono)',fontSize:'0.78rem',whiteSpace:'nowrap'},
  tdAccent:{padding:'12px 16px',color:'var(--accent)',fontFamily:'var(--font-mono)',fontSize:'0.78rem',fontWeight:'700',whiteSpace:'nowrap'},
  finBtn:{background:'transparent',border:'2px solid var(--warning)',color:'var(--warning)',padding:'4px 12px',fontFamily:'var(--font-mono)',fontSize:'0.65rem',fontWeight:'700',borderRadius:'2px',boxShadow:'2px 2px 0 var(--warning)',cursor:'pointer',whiteSpace:'nowrap'},
  doneIcon:{color:'var(--success)',fontFamily:'var(--font-mono)',fontSize:'0.72rem',fontWeight:'700'},
  empty:{textAlign:'center',padding:'40px',color:'#ffffff',fontFamily:'var(--font-mono)',fontSize:'0.8rem'},
};

export default Registro;
