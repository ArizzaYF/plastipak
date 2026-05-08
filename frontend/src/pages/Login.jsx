import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.usuario);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Credenciales inválidas');
    }
    setLoading(false);
  };

  return (
    <div style={s.wrap}>
      <div style={s.left}>
        <div style={s.logoWrap}>
          <div style={s.logoBox}>
            <span style={s.logoInner}>PP</span>
          </div>
          <div>
            <h1 style={s.brand}>PLASTI<span style={s.brandY}>PAK</span></h1>
            <p style={s.brandSub}>GESTIÓN DE PRODUCCIÓN</p>
          </div>
        </div>
        <div style={s.infoBlock}>
          <p style={s.infoLine}>◆ 5 selladoras monitoreadas</p>
          <p style={s.infoLine}>◆ 3 turnos por día</p>
          <p style={s.infoLine}>◆ Trazabilidad completa</p>
          <p style={s.infoLine}>◆ Reportes en tiempo real</p>
        </div>
        <div style={s.decorGrid}>
          {Array(16).fill(0).map((_, i) => (
            <div key={i} style={{
              ...s.decorCell,
              background: i % 5 === 0 ? 'var(--accent)' : 'var(--border-dim)'
            }}/>
          ))}
        </div>
      </div>

      <div style={s.right}>
        <div style={s.card}>
          <div style={s.cardTop}>
            <span style={s.tag}>// ACCESO AL SISTEMA</span>
            <h2 style={s.title}>INICIAR SESIÓN</h2>
            <div style={s.titleUnderline}/>
          </div>

          {error && (
            <div style={s.error}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>CORREO ELECTRÓNICO</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="usuario@plastipak.com"
                required
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>CONTRASEÑA</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="neo-btn-primary" style={s.btn} disabled={loading}>
              {loading ? 'AUTENTICANDO...' : 'INGRESAR →'}
            </button>
          </form>

          <div style={s.footer}>
            <span style={s.dot}/> SISTEMA ACTIVO
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  wrap: { display:'flex', minHeight:'100vh' },
  left: { width:'420px', background:'#0d0f13', borderRight:'2px solid var(--border-dim)', padding:'48px', display:'flex', flexDirection:'column', gap:'48px', flexShrink:0 },
  logoWrap: { display:'flex', alignItems:'center', gap:'16px' },
  logoBox: { width:'52px', height:'52px', background:'var(--accent)', border:'2px solid #000', boxShadow:'4px 4px 0 #000', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  logoInner: { fontFamily:'var(--font-mono)', fontWeight:'700', fontSize:'1rem', color:'#000' },
  brand: { fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:'700', letterSpacing:'0.1em', lineHeight:1 },
  brandY: { color:'var(--accent)' },
  brandSub: { fontFamily:'var(--font-mono)', fontSize:'0.6rem', color:'var(--text-muted)', letterSpacing:'0.2em', marginTop:'4px' },
  infoBlock: { display:'flex', flexDirection:'column', gap:'12px' },
  infoLine: { fontFamily:'var(--font-mono)', fontSize:'0.8rem', color:'var(--text-secondary)', letterSpacing:'0.05em' },
  decorGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'6px', marginTop:'auto' },
  decorCell: { height:'12px', borderRadius:'1px' },
  right: { flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px' },
  card: { width:'100%', maxWidth:'440px', background:'var(--bg-card)', border:'2px solid var(--border-dim)', borderRadius:'2px', boxShadow:'8px 8px 0 var(--border-dim)', padding:'40px' },
  cardTop: { marginBottom:'32px' },
  tag: { fontFamily:'var(--font-mono)', fontSize:'0.68rem', color:'var(--accent)', letterSpacing:'0.15em' },
  title: { fontFamily:'var(--font-display)', fontSize:'1.8rem', fontWeight:'700', letterSpacing:'0.08em', marginTop:'8px' },
  titleUnderline: { height:'3px', width:'48px', background:'var(--accent)', marginTop:'10px' },
  error: { display:'flex', alignItems:'center', gap:'8px', background:'rgba(220,38,38,0.1)', border:'2px solid var(--danger)', color:'#fca5a5', padding:'12px 16px', borderRadius:'2px', marginBottom:'24px', fontFamily:'var(--font-mono)', fontSize:'0.8rem' },
  form: { display:'flex', flexDirection:'column', gap:'20px' },
  field: { display:'flex', flexDirection:'column', gap:'8px' },
  label: { fontFamily:'var(--font-mono)', fontSize:'0.68rem', color:'var(--text-muted)', letterSpacing:'0.15em' },
  btn: { width:'100%', padding:'14px', fontSize:'1rem', marginTop:'8px' },
  footer: { display:'flex', alignItems:'center', gap:'8px', marginTop:'28px', fontFamily:'var(--font-mono)', fontSize:'0.68rem', color:'var(--text-muted)' },
  dot: { width:'7px', height:'7px', background:'var(--success)', borderRadius:'50%', display:'inline-block', boxShadow:'0 0 8px var(--success)' },
};

export default Login;
