import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Principal from './pages/Principal';
import Config from './pages/Config';
import Layout from './components/Layout';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Telas que não possuem Navbar (Fora do Layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        
        {/* Telas que possuem Navbar (Dentro do Layout) */}
        <Route element={<Layout />}>
          <Route path="/principal" element={<Principal />} />
          <Route path="/config" element={<Config />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
