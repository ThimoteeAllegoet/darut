export type ApplicationName =
  | 'Bandeau'
  | 'CVM'
  | 'AGENDA'
  | 'Weplan'
  | 'GEM'
  | 'Visio'
  | 'Scanner'
  | 'eBorne'
  | 'Trace de contact'
  | 'Général';

export interface DictionaryTerm {
  id: string;
  term: string;
  definition: string;
  applications: ApplicationName[];
  documentUrl?: string;
  documentName?: string;
  createdAt: string;
  updatedAt: string;
}
