import { AnomalyStatus } from '../types/anomaly';

export function getPriorityColor(priority: number, totalCount: number): string {
  if (totalCount <= 1) return '#D92424'; // Rouge si une seule anomalie

  const ratio = (priority - 1) / (totalCount - 1);

  // Interpolation entre rouge (#D92424) et gris (#9CA3AF)
  const red = { r: 217, g: 36, b: 36 };
  const grey = { r: 156, g: 163, b: 175 };

  const r = Math.round(red.r + (grey.r - red.r) * ratio);
  const g = Math.round(red.g + (grey.g - red.g) * ratio);
  const b = Math.round(red.b + (grey.b - red.b) * ratio);

  return `rgb(${r}, ${g}, ${b})`;
}

export function getStatusColor(status: AnomalyStatus): string {
  switch (status) {
    case 'Nouveau':
      return 'var(--color-secondary-blue)';
    case 'En cours d\'analyse':
      return 'var(--color-accent-orange)';
    case 'Corrigé':
      return '#10B981'; // Vert
    case 'En attente de livraison':
      return 'var(--color-secondary-yellow)';
    case 'En attente de logs':
      return 'var(--color-secondary-purple)';
    case 'En attente retour utilisateur':
      return 'var(--color-secondary-pink)';
    default:
      return 'var(--color-primary-blue)';
  }
}

export function getStatusTextColor(status: AnomalyStatus): string {
  switch (status) {
    case 'Corrigé':
    case 'En attente de livraison':
      return 'var(--color-primary-dark)';
    default:
      return 'var(--color-white)';
  }
}
