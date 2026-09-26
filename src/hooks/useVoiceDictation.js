import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Hook universel de dictée vocale pour les formulaires SELY.
 * - Compatible Chrome, Safari (macOS & iOS), Edge.
 * - Gestion propre des permissions microphone via getUserMedia.
 * - Évite toute duplication de texte (interim + final).
 * - Feedback clair en cas de micro refusé ou d'absence de support.
 */
export function useVoiceDictation({ value = '', onChange, lang = 'fr-FR' }) {
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);
  const baseTextRef = useRef('');
  const isListeningRef = useRef(false);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

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
        "La dictée vocale n'est pas supportée par ce navigateur (recommandé : Safari ou Chrome). Vous pouvez taper votre texte directement."
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
            "Accès au microphone refusé. Veuillez autoriser le micro dans les paramètres de votre navigateur pour dicter votre demande."
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
      recognition.lang = lang;
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
            "Accès microphone refusé. Veuillez activer l'autorisation micro pour ce site."
          );
        } else if (event.error === 'network') {
          setErrorMessage(
            "Erreur réseau pour la reconnaissance vocale. Vous pouvez saisir votre demande au clavier."
          );
        } else if (event.error !== 'aborted') {
          setErrorMessage(
            "La capture vocale a été interrompue. Vous pouvez continuer au clavier ou relancer le micro."
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
        "Impossible de démarrer le microphone. Veuillez vérifier vos autorisations ou taper au clavier."
      );
      setIsListening(false);
    }
  }, [value, onChange, lang]);

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
    toggleListening,
    stopListening,
    startListening,
  };
}
