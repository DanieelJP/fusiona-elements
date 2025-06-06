import combine from './combine.mp3';
import generate from './generate.mp3';
import move from './move.mp3';

const playSound = (sound: string) => {
    const audio = new Audio(sound);
    audio.play().catch(() => {
        // Ignorar errores de reproducción (algunos navegadores bloquean el audio automático)
    });
};

export const Sounds = {
    playCombine: () => playSound(combine),
    playGenerate: () => playSound(generate),
    playMove: () => playSound(move)
}; 