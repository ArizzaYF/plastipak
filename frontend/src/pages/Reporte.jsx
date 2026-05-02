import { useState } from 'react';
import api from '../services/api';

const Reporte = () => {
  const [reporte, setReporte] = useState(null);
  const [form, setForm] = useState({ fecha:'', turno:'manana' });
  const [loading, setLoading] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.get(`/reportes/turno?fecha=${form.fecha}&turno=${form.turno}`);
      setReporte(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const totalBolsas = reporte?.reporte?.reduce((acc, r) => acc + (r.cantidadBolsas || 0), 0) || 0;
  const totalDesperdicios = reporte?.reporte?.reduce((acc, r) => acc + (r.pesoDesperdicios || 0), 0) || 0;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Reporte por Turno</h2>
      <form onSubmit={handleBuscar} style={styles.form}>
        <div style={styles.grid2}>
          <div style={styles.field}>
            <label style={styles.label}>Fecha</label>
            <input type="date" value={form.fecha} onChange={e => setForm({...form,fecha:e.target.value})} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Turno</label>
            <select value={form.turno} onChange={e => setForm({...form,turno:e.target.value})}>
              <option value="manana">Mañana</option>
              <option value="tarde">Tarde</option>
              <option value="noche">Noche</option>
            </select>
          </div>
        </div>
        <button type="submit" style={styles.btnPrimary}>{loading ? 'Cargando...' : '🔍 Generar Reporte'}</button>
      </form>
      {reporte && (
        <>
          <div style={styles.resumen}>
            <div style={styles.stat}><span style={styles.statNum}>{reporte.reporte?.length}</span><span style={styles.statLabel}>Registros</span></div>
            <div style={styles.stat}><span style={styles.statNum}>{totalBolsas.toLocaleString()}</span><span style={styles.statLabel}>Bolsas Producidas</span></div>
            <div style={styles.stat}><span style={styles.statNum}>{totalDesperdicios} kg</span><span style={styles.statLabel}>Desperdicios</span></div>
          </div>
          <div style={styles.tabla}>
            <table style={styles.table}>
              <thead>
                <tr>{['Selladora','Operario','Referencia','Rollo','Inicio','Fin','Bolsas','Desperdicio'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {reporte.reporte?.map((r, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.td}>S{r.selladora}</td>
                    <td style={styles.td}>{r.operario || '-'}</td>
                    <td style={styles.td}>{r.referencia || '-'}</td>
                    <td style={styles.td}>{r.numeroRollo}</td>
                    <td style={styles.td}>{r.horaInicio ? new Date(r.horaInicio).toLocaleTimeString() : '-'}</td>
                    <td style={styles.td}>{r.horaFin ? new Date(r.horaFin).toLocaleTimeString() : '-'}</td>
                    <td style={styles.td}>{r.cantidadBolsas ?? '-'}</td>
                    <td style={styles.td}>{r.pesoDesperdicios ?? '-'} kg</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reporte.reporte?.length === 0 && <p style={styles.empty}>No hay registros para este turno</p>}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container:{padding:'40px'}, title:{color:'#ccd6f6',fontSize:'1.5rem',marginBottom:'24px'},
  form:{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'24px',marginBottom:'32px',display:'flex',flexDirection:'column',gap:'16px'},
  grid2:{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'16px'},
  field:{display:'flex',flexDirection:'column',gap:'6px'}, label:{fontSize:'0.8rem',color:'#8892b0'},
  btnPrimary:{background:'#e94560',color:'#fff',border:'none',padding:'10px 20px',borderRadius:'8px',fontWeight:'bold',alignSelf:'flex-start'},
  resumen:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px',marginBottom:'24px'},
  stat:{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'20px',display:'flex',flexDirection:'column',alignItems:'center',gap:'8px'},
  statNum:{color:'#e94560',fontSize:'1.8rem',fontWeight:'bold'},
  statLabel:{color:'#8892b0',fontSize:'0.85rem'},
  tabla:{background:'rgba(255,255,255,0.03)',borderRadius:'12px',overflow:'auto'},
  table:{width:'100%',borderCollapse:'collapse'}, th:{padding:'12px 16px',textAlign:'left',color:'#e94560',fontSize:'0.85rem',borderBottom:'1px solid rgba(255,255,255,0.1)'},
  tr:{borderBottom:'1px solid rgba(255,255,255,0.05)'}, td:{padding:'12px 16px',color:'#a8b2d8',fontSize:'0.9rem'},
  empty:{textAlign:'center',padding:'40px',color:'#8892b0'}
};

export default Reporte;
