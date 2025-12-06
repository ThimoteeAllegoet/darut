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

export interface MediathequeItem {
  id: string;
  title: string;
  url: string;
  applicationName: ApplicationName;
  createdAt: string;
  updatedAt: string;
}
