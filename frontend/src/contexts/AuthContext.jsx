import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // Load from localStorage
    const savedUser = localStorage.getItem('currentUser')
    const savedUsers = localStorage.getItem('users')
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    }
  }, [])

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password)
    
    if (user) {
      const userData = { email: user.email, name: user.name }
      setCurrentUser(userData)
      localStorage.setItem('currentUser', JSON.stringify(userData))
      navigate('/dashboard')
      return { success: true, message: `Bienvenue ${user.name}!` }
    }
    return { success: false, message: 'Email ou mot de passe incorrect' }
  }

  const register = (name, email, password) => {
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Cet email est déjà utilisé' }
    }

    const newUser = { name, email, password }
    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))

    const userData = { email, name }
    setCurrentUser(userData)
    localStorage.setItem('currentUser', JSON.stringify(userData))
    navigate('/dashboard')
    return { success: true, message: `Compte créé avec succès! Bienvenue ${name}!` }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
