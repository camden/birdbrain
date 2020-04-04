import { useEffect, useCallback } from 'react';

const useSound = (soundUrl: string) => {
  useEffect(() => {
    const sound = {
      src: soundUrl,
      id: soundUrl,
    };

    createjs.Sound.registerSound(sound);
  }, [soundUrl]);

  return useCallback(() => {
    createjs.Sound.play(soundUrl);
  }, [soundUrl]);
};

export default useSound;
