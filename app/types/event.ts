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

export interface EventPeriod {
  id: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  periods: EventPeriod[];
  // Legacy fields for backward compatibility
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  changeTicket?: string;
  changeTicketUrl?: string;
  parentIncident?: string;
  parentIncidentUrl?: string;
  contentUrl?: string;
  disiReference?: string;
  applications: ApplicationName[];
  createdAt: string;
  updatedAt: string;
}
