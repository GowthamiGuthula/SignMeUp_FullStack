import { Link } from 'react-router-dom'
import './About.css'

function About() {
  return (
    <div className="about">
      <h1 className="about-title">About SignMeUp</h1>
      <p className="about-text">
        SignMeUp is a simple event management app built with React. It lets you
        browse events, search by name or category, RSVP to events, and even
        create your own.
      </p>

      <h2 className="about-subtitle">What You Can Do</h2>
      <ul className="about-list">
        <li>Browse and search events</li>
        <li>View event details and attendees</li>
        <li>RSVP to upcoming events</li>
        <li>Create new events</li>
      </ul>

      <h2 className="about-subtitle">Tech Stack</h2>
      <ul className="about-list">
        <li><strong>React</strong> — UI library</li>
        <li><strong>React Router</strong> — page navigation</li>
        <li><strong>useState</strong> — local component state</li>
        <li><strong>Props</strong> — passing data between components</li>
      </ul>

      <Link to="/events" className="about-link">Go to Events &rarr;</Link>
    </div>
  )
}

export default About
