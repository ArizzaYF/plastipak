import { useAuth } from '../context/AuthContext';

const roleInfo = {
  vendedor: { icon: '🛒', desc: 'Puedes crear y gestionar pedidos de clientes.', acciones: ['Crear Referencias', 'Crear Pedidos'] },
  jefe_produccion: { icon: '⚙️', desc: 'Gestionas las planillas y reportes de producción.', acciones: ['Ver Referencias', 'Asignar Planillas', 'Ver Reportes'] },
  operario: { icon: '🔧', desc: 'Registras el proceso de sellado en tu turno.', acciones: ['Registrar Sellado'] }
};

const Dashboard = () => {
  const { usuario } = useAuth();
  const info = roleInfo[usuario?.rol] || {};

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Bienvenido, {usuario?.nombre} {info.icon}</h1>
        <p style={styles.sub}>{info.desc}</p>
      </div>
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Tu Rol</h3>
          <span style={styles.badge}>{usuario?.rol}</span>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Acciones Disponibles</h3>
          <ul style={styles.list}>
            {info.acciones?.map(a => <li key={a} style={styles.item}>✅ {a}</li>)}
          </ul>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Sistema</h3>
          <p style={styles.cardText}>🏭 PlastiPak</p>
          <p style={styles.cardText}>Gestión de Producción</p>
          <p style={styles.cardText}>v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '40px' },
  header: { marginBottom: '40px' },
  title: { fontSize: '2rem', color: '#ccd6f6', marginBottom: '8px' },
  sub: { color: '#8892b0', fontSize: '1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' },
  card: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px' },
  cardTitle: { color: '#e94560', marginBottom: '16px', fontSize: '1rem' },
  badge: { background: '#e94560', color: '#fff', padding: '4px 16px', borderRadius: '20px', fontSize: '0.9rem' },
  list: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' },
  item: { color: '#a8b2d8', fontSize: '0.9rem' },
  cardText: { color: '#a8b2d8', fontSize: '0.9rem', marginBottom: '4px' }
};

export default Dashboard;
