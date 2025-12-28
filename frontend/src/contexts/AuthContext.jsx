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
      const response = await authAPI.login({ email, password })
      
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
      const response = await authAPI.register({ name, email, password })
      
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
        message: error.response?.data?.message || 'Cet email est déjà utilisé' 
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
