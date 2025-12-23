import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = ({ userName }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="gradient-bg shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <div className="text-xl sm:text-2xl mr-2 sm:mr-3">💸</div>
            <h1 className="text-base sm:text-xl md:text-2xl font-bold text-white">Finance Tracker</h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition text-sm sm:text-base ${
                location.pathname === '/dashboard'
                  ? 'bg-white text-pink-600 font-semibold'
                  : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white'
              }`}
            >
              <i className="fas fa-chart-line mr-1 sm:mr-2"></i>
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition text-sm sm:text-base ${
                location.pathname === '/profile'
                  ? 'bg-white text-pink-600 font-semibold'
                  : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white'
              }`}
            >
              <i className="fas fa-user mr-1 sm:mr-2"></i>
              <span className="hidden sm:inline">Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-2 sm:px-4 py-1 sm:py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition"
            >
              <i className="fas fa-sign-out-alt text-white text-sm sm:text-base"></i>
              <span className="hidden md:inline text-white font-medium text-sm sm:text-base">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
