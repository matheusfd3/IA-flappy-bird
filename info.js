function handleInfo() {
  context.fillStyle = 'black';
  context.font = '20px Georgia';

  context.strokeText('Recorde: ' + bestScore, 460, 30);
  context.fillText('Recorde: ' + bestScore, 460, 30);

  context.strokeText('Pontuação: ' + score, 310, 30);
  context.fillText('Pontuação: ' + score, 310, 30);

  context.strokeText('Geração: ' + generation, 170, 30);
  context.fillText('Geração: ' + generation, 170, 30);

  context.strokeText('Vivos: ' + liveBirds, 50, 30);
  context.fillText('Vivos: ' + liveBirds, 50, 30);
}