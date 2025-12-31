const API_BASE_URL = "http://localhost:3001";

export interface Incident {
  id: string;
  websiteId: string;
  status: "Open" | "Closed";
  startedAt: string;
  endedAt: string | null;
  website: {
    name: string | null;
    url: string;
  };
}

export async function getIncidents(): Promise<Incident[]> {
  const response = await fetch(`${API_BASE_URL}/incidents`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch incidents");
  }
  return response.json();
}
