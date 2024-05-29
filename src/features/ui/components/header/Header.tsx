import { ReactElement } from 'react';
import {
  IconSun,
  IconSunFilled,
  IconMoon,
  IconMoonFilled,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import './Header.scss';

function Header(): ReactElement {
  return (
    <header className="header">
      <section className="header-container">
        <span className="header-app-name">MyCheckers</span>

        <Navbar />

        <button className="header-light-dark-mode">
          <IconSun size={28} stroke={2} />
          <IconSunFilled size={28} stroke={2} />
          <IconMoon size={24} stroke={2} />
          <IconMoonFilled size={24} stroke={2} />
        </button>

        <section className="header-auth">
          <Link className="header-auth-login" to="/login">
            Iniciar sesión
          </Link>

          <Link className="header-auth-sign-up" to="/sign-up">
            Registrarse
          </Link>
        </section>
      </section>
    </header>
  );
}

export default Header;
