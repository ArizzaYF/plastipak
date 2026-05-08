import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navLinks = {
  vendedor: [
    { to: '/dashboard', label: 'INICIO' },
    { to: '/referencias', label: 'REFERENCIAS' },
    { to: '/pedidos', label: 'PEDIDOS' },
  ],
  jefe_produccion: [
    { to: '/dashboard', label: 'INICIO' },
    { to: '/referencias', label: 'REFERENCIAS' },
    { to: '/planillas', label: 'PLANILLAS' },
    { to: '/reporte', label: 'REPORTES' },
  ],
  operario: [
    { to: '/dashboard', label: 'INICIO' },
    { to: '/registro', label: 'REGISTRO' },
  ],
};

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const links = navLinks[usuario?.rol] || [];

  return (
    <nav style={s.nav}>
      <div style={s.left}>
        <div style={s.logo}>
          <div style={s.logoBox}><span style={s.logoText}>PP</span></div>
          <span style={s.brand}>PLASTI<span style={s.brandY}>PAK</span></span>
        </div>
        <div style={s.divider}/>
        <div style={s.links}>
          {links.map(l => {
            const active = location.pathname === l.to;
            return (
              <Link key={l.to} to={l.to} style={{
                ...s.link,
                ...(active ? s.linkActive : {})
              }}>
                {l.label}
                {active && <div style={s.activeBar}/>}
              </Link>
            );
          })}
        </div>
      </div>

      <div style={s.right}>
        <div style={s.userBox}>
          <span style={s.rolBadge}>{usuario?.rol?.replace('_',' ').toUpperCase()}</span>
          <span style={s.userName}>{usuario?.nombre}</span>
        </div>
        <button
          className="neo-btn-secondary"
          style={s.logoutBtn}
          onClick={() => { logout(); navigate('/login'); }}
        >
          SALIR
        </button>
      </div>
    </nav>
  );
};

const s = {
  nav: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', height:'58px', background:'#0d0f13', borderBottom:'2px solid var(--border-dim)', position:'sticky', top:0, zIndex:100 },
  left: { display:'flex', alignItems:'center', gap:'0' },
  logo: { display:'flex', alignItems:'center', gap:'10px', marginRight:'20px' },
  logoBox: { width:'32px', height:'32px', background:'var(--accent)', border:'2px solid #000', display:'flex', alignItems:'center', justifyContent:'center' },
  logoText: { fontFamily:'var(--font-mono)', fontWeight:'700', fontSize:'0.7rem', color:'#000' },
  brand: { fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:'700', letterSpacing:'0.12em' },
  brandY: { color:'var(--accent)' },
  divider: { width:'2px', height:'24px', background:'var(--border-dim)', margin:'0 20px' },
  links: { display:'flex', alignItems:'center', gap:'2px' },
  link: { fontFamily:'var(--font-mono)', fontSize:'0.68rem', letterSpacing:'0.12em', color:'#cccccc', padding:'8px 14px', position:'relative', transition:'color 0.15s' },
  linkActive: { color:'var(--accent)' },
  activeBar: { position:'absolute', bottom:'-18px', left:'14px', right:'14px', height:'2px', background:'var(--accent)' },
  right: { display:'flex', alignItems:'center', gap:'16px' },
  userBox: { display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'2px' },
  rolBadge: { fontFamily:'var(--font-mono)', fontSize:'0.58rem', color:'var(--accent)', letterSpacing:'0.12em', border:'1px solid var(--accent)', padding:'1px 6px', borderRadius:'1px' },
  userName: { fontFamily:'var(--font-mono)', fontSize:'0.72rem', color:'#ffffff' },
  logoutBtn: { padding:'6px 14px', fontSize:'0.72rem' },
};

export default Navbar;
