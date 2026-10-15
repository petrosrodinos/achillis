import { useEffect } from 'react';
import { audio } from '@/core/audio/audio-manager';

/** Plays the menu theme while a menu screen is mounted (continues seamlessly between menu screens). */
export function useMenuMusic(track: string = 'menu'): void {
  useEffect(() => {
    try {
      void audio.playMusic(track);
    } catch {
      // audio unavailable
    }
  }, [track]);
}
