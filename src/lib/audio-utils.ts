export const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio();
      const reader = new FileReader();

      reader.onload = function(e) {
        if (!e.target?.result) {
          reject(new Error('Failed to read file'));
          return;
        }

        audio.src = e.target.result as string;
        
        audio.addEventListener('loadedmetadata', () => {
          if (isNaN(audio.duration)) {
            reject(new Error('Invalid audio duration'));
            return;
          }
          const durationInMinutes = parseFloat((audio.duration / 60).toFixed(2));
          URL.revokeObjectURL(audio.src);
          resolve(durationInMinutes);
        });

        audio.addEventListener('error', () => {
          URL.revokeObjectURL(audio.src);
          reject(new Error('Error loading audio file'));
        });
      };

      reader.onerror = () => {
        reject(new Error('Error reading audio file'));
      };

      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};
