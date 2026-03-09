import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../services/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    setLoading(true)

    try {
      const result = await authAPI.forgotPassword(email)
      if (result.success) {
        setSent(true)
        setMessage({ type: 'success', text: result.message })
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
          <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🔒</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Mot de passe oublié</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Entrez votre adresse email pour recevoir un lien de réinitialisation
          </p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message.text}
          </div>
        )}

        {sent ? (
          <div className="text-center space-y-4">
            <div className="text-5xl mb-4">📧</div>
            <p className="text-gray-700">
              Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
            </p>
            <p className="text-sm text-gray-500">
              Pensez à vérifier votre dossier spam.
            </p>
            <Link
              to="/login"
              className="inline-block mt-4 text-pink-600 hover:text-pink-700 font-semibold"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full btn py-3 text-lg disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Envoyer le lien
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

export default ForgotPassword
