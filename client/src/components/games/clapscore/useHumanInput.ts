import HumanInput from 'humaninput/dist/humaninput-1.1.15-full';
import { useEffect, useRef } from 'react';

interface useHumanInputProps {
  onClap?: () => void;
  onDoubleClap?: () => void;
  onSpeechRealtime?: (event: any, transcript: string) => void;
  onSpeech?: (event: any, transcript: any) => void;
  key?: number;
}

const useHumanInput = (props: useHumanInputProps) => {
  const HumanInputRef = useRef<any>(null);

  useEffect(() => {
    const HI = new HumanInput(window, {
      autostartSpeech: true,
    });

    HumanInputRef.current = HI;
  });

  useEffect(() => {
    const HI = HumanInputRef.current;

    if (!!HI) {
      console.log('clearing old events');
      HI.off();
    }

    console.log('Adding new events...');

    // HI.on(
    //   'speech',
    //   (event: any, transcript: any) =>
    //     props.onSpeech && props.onSpeech(event, transcript)
    // );
    // HI.on(
    //   'speech:rt',
    //   (event: any, transcript: any) =>
    //     props.onSpeechRealtime && props.onSpeechRealtime(event, transcript)
    // );

    return () => {
      HI.off();
    };
  }, []);
};

export default useHumanInput;
