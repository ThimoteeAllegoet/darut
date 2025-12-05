export type ApplicationName =
  | 'Bandeau'
  | 'CVM'
  | 'AGENDA'
  | 'Weplan'
  | 'GEM'
  | 'Visio'
  | 'Scanner'
  | 'eBorne';

export interface Anomaly {
  id: string;
  applicationName: ApplicationName;
  priority: number;
  title: string;
  description: string;
  incidentReferences: string;
  correctionDate: string;
  createdAt: string;
  updatedAt: string;
}
