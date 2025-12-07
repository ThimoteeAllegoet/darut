export interface Alert {
  id: string;
  title: string;
  description: string;
  impact: string;
  concernedApplications: string[];
  workaround?: string;
  startDate: string;
  snowTicket?: string;
  snowTicketUrl?: string;
  affectedPopulation: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
