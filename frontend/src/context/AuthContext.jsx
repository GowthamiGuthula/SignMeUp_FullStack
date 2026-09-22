import { createContext, useContext, useEffect, useState } from 'react'
import * as api from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('signmeup_user')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('signmeup_user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('signmeup_user')
    }
  }, [currentUser])

  const register = async (formData) => {
    const user = await api.registerUser(formData)
    setCurrentUser(user)
    return user
  }

  const login = async (formData) => {
    const user = await api.loginUser(formData)
    setCurrentUser(user)
    return user
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const updateProfile = async (updates) => {
    const updated = await api.updateUser(currentUser.id, updates)
    setCurrentUser(updated)
    return updated
  }

  return (
    <AuthContext.Provider value={{ currentUser, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
