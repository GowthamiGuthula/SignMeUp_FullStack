import { NavLink } from 'react-router-dom'
import logo from '../assets/SignMeUpLogo.png'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <NavLink to="/" className="header-brand">
        <img src={logo} alt="SignMeUp logo" className="header-logo" />
        <span className="header-brand-text">SignMeUp</span>
      </NavLink>

      <div className="header-right">
        <nav className="header-nav">
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact Us</NavLink>
        </nav>
        <div className="header-guest">
          <span className="header-guest-avatar">G</span>
          <span className="header-guest-name">Guest</span>
        </div>
      </div>
    </header>
  )
}

export default Header
