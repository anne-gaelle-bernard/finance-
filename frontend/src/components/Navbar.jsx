import { useAuth } from '../contexts/AuthContext'

const Navbar = ({ userName }) => {
  const { logout } = useAuth()

  return (
    <nav className="gradient-bg shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center">
            <div className="text-xl sm:text-2xl mr-2 sm:mr-3">💸</div>
            <h1 className="text-base sm:text-xl md:text-2xl font-bold text-white">Finance Tracker</h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2 px-2 sm:px-3 py-1 sm:py-2 bg-white bg-opacity-20 rounded-lg">
              <i className="fas fa-user-circle text-white text-lg sm:text-xl"></i>
              <span className="hidden sm:inline text-white font-medium text-sm sm:text-base truncate max-w-[100px] sm:max-w-none">{userName}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-2 sm:px-4 py-1 sm:py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition"
            >
              <i className="fas fa-sign-out-alt text-white text-sm sm:text-base"></i>
              <span className="hidden sm:inline text-white font-medium text-sm sm:text-base">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
