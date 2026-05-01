import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Referencias from './pages/Referencias';
import Pedidos from './pages/Pedidos';
import Planillas from './pages/Planillas';
import Registro from './pages/Registro';
import Reporte from './pages/Reporte';
import { useAuth } from './context/AuthContext';

const Layout = ({ children }) => {
  const { usuario } = useAuth();
  return (
    <>
      {usuario && <Navbar />}
      <div style={{ minHeight: '100vh', background: '#0f0f23', color: '#ccd6f6' }}>
        {children}
      </div>
    </>
  );
};

const AppRoutes = () => {
  const { usuario } = useAuth();
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={!usuario ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/referencias" element={<ProtectedRoute roles={['vendedor','jefe_produccion']}><Referencias /></ProtectedRoute>} />
        <Route path="/pedidos" element={<ProtectedRoute roles={['vendedor']}><Pedidos /></ProtectedRoute>} />
        <Route path="/planillas" element={<ProtectedRoute roles={['jefe_produccion']}><Planillas /></ProtectedRoute>} />
        <Route path="/registro" element={<ProtectedRoute roles={['operario']}><Registro /></ProtectedRoute>} />
        <Route path="/reporte" element={<ProtectedRoute roles={['jefe_produccion']}><Reporte /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={usuario ? "/dashboard" : "/login"} />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
