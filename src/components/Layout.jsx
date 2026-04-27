import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiMenu, FiHome, FiSettings, FiChevronRight } from 'react-icons/fi';
import '../index.css'; // Garantir que os estilos sejam aplicados

export default function Layout() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="app-container">
      <div className={`main-content with-navbar ${isExpanded ? 'shrink' : ''}`}>
        <Outlet />
      </div>

      <nav className={`navbar ${isExpanded ? 'expanded' : ''}`}>
        <button className="nav-toggle" onClick={toggleNavbar} title="Alternar Menu">
          {isExpanded ? <FiChevronRight /> : <FiMenu />}
        </button>

        <div className="nav-links">
          <NavLink to="/principal" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon"><FiHome /></span>
            <span className="nav-text">Principal</span>
          </NavLink>

          <NavLink to="/config" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon"><FiSettings /></span>
            <span className="nav-text">Configurações</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
