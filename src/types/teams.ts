export type TeamRow = {
  id: string;
  name: string;
  title: string;
  role: string;
  status: string;
};

export type TeamMetrics = {
  openJobs: number;
  closedJobs: number;
  archivedJobs: number;
};

export type Team = {
  id: string;
  teamName: string;
  teamDescription: string;
  metrics: TeamMetrics;
  members: TeamRow[];
};
