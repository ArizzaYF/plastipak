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
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
    }
    setLoading(false);
  };

  return (
    <div style={s.wrap}>
      <div style={s.left}>
        <div style={s.brand}>
          <div style={s.logoBox}>
            <span style={s.logoIcon}>◈</span>
          </div>
          <h1 style={s.brandName}>PLASTI<span style={s.brandAccent}>PAK</span></h1>
          <p style={s.brandSub}>SISTEMA DE GESTIÓN DE PRODUCCIÓN</p>
        </div>
        <div style={s.stats}>
          {[['5','SELLADORAS'],['150K','REFERENCIAS'],['3','TURNOS']].map(([n,l]) => (
            <div key={l} style={s.stat}>
              <span style={s.statN}>{n}</span>
              <span style={s.statL}>{l}</span>
            </div>
          ))}
        </div>
        <div style={s.grid}>{Array(24).fill(0).map((_,i) => <div key={i} style={s.dot}/>)}</div>
      </div>
      <div style={s.right}>
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardTag}>// ACCESO AL SISTEMA</span>
            <h2 style={s.cardTitle}>INICIAR SESIÓN</h2>
          </div>
          {error && <div style={s.error}>⚠ {error}</div>}
          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>CORREO ELECTRÓNICO</label>
              <input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="usuario@plastipak.com" required />
            </div>
            <div style={s.field}>
              <label style={s.label}>CONTRASEÑA</label>
              <input type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} placeholder="••••••••" required />
            </div>
            <button type="submit" style={s.btn} disabled={loading}>
              {loading ? 'AUTENTICANDO...' : 'INGRESAR →'}
            </button>
          </form>
          <div style={s.footer}>
            <span style={s.footerDot}/> SISTEMA ACTIVO
          </div>
        </div>
      </div>
    </div>
  );
};

const s = {
  wrap:{display:'flex',minHeight:'100vh'},
  left:{flex:1,background:'var(--bg-panel)',borderRight:'1px solid var(--border)',padding:'60px',display:'flex',flexDirection:'column',justifyContent:'space-between',position:'relative',overflow:'hidden'},
  brand:{},
  logoBox:{width:'56px',height:'56px',border:'2px solid var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'24px',transform:'rotate(45deg)'},
  logoIcon:{transform:'rotate(-45deg)',color:'var(--accent)',fontSize:'1.4rem'},
  brandName:{fontFamily:'var(--font-display)',fontSize:'3rem',fontWeight:'700',letterSpacing:'0.15em',color:'var(--text-primary)',lineHeight:1},
  brandAccent:{color:'var(--accent)'},
  brandSub:{fontFamily:'var(--font-mono)',fontSize:'0.7rem',color:'var(--text-muted)',letterSpacing:'0.2em',marginTop:'12px'},
  stats:{display:'flex',gap:'40px'},
  stat:{display:'flex',flexDirection:'column',gap:'4px'},
  statN:{fontFamily:'var(--font-display)',fontSize:'2rem',fontWeight:'700',color:'var(--accent)'},
  statL:{fontFamily:'var(--font-mono)',fontSize:'0.65rem',color:'var(--text-muted)',letterSpacing:'0.15em'},
  grid:{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'8px',opacity:0.3},
  dot:{width:'4px',height:'4px',background:'var(--accent)',borderRadius:'50%'},
  right:{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'40px'},
  card:{width:'100%',maxWidth:'420px'},
  cardHeader:{marginBottom:'32px'},
  cardTag:{fontFamily:'var(--font-mono)',fontSize:'0.7rem',color:'var(--accent)',letterSpacing:'0.1em'},
  cardTitle:{fontFamily:'var(--font-display)',fontSize:'1.8rem',fontWeight:'700',letterSpacing:'0.1em',marginTop:'8px'},
  error:{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',color:'#fca5a5',padding:'12px 16px',borderRadius:'3px',marginBottom:'24px',fontFamily:'var(--font-mono)',fontSize:'0.8rem'},
  form:{display:'flex',flexDirection:'column',gap:'20px'},
  field:{display:'flex',flexDirection:'column',gap:'8px'},
  label:{fontFamily:'var(--font-mono)',fontSize:'0.68rem',color:'var(--text-muted)',letterSpacing:'0.15em'},
  btn:{background:'var(--accent)',color:'#000',border:'none',padding:'14px',fontSize:'1rem',fontWeight:'700',borderRadius:'3px',marginTop:'8px',transition:'opacity 0.2s'},
  footer:{display:'flex',alignItems:'center',gap:'8px',marginTop:'32px',fontFamily:'var(--font-mono)',fontSize:'0.7rem',color:'var(--text-muted)'},
  footerDot:{width:'6px',height:'6px',background:'var(--success)',borderRadius:'50%',display:'inline-block'}
};

export default Login;
