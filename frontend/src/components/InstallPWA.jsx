import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const dismissedInSession = sessionStorage.getItem('pwa_install_dismissed') === '1';
    if (dismissedInSession) setDismissed(true);

    const alreadyInstalled =
      window.matchMedia?.('(display-mode: standalone)')?.matches ||
      window.navigator?.standalone === true;
    if (alreadyInstalled) setIsInstalled(true);

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowInstall(false);
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
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

  const close = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa_install_dismissed', '1');
  };

  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  const isStandaloneIOS = window.navigator?.standalone === true;

  if (isInstalled) return null;
  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-2xl shadow-2xl z-50 animate-slide-up">
      <button
        onClick={close}
        className="absolute top-2 right-2 text-white/80 hover:text-white text-xl font-bold w-7 h-7 flex items-center justify-center"
        aria-label="Fermer"
      >
        ×
      </button>

      <div className="flex items-start gap-3">
        <div className="bg-white/20 p-2 rounded-xl flex-shrink-0">
          <Download className="w-6 h-6" />
        </div>

        <div className="flex-1 pr-4">
          <h3 className="font-bold text-lg mb-1">
            Installer Finance Tracker
          </h3>
          <p className="text-sm text-white/90 mb-3">
            Téléchargez l&apos;application sur votre appareil pour un accès rapide.
          </p>

          <div className="flex gap-2 flex-wrap">
            {showInstall && deferredPrompt ? (
              <button
                onClick={handleInstall}
                className="flex items-center gap-2 bg-white text-pink-600 px-4 py-2 rounded-xl font-bold hover:bg-pink-50 transition-colors shadow"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </button>
            ) : (
              <div className="text-sm text-white/95 leading-snug">
                {isIOS && !isStandaloneIOS ? (
                  <>
                    Sur iPhone/iPad : appuyez sur <strong>Partager</strong> puis{' '}
                    <strong>Ajouter à l’écran d’accueil</strong>.
                  </>
                ) : (
                  <>
                    Menu navigateur → <strong>Installer l’application</strong>
                  </>
                )}
              </div>
            )}
            <button
              onClick={close}
              className="bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition-colors text-sm"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
