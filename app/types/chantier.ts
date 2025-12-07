export type ChantierState = 'En cours' | 'Terminé' | 'En attente' | 'Bloqué';

export type ChantierHistoryType = 'information' | 'problème';

export interface ChantierHistoryEntry {
  id: string;
  date: string;
  message: string;
  type: ChantierHistoryType;
}

export interface Chantier {
  id: string;
  title: string;
  description: string;
  state: ChantierState;
  progress: number; // 0-100
  showProgress?: boolean; // Whether to show progress bar
  deliveryPeriod?: string; // Free text field for expected delivery date/period
  history: ChantierHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}
