export interface Website {
  id: string;
  url: string;
  name: string;
  status: "UP" | "DOWN" | "UNKNOWN";
  lastChecked: string;
  responseTime: number;
  history: number[];
  regions: { name: string; status: "UP" | "DOWN" }[];
}

export const mockWebsites: Website[] = [
  {
    id: "1",
    url: "https://google.com",
    name: "Google Search",
    status: "UP",
    lastChecked: "2 mins ago",
    responseTime: 45,
    history: [42, 45, 48, 44, 46, 45, 47, 45, 44, 45],
    regions: [
      { name: "US-East", status: "UP" },
      { name: "EU-West", status: "UP" },
      { name: "AS-South", status: "UP" },
    ],
  },
  {
    id: "2",
    url: "https://github.com",
    name: "GitHub",
    status: "UP",
    lastChecked: "1 min ago",
    responseTime: 120,
    history: [115, 125, 118, 122, 120, 119, 121, 120, 122, 120],
    regions: [
      { name: "US-East", status: "UP" },
      { name: "EU-West", status: "UP" },
      { name: "AS-South", status: "UP" },
    ],
  },
  {
    id: "3",
    url: "https://api.myapp.com",
    name: "Production API",
    status: "DOWN",
    lastChecked: "30 secs ago",
    responseTime: 0,
    history: [250, 260, 255, 258, 0, 0, 0, 0, 0, 0],
    regions: [
      { name: "US-East", status: "DOWN" },
      { name: "EU-West", status: "DOWN" },
      { name: "AS-South", status: "DOWN" },
    ],
  },
  {
    id: "4",
    url: "https://dashboard.myapp.com",
    name: "Admin Dashboard",
    status: "UP",
    lastChecked: "5 mins ago",
    responseTime: 85,
    history: [80, 82, 85, 88, 84, 86, 85, 83, 85, 85],
    regions: [
      { name: "US-East", status: "UP" },
      { name: "EU-West", status: "UP" },
      { name: "AS-South", status: "UP" },
    ],
  },
  {
    id: "5",
    url: "https://auth.myapp.com",
    name: "Auth Service",
    status: "UP",
    lastChecked: "10 mins ago",
    responseTime: 65,
    history: [60, 62, 65, 68, 64, 66, 65, 63, 65, 65],
    regions: [
      { name: "US-East", status: "UP" },
      { name: "EU-West", status: "UP" },
      { name: "AS-South", status: "UP" },
    ],
  },
  {
    id: "6",
    url: "https://cdn.myapp.com",
    name: "Static Assets",
    status: "UNKNOWN",
    lastChecked: "Never",
    responseTime: 0,
    history: [],
    regions: [
      { name: "US-East", status: "UP" },
      { name: "EU-West", status: "UP" },
      { name: "AS-South", status: "UP" },
    ],
  },
];

export interface Incident {
  id: string;
  website: string;
  status: "UP" | "DOWN";
  startTime: string;
  endTime: string;
  duration: string;
}

export const mockIncidents: Incident[] = [
  {
    id: "1",
    website: "Production API",
    status: "DOWN",
    startTime: "2025-12-31 12:30:00",
    endTime: "Ongoing",
    duration: "31m 12s",
  },
  {
    id: "2",
    website: "GitHub",
    status: "UP",
    startTime: "2025-12-31 10:15:00",
    endTime: "2025-12-31 10:20:00",
    duration: "5m 00s",
  },
  {
    id: "3",
    website: "Google Search",
    status: "UP",
    startTime: "2025-12-31 08:00:00",
    endTime: "2025-12-31 08:02:00",
    duration: "2m 15s",
  },
];
