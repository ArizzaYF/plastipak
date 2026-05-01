import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.usuario);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🏭 PlastiPak</h1>
        <p style={styles.subtitle}>Sistema de Gestión de Producción</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          </div>
          <button type="submit" style={styles.btn}>Ingresar</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#0f0f23' },
  card: { background:'rgba(255,255,255,0.05)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'16px', padding:'40px', width:'100%', maxWidth:'400px' },
  title: { textAlign:'center', color:'#e94560', marginBottom:'8px' },
  subtitle: { textAlign:'center', color:'#8892b0', marginBottom:'32px', fontSize:'0.9rem' },
  error: { background:'rgba(233,69,96,0.1)', border:'1px solid #e94560', color:'#e94560', padding:'10px', borderRadius:'8px', marginBottom:'16px', fontSize:'0.9rem' },
  form: { display:'flex', flexDirection:'column', gap:'20px' },
  field: { display:'flex', flexDirection:'column', gap:'8px' },
  label: { fontSize:'0.85rem', color:'#8892b0' },
  btn: { background:'#e94560', color:'#fff', border:'none', padding:'12px', borderRadius:'8px', fontWeight:'bold', marginTop:'8px' }
};

export default Login;
