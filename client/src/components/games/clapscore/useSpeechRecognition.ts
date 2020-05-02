import { useEffect } from 'react';

export interface useSpeechRecognitionProps {
  onSpeechRealtime?: (
    event: any,
    transcript: string,
    alternatives: string[]
  ) => void;
  onSpeech?: (event: any, transcript: string, alternatives: string[]) => void;
}

const useSpeechRecognition = (props: useSpeechRecognitionProps) => {
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const SpeechGrammarList =
      window.SpeechGrammarList || (window as any).webkitSpeechGrammarList;

    if (!SpeechRecognition || !SpeechGrammarList) {
      return;
    }

    const speech = new SpeechRecognition();
    const grammarsList = new SpeechGrammarList();
    const grammar = `#JSGF V1.0; grammar names; public <names> = alpha | bravo`;
    grammarsList.addFromString(grammar);

    speech.grammars = grammarsList;
    speech.continuous = true;
    speech.lang = 'en-US';
    speech.maxAlternatives = 5;
    speech.interimResults = true;
    speech.start();
    speech.onresult = (event) => {
      const result = event.results[event.resultIndex];
      const transcript = event.results[event.resultIndex][0].transcript;
      const alternatives = Array.from(event.results[event.resultIndex]).map(
        (a) => a.transcript
      );

      if (result.isFinal) {
        props.onSpeech && props.onSpeech(event, transcript, alternatives);
      } else {
        props.onSpeechRealtime &&
          props.onSpeechRealtime(event, transcript, alternatives);
      }
    };
    speech.onend = () => {
      speech.start();
    };
  }, []);
};

export default useSpeechRecognition;
