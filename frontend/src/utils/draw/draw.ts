import { COLOR } from 'game/enum/colors.ts';
import AttackerObject from 'game/engine/AttackerObject.ts';

export const drawDiamond = (
  context: CanvasRenderingContext2D,
  center: [number, number],
  color?: string,
) => {
  const width = 14;
  const height = 14;
  const [cx, cy] = [center[0] + 6, center[1] + 6];
  const halfW = width / 2;
  const halfH = height / 2;

  // Four points: top, right, bottom, left
  const top: [number, number] = [cx, cy - halfH];
  const right: [number, number] = [cx + halfW, cy];
  const bottom: [number, number] = [cx, cy + halfH];
  const left: [number, number] = [cx - halfW, cy];

  // Draw diamond
  context.beginPath();
  context.moveTo(...top);
  context.lineTo(...right);
  context.lineTo(...bottom);
  context.lineTo(...left);
  context.closePath();

  context.fillStyle = color || COLOR.WHITE;
  context.strokeStyle = 'black';
  context.lineWidth = 1;

  context.fill();
  context.stroke();
};

export const drawHpBar = (
  context: CanvasRenderingContext2D,
  attacker: AttackerObject,
) => {
  const { hp, position } = attacker.gameObject;

  if (hp > 0 && hp <= 100) {
    // Round HP up to nearest 20%
    const roundedHp = Math.ceil(hp / 10) * 10;
    const percent = roundedHp / 100;

    const barWidth = 20; // full width of HP bar
    const barHeight = 3; // thin bar height
    const x = position.x - barWidth / 2 + 5;
    const y = position.y - 6;

    const filledWidth = barWidth * percent;

    // Draw background (optional, for missing HP)
    context.fillStyle = '#333';
    context.fillRect(x, y, barWidth, barHeight);

    // Draw filled portion
    context.fillStyle = COLOR.RED;
    context.fillRect(x, y, filledWidth, barHeight);

    // Draw border
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.strokeRect(x, y, barWidth, barHeight);
  }
};
