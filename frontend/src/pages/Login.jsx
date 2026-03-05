import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Download } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const { login } = useAuth()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const alreadyInstalled =
      window.matchMedia?.('(display-mode: standalone)')?.matches ||
      window.navigator?.standalone === true
    if (alreadyInstalled) setIsInstalled(true)

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setIsInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setIsInstalled(true)
    setDeferredPrompt(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    const result = await login(email, password)
    if (!result.success) {
      setMessage({ type: 'error', text: result.message })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
      <div className="glass-card rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
        <div className="text-center mb-6 sm:mb-8">
                    <div className="text-4xl sm:text-5xl mb-3 sm:mb-4"><img src="/icon.svg" alt="Finance Tracker" className="w-16 h-16 sm:w-20 sm:h-20 mx-auto" /></div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Finance Tracker</h1>
          <p className="text-sm sm:text-base text-gray-600">Connectez-vous à votre compte</p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-envelope mr-2"></i>Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <i className="fas fa-lock mr-2"></i>Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-3 rounded-lg font-semibold text-lg"
          >
            <i className="fas fa-sign-in-alt mr-2"></i>Se connecter
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Pas encore de compte?{' '}
          <Link to="/register" className="text-pink-500 font-semibold hover:text-pink-700">
            Inscrivez-vous
          </Link>
        </p>

        {!isInstalled && deferredPrompt && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={handleInstall}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              <Download className="w-5 h-5" />
              Télécharger l’application
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
