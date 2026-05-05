import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ referencias: 0, pedidos: 0, planillas: 0, registros: 0 });

  useEffect(() => {
    const cargar = async () => {
      try {
        const [r, p, pl, reg] = await Promise.all([
          api.get('/referencias'),
          api.get('/pedidos'),
          api.get('/planillas'),
          api.get('/registros'),
        ]);
        setStats({
          referencias: r.data.length,
          pedidos: p.data.length,
          planillas: pl.data.length,
          registros: reg.data.length,
        });
      } catch {}
    };
    cargar();
  }, []);

  const selladoras = [1,2,3,4,5];
  const [registros, setRegistros] = useState([]);
  useEffect(() => {
    api.get('/registros').then(r => setRegistros(r.data)).catch(()=>{});
  }, []);

  const estadoSelladora = (n) => {
    const activo = registros.find(r => r.selladora === n && r.estado === 'en_proceso');
    return activo ? { label: 'EN PROCESO', color: '#f59e0b', dot: '#f59e0b' } : { label: 'DISPONIBLE', color: '#10b981', dot: '#10b981' };
  };

  const acciones = {
    vendedor: [
      { label: 'Ver Referencias', path: '/referencias', icon: '▦' },
      { label: 'Crear Pedido', path: '/pedidos', icon: '＋' },
    ],
    jefe_produccion: [
      { label: 'Gestionar Planillas', path: '/planillas', icon: '▤' },
      { label: 'Ver Reportes', path: '/reporte', icon: '▣' },
      { label: 'Ver Referencias', path: '/referencias', icon: '▦' },
    ],
    operario: [
      { label: 'Ir a Registro', path: '/registro', icon: '▶' },
    ],
  };

  const links = acciones[usuario?.rol] || [];

  return (
    <div style={s.page}>

      {/* HEADER */}
      <div style={s.header}>
        <div>
          <p style={s.tag}>// {usuario?.rol?.replace('_',' ').toUpperCase()}</p>
          <h1 style={s.title}>Bienvenido, <span style={s.nameAccent}>{usuario?.nombre}</span></h1>
        </div>
        <div style={s.onlineBadge}>
          <span style={s.onlineDot}/>
          <span style={s.onlineText}>SISTEMA ACTIVO</span>
        </div>
      </div>

      {/* STATS */}
      <div style={s.statsRow}>
        {[
          { label: 'REFERENCIAS', value: stats.referencias, color: '#06b6d4' },
          { label: 'PEDIDOS', value: stats.pedidos, color: '#f59e0b' },
          { label: 'PLANILLAS', value: stats.planillas, color: '#a78bfa' },
          { label: 'REGISTROS HOY', value: stats.registros, color: '#10b981' },
        ].map(st => (
          <div key={st.label} style={s.statCard}>
            <span style={{...s.statValue, color: st.color}}>{st.value}</span>
            <span style={s.statLabel}>{st.label}</span>
          </div>
        ))}
      </div>

      <div style={s.bottom}>
        {/* SELLADORAS */}
        <div style={s.selladoresWrap}>
          <p style={s.sectionTag}>// ESTADO DE SELLADORAS</p>
          <div style={s.selladoras}>
            {selladoras.map(n => {
              const est = estadoSelladora(n);
              return (
                <div key={n} style={s.selladora}>
                  <span style={s.selladoraN}>{n}</span>
                  <span style={s.selladoraLabel}>SELLADORA</span>
                  <div style={s.selladoraStatus}>
                    <span style={{...s.dot, background: est.dot}}/>
                    <span style={{...s.statusText, color: est.color}}>{est.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACCIONES RÁPIDAS */}
        <div style={s.accionesWrap}>
          <p style={s.sectionTag}>// ACCIONES RÁPIDAS</p>
          <div style={s.acciones}>
            {links.map(l => (
              <button key={l.path} onClick={() => navigate(l.path)} style={s.accionBtn}>
                <span style={s.accionIcon}>{l.icon}</span>
                <span style={s.accionLabel}>{l.label}</span>
                <span style={s.accionArrow}>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

const s = {
  page: { padding: '40px', maxWidth: '1100px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', paddingBottom: '28px', borderBottom: '1px solid #1e2a3a' },
  tag: { fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#f59e0b', letterSpacing: '0.15em', marginBottom: '8px' },
  title: { fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: '700', color: '#e2e8f0', letterSpacing: '0.04em' },
  nameAccent: { color: '#f59e0b' },
  onlineBadge: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: '1px solid #1e2a3a', borderRadius: '3px' },
  onlineDot: { width: '7px', height: '7px', background: '#10b981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 6px #10b981' },
  onlineText: { fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#94a3b8', letterSpacing: '0.12em' },

  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '36px' },
  statCard: { background: '#141920', border: '1px solid #1e2a3a', borderRadius: '4px', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '6px' },
  statValue: { fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: '700', lineHeight: 1 },
  statLabel: { fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#64748b', letterSpacing: '0.15em' },

  bottom: { display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'start' },

  selladoresWrap: {},
  sectionTag: { fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#64748b', letterSpacing: '0.15em', marginBottom: '14px' },
  selladoras: { display: 'flex', gap: '10px' },
  selladora: { flex: 1, background: '#141920', border: '1px solid #1e2a3a', borderRadius: '4px', padding: '18px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  selladoraN: { fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: '700', color: '#e2e8f0', lineHeight: 1 },
  selladoraLabel: { fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#334155', letterSpacing: '0.15em' },
  selladoraStatus: { display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' },
  dot: { width: '5px', height: '5px', borderRadius: '50%', display: 'inline-block' },
  statusText: { fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em' },

  accionesWrap: { minWidth: '220px' },
  acciones: { display: 'flex', flexDirection: 'column', gap: '8px' },
  accionBtn: { display: 'flex', alignItems: 'center', gap: '12px', background: '#141920', border: '1px solid #1e2a3a', borderRadius: '4px', padding: '14px 18px', color: '#e2e8f0', fontSize: '0.9rem', fontFamily: 'var(--font-display)', letterSpacing: '0.06em', transition: 'border-color 0.2s', width: '100%', textAlign: 'left' },
  accionIcon: { color: '#f59e0b', fontSize: '1rem', width: '20px' },
  accionLabel: { flex: 1, fontSize: '0.9rem' },
  accionArrow: { color: '#334155', fontSize: '0.9rem' },
};

export default Dashboard;
