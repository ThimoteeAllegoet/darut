export type EventType = 'Incident majeur' | 'Version' | 'Hotfix' | 'Autre';

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
  | 'Autres';

export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  changeTicket?: string;
  changeTicketUrl?: string;
  contentUrl?: string;
  applications: ApplicationName[];
  createdAt: string;
  updatedAt: string;
}
