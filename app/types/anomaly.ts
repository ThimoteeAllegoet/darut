export type ApplicationName =
  | 'Bandeau'
  | 'CVM'
  | 'AGENDA'
  | 'Weplan'
  | 'GEM'
  | 'Visio'
  | 'Scanner'
  | 'eBorne'
  | 'Trace de contact';

export type AnomalyStatus =
  | 'Nouveau'
  | 'En cours d\'analyse'
  | 'Corrigé'
  | 'En attente de livraison'
  | 'En attente de logs'
  | 'En attente retour utilisateur';

export interface HistoryEntry {
  id: string;
  date: string;
  action: string;
}

export type SupportEntity = 'France Travail' | 'ODIGO';

export interface Anomaly {
  id: string;
  applicationName: ApplicationName;
  priority: number;
  title: string;
  description: string;
  status: AnomalyStatus[];

  // Support entity (for Bandeau application)
  supportEntity?: SupportEntity;

  // Dates
  appearanceDate: string;
  correctionDate: string;
  deliveryDate: string;

  // Tickets
  ticketSNOW: string;
  ticketSNOWUrl: string;
  ticketJIRA: string;
  ticketJIRAUrl: string;
  ticketMainteneur: string;
  ticketMainteneurUrl: string;

  // Workaround
  hasWorkaround?: boolean;
  workaroundText?: string;
  workaroundUrl?: string;

  // History
  history: HistoryEntry[];

  createdAt: string;
  updatedAt: string;
}
