import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';

function Navbar(): ReactElement {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li className="navbar-link">
          <Link to="/">Inicio</Link>
        </li>

        <li className="navbar-link">
          <Link to="/play">Jugar</Link>
        </li>

        <li className="navbar-link">
          <Link to="/about-checkers">¿Qué son las damas?</Link>
        </li>

        <li className="navbar-link">
          <Link to="/rules">Reglas</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
