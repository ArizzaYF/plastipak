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
          <span style={s.logoIcon}>◈</span>
          <span style={s.logoText}>PLASTI<span style={s.acc}>PAK</span></span>
        </div>
        <div style={s.sep}/>
        <div style={s.links}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              ...s.link,
              ...(location.pathname === l.to ? s.linkActive : {})
            }}>
              {l.label}
              {location.pathname === l.to && <span style={s.linkBar}/>}
            </Link>
          ))}
        </div>
      </div>
      <div style={s.right}>
        <div style={s.userInfo}>
          <span style={s.rolTag}>{usuario?.rol?.replace('_',' ').toUpperCase()}</span>
          <span style={s.userName}>{usuario?.nombre}</span>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }} style={s.btn}>
          SALIR
        </button>
      </div>
    </nav>
  );
};

const s = {
  nav:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 32px',height:'56px',background:'var(--bg-panel)',borderBottom:'1px solid var(--border)',position:'sticky',top:0,zIndex:100},
  left:{display:'flex',alignItems:'center',gap:'0'},
  logo:{display:'flex',alignItems:'center',gap:'10px',marginRight:'24px'},
  logoIcon:{color:'var(--accent)',fontSize:'1.1rem'},
  logoText:{fontFamily:'var(--font-display)',fontSize:'1.1rem',fontWeight:'700',letterSpacing:'0.15em'},
  acc:{color:'var(--accent)'},
  sep:{width:'1px',height:'20px',background:'var(--border)',margin:'0 24px'},
  links:{display:'flex',alignItems:'center',gap:'4px'},
  link:{fontFamily:'var(--font-mono)',fontSize:'0.7rem',letterSpacing:'0.12em',color:'var(--text-muted)',padding:'8px 14px',borderRadius:'3px',position:'relative',transition:'color 0.2s'},
  linkActive:{color:'var(--accent)'},
  linkBar:{position:'absolute',bottom:'-17px',left:'14px',right:'14px',height:'2px',background:'var(--accent)',borderRadius:'1px'},
  right:{display:'flex',alignItems:'center',gap:'16px'},
  userInfo:{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'2px'},
  rolTag:{fontFamily:'var(--font-mono)',fontSize:'0.6rem',color:'var(--accent)',letterSpacing:'0.1em'},
  userName:{fontFamily:'var(--font-mono)',fontSize:'0.75rem',color:'var(--text-secondary)'},
  btn:{background:'transparent',border:'1px solid var(--border)',color:'var(--text-muted)',padding:'6px 14px',borderRadius:'3px',fontFamily:'var(--font-mono)',fontSize:'0.68rem',letterSpacing:'0.1em',transition:'border-color 0.2s, color 0.2s'}
};

export default Navbar;
