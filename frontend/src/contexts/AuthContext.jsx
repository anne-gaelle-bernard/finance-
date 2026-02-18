import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for existing token and validate
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('currentUser')
    
    if (token && savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const trimmedEmail = email.trim().toLowerCase()
      const trimmedPassword = password.trim()

      if (!trimmedEmail || !trimmedPassword) {
        return { success: false, message: 'Veuillez saisir un email et un mot de passe.' }
      }

      const response = await authAPI.login({ email: trimmedEmail, password: trimmedPassword })
      
      if (response.token && response.user) {
        // Store token and user data
        localStorage.setItem('token', response.token)
        localStorage.setItem('currentUser', JSON.stringify(response.user))
        
        setCurrentUser(response.user)
        navigate('/dashboard')
        return { success: true, message: `Bienvenue ${response.user.name}!` }
      }
      return { success: false, message: 'Erreur de connexion' }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Email ou mot de passe incorrect' 
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      const trimmedName = name.trim()
      const trimmedEmail = email.trim().toLowerCase()
      const trimmedPassword = password.trim()

      if (!trimmedName || !trimmedEmail || !trimmedPassword) {
        return { success: false, message: 'Veuillez remplir tous les champs.' }
      }

      if (trimmedPassword.length < 6) {
        return { success: false, message: 'Le mot de passe doit contenir au moins 6 caractères.' }
      }

      const response = await authAPI.register({ name: trimmedName, email: trimmedEmail, password: trimmedPassword })
      
      if (response.token && response.user) {
        // Store token and user data
        localStorage.setItem('token', response.token)
        localStorage.setItem('currentUser', JSON.stringify(response.user))
        
        setCurrentUser(response.user)
        navigate('/dashboard')
        return { success: true, message: `Compte créé avec succès! Bienvenue ${name}!` }
      }
      return { success: false, message: 'Erreur lors de la création du compte' }
    } catch (error) {
      console.error('Register error:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Une erreur est survenue lors de la création du compte.' 
      }
    }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
    navigate('/login')
  }

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!currentUser
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
