import { Routes, Route } from 'react-router-dom'
import { EventsProvider } from './context/EventsContext'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home.jsx'
import Events from './pages/Events.jsx'
import EventDetail from './pages/EventDetail.jsx'
import AddEvent from './pages/AddEvent.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Profile from './pages/Profile.jsx'
import MyEvents from './pages/MyEvents.jsx'
import MyRSVPs from './pages/MyRSVPs.jsx'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <EventsProvider>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/create" element={<AddEvent />} />
            <Route path="/events/:id/edit" element={<AddEvent />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/my-rsvps" element={<MyRSVPs />} />
          </Routes>
        </main>
        <Footer />
      </EventsProvider>
    </AuthProvider>
  )
}

export default App
