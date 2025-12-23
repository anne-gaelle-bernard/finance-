import { LayoutDashboard, User, Calculator, TrendingUp, FolderOpen, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeSection, onSectionChange, isMobileOpen, onClose }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-pink-500' },
    { id: 'profile', icon: User, label: 'Profile', color: 'text-purple-500' },
    { id: 'simulator', icon: Calculator, label: 'Simulators', color: 'text-blue-500' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics', color: 'text-green-500' },
    { id: 'folders', icon: FolderOpen, label: 'Folders', color: 'text-orange-500' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSectionClick = (sectionId) => {
    onSectionChange(sectionId);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen
        w-64 bg-white shadow-xl
        transform transition-transform duration-300 ease-in-out
        z-50 lg:z-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-800 truncate">{currentUser?.name}</h2>
                <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-6 py-3
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-r-4 border-pink-500' 
                      : 'hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon 
                    size={20} 
                    className={isActive ? item.color : 'text-gray-400'}
                  />
                  <span className={`
                    font-medium text-sm
                    ${isActive ? 'text-gray-800' : 'text-gray-600'}
                  `}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium text-sm">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
