import { useEffect, useCallback } from 'react';

const useSound = (soundUrl: string) => {
  useEffect(() => {
    const sound = {
      src: soundUrl,
      id: soundUrl,
    };

    if (!window.createjs) {
      return;
    }

    createjs.Sound.registerSound(sound);
    createjs.Sound.volume = 0.3;
    return () => {
      createjs.Sound.removeSound(sound, '');
    };
  }, [soundUrl, window.createjs]);

  return useCallback(() => {
    createjs.Sound.play(soundUrl);
  }, [soundUrl]);
};

export default useSound;
