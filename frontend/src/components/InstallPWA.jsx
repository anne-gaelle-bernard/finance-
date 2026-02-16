import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Installation acceptée');
    }
    
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-lg shadow-2xl z-50 animate-slide-up">
      <button 
        onClick={() => setShowInstall(false)}
        className="absolute top-2 right-2 text-white/80 hover:text-white"
      >
        ×
      </button>
      
      <div className="flex items-start gap-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Download className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">
            Installer Finance Tracker
          </h3>
          <p className="text-sm text-white/90 mb-3">
            Accédez rapidement à vos finances depuis votre écran d'accueil!
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="bg-white text-pink-600 px-4 py-2 rounded-lg font-semibold hover:bg-pink-50 transition-colors"
            >
              Installer
            </button>
            <button
              onClick={() => setShowInstall(false)}
              className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
