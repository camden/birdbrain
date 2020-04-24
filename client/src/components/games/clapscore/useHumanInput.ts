import HumanInput from 'humaninput/dist/humaninput-1.1.15-full';
import { useEffect, useRef } from 'react';

interface useHumanInputProps {
  onClap?: () => void;
  onDoubleClap?: () => void;
  onSpeechRealtime?: (event: any, transcript: string) => void;
  onSpeech?: (event: any, transcript: any) => void;
}

const useHumanInput = (props: useHumanInputProps) => {
  const HumanInputRef = useRef<any>(null);

  useEffect(() => {
    if (HumanInputRef.current) {
      HumanInputRef.current.off();
    }

    const HI = new HumanInput(window, {
      autostartClapper: true,
      autostartSpeech: true,
    });
    HumanInputRef.current = HI;

    HI.on('clap', () => props.onClap && props.onClap());
    HI.on('doubleclap', () => props.onDoubleClap && props.onDoubleClap());
    HI.on(
      'speech',
      (event: any, transcript: any) =>
        props.onSpeech && props.onSpeech(event, transcript)
    );
    HI.on(
      'speech:rt',
      (event: any, transcript: any) =>
        props.onSpeechRealtime && props.onSpeechRealtime(event, transcript)
    );

    return () => {
      HI.off();
    };
  }, [props]);
};

export default useHumanInput;
