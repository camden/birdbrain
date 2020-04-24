import { useEffect } from 'react';
import ClapDetectorProcessor from './clap-detector-processor';

const useClapDetectionOld = () => {
  useEffect(() => {
    async function init() {
      let stream = null;

      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        await audioContext.audioWorklet.addModule(
          'clap-detector-processor-2.js'
        );
      } catch (e) {
        console.error('Could not initialize audio capture.');
        console.error(e);
      }
    }

    init();
  });
};

export default useClapDetectionOld;
