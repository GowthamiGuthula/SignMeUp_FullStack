import { useState } from 'react'
import './Contact.css'

function Contact() {
  // useState to manage the form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !message) return
    setSubmitted(true)
  }

  return (
    <div className="contact">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-text">
        Have questions or feedback? Fill out the table below and we will get back to you.
      </p>

      {submitted ? (
        <div className="contact-success">
          <p>Thank you, <strong>{name}</strong>! Your message has been sent.</p>
          <button
            className="contact-btn"
            onClick={() => { setName(''); setEmail(''); setMessage(''); setSubmitted(false) }}
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <table className="contact-table">
          <tbody>
            <tr>
              <td className="contact-table-label">
                <label htmlFor="name">Name</label>
              </td>
              <td className="contact-table-input">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="contact-input"
                />
              </td>
            </tr>
            <tr>
              <td className="contact-table-label">
                <label htmlFor="email">Email</label>
              </td>
              <td className="contact-table-input">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="contact-input"
                />
              </td>
            </tr>
            <tr>
              <td className="contact-table-label">
                <label htmlFor="message">Message</label>
              </td>
              <td className="contact-table-input">
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                  rows={4}
                  className="contact-input"
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td className="contact-table-button">
                <button type="submit" className="contact-btn" onClick={handleSubmit}>
                  Send Message
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Contact
