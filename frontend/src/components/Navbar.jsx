import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>🏭 PlastiPak</span>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        {(usuario?.rol === 'vendedor' || usuario?.rol === 'jefe_produccion') && (
          <Link to="/referencias" style={styles.link}>Referencias</Link>
        )}
        {usuario?.rol === 'vendedor' && (
          <Link to="/pedidos" style={styles.link}>Pedidos</Link>
        )}
        {usuario?.rol === 'jefe_produccion' && (
          <Link to="/planillas" style={styles.link}>Planillas</Link>
        )}
        {usuario?.rol === 'operario' && (
          <Link to="/registro" style={styles.link}>Registro</Link>
        )}
        {usuario?.rol === 'jefe_produccion' && (
          <Link to="/reporte" style={styles.link}>Reportes</Link>
        )}
      </div>
      <div style={styles.user}>
        <span style={styles.rolBadge}>{usuario?.rol}</span>
        <span style={styles.nombre}>{usuario?.nombre}</span>
        <button onClick={handleLogout} style={styles.btn}>Salir</button>
      </div>
    </nav>
  );
};

const styles = {
  nav: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 24px', background:'#1a1a2e', color:'#fff' },
  brand: { fontSize:'1.2rem', fontWeight:'bold', color:'#e94560' },
  links: { display:'flex', gap:'20px' },
  link: { color:'#a8b2d8', textDecoration:'none', fontSize:'0.95rem' },
  user: { display:'flex', alignItems:'center', gap:'12px' },
  rolBadge: { background:'#e94560', padding:'2px 8px', borderRadius:'12px', fontSize:'0.75rem' },
  nombre: { fontSize:'0.9rem', color:'#ccd6f6' },
  btn: { background:'transparent', border:'1px solid #e94560', color:'#e94560', padding:'4px 12px', borderRadius:'6px', cursor:'pointer' }
};

export default Navbar;
