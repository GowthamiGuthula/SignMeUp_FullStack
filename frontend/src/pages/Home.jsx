import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <h1 className="home-title">
        Welcome to <span className="home-accent">SignMeUp</span>
      </h1>
      <p className="home-subtitle">
        Discover events, RSVP instantly, and see who is attending.
      </p>
      <Link to="/events" className="home-btn">Browse Events</Link>

      <div className="home-features">
        <div className="home-feature">
          <span className="home-feature-icon">📅</span>
          <h3>Discover Events</h3>
          <p>Browse and filter upcoming events.</p>
        </div>
        <div className="home-feature">
          <span className="home-feature-icon">✋</span>
          <h3>RSVP Instantly</h3>
          <p>One-click RSVP to reserve your spot.</p>
        </div>
        <div className="home-feature">
          <span className="home-feature-icon">�</span>
          <h3>See Attendees</h3>
          <p>View who else is going to the event.</p>
        </div>
      </div>
    </div>
  )
}

export default Home
