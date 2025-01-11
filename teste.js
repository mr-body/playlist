const ytdl = require('ytdl-core');

const videoUrl = 'https://www.youtube.com/watch?v=lVeR8WsFW0Y&list=RDRj_WeIwMHM8&index=9'; // Substitua pelo link real.

ytdl(videoUrl, { debug: true })
  .on('info', (info) => console.log('Informações do vídeo:', info))
  .on('error', (err) => console.error('Erro:', err))
  .pipe(fs.createWriteStream('video.mp4'));
