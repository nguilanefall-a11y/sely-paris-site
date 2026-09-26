import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Hook universel de dictée vocale pour les formulaires SELY.
 * - Détection automatique de la langue de l'appareil (Français par défaut pour francophones).
 * - Sélecteur de langue immédiat (FR / EN) contrôlable en 1 clic par l'utilisateur.
 * - Compatible Chrome, Safari (macOS & iOS), Edge.
 * - Gestion propre des permissions microphone via getUserMedia.
 * - Évite toute duplication de texte (interim + final).
 * - Feedback clair en cas de micro refusé ou d'absence de support.
 */
export function useVoiceDictation({ value = '', onChange, initialLang }) {
  // Détermination de la langue de départ :
  // 1. Si passée explicitement (ex: langue courante du site)
  // 2. Sinon, détection de la langue de l'appareil du visiteur
  const detectDeviceLanguage = () => {
    if (typeof window !== 'undefined') {
      const navLangs = navigator.languages || [navigator.language || ''];
      const hasFrench = navLangs.some(
        (l) => l && l.toLowerCase().startsWith('fr')
      );
      return hasFrench ? 'fr-FR' : 'en-US';
    }
    return 'fr-FR';
  };

  const computeLang = (l) => {
    if (!l) return detectDeviceLanguage();
    if (typeof l === 'string' && l.toLowerCase().startsWith('en')) return 'en-US';
    return 'fr-FR';
  };

  const [voiceLang, setVoiceLang] = useState(() => computeLang(initialLang));
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);
  const baseTextRef = useRef('');
  const isListeningRef = useRef(false);
  const voiceLangRef = useRef(voiceLang);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  const setVoiceLangAndSync = useCallback((newLang) => {
    const formatted = (typeof newLang === 'string' && newLang.toLowerCase().startsWith('en')) ? 'en-US' : 'fr-FR';
    setVoiceLang(formatted);
    voiceLangRef.current = formatted;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = formatted;
      } catch {}
    }
  }, []);

  // Synchronisation avec la langue du site si elle change (ex: bouton navbar)
  useEffect(() => {
    if (initialLang) {
      setVoiceLang(computeLang(initialLang));
    }
  }, [initialLang]);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;
    setIsSupported(Boolean(SpeechRecognition));
  }, []);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(async () => {
    setErrorMessage(null);

    const SpeechRecognition =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      setErrorMessage(
        voiceLangRef.current.startsWith('fr')
          ? "La dictée vocale n'est pas supportée par ce navigateur (recommandé : Safari ou Chrome). Vous pouvez taper votre texte directement."
          : "Voice dictation is not supported on this browser (Safari or Chrome recommended). You can type your request directly."
      );
      return;
    }

    // Sauvegarde du texte existant pour concaténation propre
    baseTextRef.current = (value || '').trim();

    // 1. Demande préalable d'accès au micro pour déclencher le popup système si nécessaire
    if (navigator?.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Ferme immédiatement le stream pour libérer le micro pour SpeechRecognition
        stream.getTracks().forEach((t) => t.stop());
      } catch (err) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setErrorMessage(
            voiceLangRef.current.startsWith('fr')
              ? "Accès au microphone refusé. Veuillez autoriser le micro dans les paramètres de votre navigateur pour dicter votre demande."
              : "Microphone access denied. Please enable microphone permissions in your browser settings to dictate your request."
          );
          setIsListening(false);
          return;
        }
      }
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.lang = voiceLangRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event) => {
        let sessionFinal = '';
        let sessionInterim = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            sessionFinal += result[0].transcript + ' ';
          } else {
            sessionInterim += result[0].transcript;
          }
        }

        const spoken = (sessionFinal + sessionInterim).trim();
        if (spoken) {
          const combined = baseTextRef.current
            ? `${baseTextRef.current} ${spoken}`
            : spoken;
          if (onChange) {
            onChange(combined);
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn('[VoiceDictation] error:', event.error);
        if (event.error === 'no-speech') {
          // Aucun mot détecté pendant un silence, on ne bloque pas
          return;
        }

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMessage(
            voiceLangRef.current.startsWith('fr')
              ? "Accès microphone refusé. Veuillez activer l'autorisation micro pour ce site."
              : "Microphone access denied. Please allow microphone permissions for this site."
          );
        } else if (event.error === 'network') {
          setErrorMessage(
            voiceLangRef.current.startsWith('fr')
              ? "Erreur réseau pour la reconnaissance vocale. Vous pouvez saisir votre demande au clavier."
              : "Network error during speech recognition. You can type your request directly."
          );
        } else if (event.error !== 'aborted') {
          setErrorMessage(
            voiceLangRef.current.startsWith('fr')
              ? "La capture vocale a été interrompue. Vous pouvez continuer au clavier ou relancer le micro."
              : "Voice capture was interrupted. You can continue typing or restart the microphone."
          );
        }

        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('[VoiceDictation] start error:', e);
      setErrorMessage(
        voiceLangRef.current.startsWith('fr')
          ? "Impossible de démarrer le microphone. Veuillez vérifier vos autorisations ou taper au clavier."
          : "Unable to start microphone. Please check your permissions or type your request."
      );
      setIsListening(false);
    }
  }, [value, onChange]);

  const toggleListening = useCallback(() => {
    if (isListeningRef.current) {
      stopListening();
    } else {
      startListening();
    }
  }, [stopListening, startListening]);

  return {
    isListening,
    errorMessage,
    isSupported,
    voiceLang,
    setVoiceLang: setVoiceLangAndSync,
    toggleListening,
    stopListening,
    startListening,
  };
}
