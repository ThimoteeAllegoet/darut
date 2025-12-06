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

export interface MESIItem {
  id: string;
  title: string;
  url: string;
  applicationName: ApplicationName;
  createdAt: string;
  updatedAt: string;
}
