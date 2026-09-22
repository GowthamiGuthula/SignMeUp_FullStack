import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/SignMeUpLogo.png'
import './Header.css'

function Header() {
  const { currentUser, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  const closeMenu = () => setMenuOpen(false)

  // Close the dropdown when clicking anywhere outside of it
  useEffect(() => {
    if (!menuOpen) return

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const handleLogout = () => {
    logout()
    closeMenu()
    navigate('/')
  }

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

        {currentUser ? (
          <div className="header-user" ref={menuRef}>
            <button className="header-guest header-guest-btn" onClick={() => setMenuOpen((open) => !open)}>
              <span className="header-guest-avatar">
                {currentUser.displayName.charAt(0).toUpperCase()}
              </span>
              <span className="header-guest-name">{currentUser.displayName}</span>
              <span className={`header-guest-caret ${menuOpen ? 'header-guest-caret--open' : ''}`}>▾</span>
            </button>

            {menuOpen && (
              <div className="header-dropdown">
                <div className="header-dropdown-header">
                  <span className="header-dropdown-avatar">
                    {currentUser.displayName.charAt(0).toUpperCase()}
                  </span>
                  <div className="header-dropdown-identity">
                    <span className="header-dropdown-name">{currentUser.displayName}</span>
                    <span className="header-dropdown-email">{currentUser.email}</span>
                  </div>
                </div>

                <div className="header-dropdown-links">
                  <NavLink to="/profile" className="header-dropdown-link" onClick={closeMenu}>
                    <span className="header-dropdown-icon">👤</span> Profile
                  </NavLink>
                  <NavLink to="/my-events" className="header-dropdown-link" onClick={closeMenu}>
                    <span className="header-dropdown-icon">📅</span> My Events
                  </NavLink>
                  <NavLink to="/my-rsvps" className="header-dropdown-link" onClick={closeMenu}>
                    <span className="header-dropdown-icon">✅</span> My RSVPs
                  </NavLink>
                </div>

                <div className="header-dropdown-footer">
                  <button className="header-dropdown-link header-dropdown-logout" onClick={handleLogout}>
                    <span className="header-dropdown-icon">🚪</span> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="header-auth-links">
            <NavLink to="/login">Login</NavLink>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
