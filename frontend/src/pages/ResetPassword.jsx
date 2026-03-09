import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' })
      return
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' })
      return
    }

    setLoading(true)

    try {
      const result = await authAPI.resetPassword(token, password)
      if (result.success) {
        setSuccess(true)
        setMessage({ type: 'success', text: result.message })
        setTimeout(() => navigate('/login'), 3000)
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
      <div className="glass-card rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🔑</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Nouveau mot de passe</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Choisissez un nouveau mot de passe pour votre compte
          </p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message.text}
          </div>
        )}

        {success ? (
          <div className="text-center space-y-4">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-gray-700">
              Votre mot de passe a été réinitialisé avec succès !
            </p>
            <p className="text-sm text-gray-500">
              Redirection vers la page de connexion...
            </p>
            <Link
              to="/login"
              className="inline-block mt-4 text-pink-600 hover:text-pink-700 font-semibold"
            >
              <i className="fas fa-sign-in-alt mr-2"></i>
              Se connecter maintenant
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-lock mr-2"></i>Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-lock mr-2"></i>Confirmer le mot de passe
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn py-3 text-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Réinitialisation...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Réinitialiser le mot de passe
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-pink-600 hover:text-pink-700 font-semibold">
                <i className="fas fa-arrow-left mr-2"></i>
                Retour à la connexion
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
