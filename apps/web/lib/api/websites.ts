const API_BASE_URL = "http://localhost:3001";

export interface Region {
  name: string;
  status: "Up" | "Down";
}

export interface Website {
  id: string;
  url: string;
  name: string | null;
  status: "Up" | "Down" | "Unknown";
  lastCheckedAt: string | null;
  responseTime?: number; // Calculated or from latest tick
  regions?: Region[];
}

export interface Tick {
  id: string;
  timestamp: string;
  responseTimeMs: number;
  status: "Up" | "Down";
}

export async function getWebsites(): Promise<Website[]> {
  const response = await fetch(`${API_BASE_URL}/websites`, {
    credentials: "include",
    headers: {
      // Add auth headers if needed, but assuming session cookie for now
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch websites");
  }
  return response.json();
}

export async function getWebsiteTicks(id: string): Promise<Tick[]> {
  const response = await fetch(`${API_BASE_URL}/websites/${id}/ticks`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ticks for website ${id}`);
  }
  return response.json();
}

export interface Region {
  id: string;
  name: string;
}

export async function getRegions(): Promise<Region[]> {
  const response = await fetch(`${API_BASE_URL}/websites/regions/list`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch regions");
  }
  return response.json();
}

export async function createWebsite(data: { 
  url: string; 
  name?: string;
  frequency?: number;
  timeout?: number;
  regionIds?: string[];
}): Promise<Website> {
  const response = await fetch(`${API_BASE_URL}/websites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to create website");
  }
  return response.json();
}

export async function updateWebsite(id: string, data: { 
  url: string; 
  name?: string;
  frequency?: number;
  timeout?: number;
  regionIds?: string[];
}): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/websites/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to update website");
  }
}

export async function deleteWebsite(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/websites/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to delete website");
  }
}

export async function getWebsiteAnalytics(id: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/websites/${id}/analytics`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }
  return response.json();
}
