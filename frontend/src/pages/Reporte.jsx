import { useState } from 'react';
import api from '../services/api';

const fmtFecha = (d) => d ? new Date(d).toLocaleString('es-CO', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—';
const hoy = () => new Date().toISOString().split('T')[0];

const Reporte = () => {
  const [reporte, setReporte] = useState(null);
  const [form, setForm] = useState({ fecha: hoy(), turno:'manana' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!form.fecha) { setError('Debes seleccionar una fecha válida'); return; }
    setError('');
    setLoading(true);
    try {
      const { data } = await api.get(`/reportes/turno?fecha=${form.fecha}&turno=${form.turno}`);
      setReporte(data);
    } catch(err) { setError('Error al generar el reporte'); }
    setLoading(false);
  };

  const totalBolsas = reporte?.reporte?.reduce((a,r) => a + (r.cantidadBolsas || 0), 0) || 0;
  const totalDesp = reporte?.reporte?.reduce((a,r) => a + (r.pesoDesperdicios || 0), 0) || 0;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <span style={s.tag}>// JEFE DE PRODUCCIÓN</span>
          <h2 style={s.title}>REPORTE POR TURNO</h2>
          <div style={s.underline}/>
        </div>
      </div>

      <div style={s.formCard}>
        <h3 style={s.formTitle}>PARÁMETROS DEL REPORTE</h3>
        <form onSubmit={handleBuscar} style={s.form}>
          <div style={s.grid2}>
            <div style={s.field}>
              <label style={s.label}>FECHA (selecciona el día a consultar)</label>
              <input
                type="date"
                value={form.fecha}
                max={hoy()}
                onChange={e => setForm({...form, fecha:e.target.value})}
                required
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>TURNO</label>
              <select value={form.turno} onChange={e => setForm({...form, turno:e.target.value})}>
                <option value="manana">Mañana</option>
                <option value="tarde">Tarde</option>
                <option value="noche">Noche</option>
              </select>
            </div>
          </div>
          {error && <div style={s.error}>⚠ {error}</div>}
          <button type="submit" className="neo-btn-primary" style={{alignSelf:'flex-start'}} disabled={loading}>
            {loading ? 'GENERANDO...' : '▶ GENERAR REPORTE'}
          </button>
        </form>
      </div>

      {reporte && (
        <>
          <div style={s.statsRow}>
            {[
              {label:'REGISTROS TOTALES', value: reporte.reporte?.length, color:'var(--accent)'},
              {label:'BOLSAS PRODUCIDAS', value: totalBolsas.toLocaleString(), color:'var(--success)'},
              {label:'TOTAL DESPERDICIOS', value: `${totalDesp} kg`, color:'var(--warning)'},
            ].map(st => (
              <div key={st.label} style={s.statCard}>
                <span style={{...s.statValue, color:st.color}}>{st.value}</span>
                <span style={s.statLabel}>{st.label}</span>
              </div>
            ))}
          </div>

          <span style={s.sectionTag}>// DETALLE POR SELLADORA Y OPERARIO</span>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>{['SELLADORA','OPERARIO','REFERENCIA','ROLLO','INICIO PRODUCCIÓN','FIN PRODUCCIÓN','BOLSAS','DESPERDICIO'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {reporte.reporte?.length === 0 && (
                  <tr><td colSpan={8} style={s.empty}>No hay registros para este turno y fecha</td></tr>
                )}
                {reporte.reporte?.map((r, i) => (
                  <tr key={i} style={s.tr}>
                    <td style={s.tdAccent}>SELLADORA {r.selladora}</td>
                    <td style={s.td}>{r.operario || '—'}</td>
                    <td style={s.tdMono}>{r.referencia || '—'}</td>
                    <td style={s.tdMono}>{r.numeroRollo}</td>
                    <td style={s.td}>{fmtFecha(r.horaInicio)}</td>
                    <td style={s.td}>{fmtFecha(r.horaFin)}</td>
                    <td style={s.tdMono}>{r.cantidadBolsas ?? '—'}</td>
                    <td style={s.tdMono}>{r.pesoDesperdicios != null ? `${r.pesoDesperdicios} kg` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

const s = {
  page:{padding:'40px',maxWidth:'1400px'},
  header:{marginBottom:'32px'},
  tag:{fontFamily:'var(--font-mono)',fontSize:'0.68rem',color:'var(--accent)',letterSpacing:'0.15em',display:'block',marginBottom:'6px'},
  title:{fontFamily:'var(--font-display)',fontSize:'1.8rem',fontWeight:'700',letterSpacing:'0.08em'},
  underline:{height:'3px',width:'40px',background:'var(--accent)',marginTop:'8px'},
  formCard:{background:'var(--bg-card)',border:'2px solid var(--border-dim)',boxShadow:'6px 6px 0 var(--border-dim)',padding:'28px',marginBottom:'32px',borderRadius:'2px'},
  formTitle:{fontFamily:'var(--font-mono)',fontSize:'0.8rem',color:'var(--accent)',letterSpacing:'0.15em',marginBottom:'20px'},
  form:{display:'flex',flexDirection:'column',gap:'20px'},
  grid2:{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'16px'},
  field:{display:'flex',flexDirection:'column',gap:'6px'},
  label:{fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'var(--text-muted)',letterSpacing:'0.15em'},
  error:{padding:'10px 14px',border:'2px solid var(--danger)',background:'rgba(220,38,38,0.1)',color:'#fca5a5',fontFamily:'var(--font-mono)',fontSize:'0.78rem',borderRadius:'2px'},
  statsRow:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px',marginBottom:'32px'},
  statCard:{background:'var(--bg-card)',border:'2px solid var(--border-dim)',boxShadow:'5px 5px 0 var(--border-dim)',padding:'24px',display:'flex',flexDirection:'column',gap:'8px',borderRadius:'2px'},
  statValue:{fontFamily:'var(--font-display)',fontSize:'2.2rem',fontWeight:'700',lineHeight:1},
  statLabel:{fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'var(--text-muted)',letterSpacing:'0.15em'},
  sectionTag:{fontFamily:'var(--font-mono)',fontSize:'0.68rem',color:'var(--text-muted)',letterSpacing:'0.15em',display:'block',marginBottom:'14px'},
  tableWrap:{background:'var(--bg-card)',border:'2px solid var(--border-dim)',boxShadow:'6px 6px 0 var(--border-dim)',borderRadius:'2px',overflow:'auto'},
  table:{width:'100%',borderCollapse:'collapse'},
  th:{padding:'12px 16px',textAlign:'left',fontFamily:'var(--font-mono)',fontSize:'0.62rem',color:'var(--accent)',letterSpacing:'0.1em',borderBottom:'2px solid var(--border-dim)',background:'#0d0f13',whiteSpace:'nowrap'},
  tr:{borderBottom:'1px solid var(--border-dim)'},
  td:{padding:'12px 16px',color:'var(--text-secondary)',fontSize:'0.82rem',whiteSpace:'nowrap'},
  tdMono:{padding:'12px 16px',color:'var(--text)',fontFamily:'var(--font-mono)',fontSize:'0.78rem',whiteSpace:'nowrap'},
  tdAccent:{padding:'12px 16px',color:'var(--accent)',fontFamily:'var(--font-mono)',fontSize:'0.78rem',fontWeight:'700',whiteSpace:'nowrap'},
  empty:{textAlign:'center',padding:'40px',color:'var(--text-muted)',fontFamily:'var(--font-mono)',fontSize:'0.8rem'},
};

export default Reporte;
