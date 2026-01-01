const API_BASE_URL = "http://localhost:3001";

export interface Heartbeat {
  id: string;
  name: string;
  status: "Up" | "Down" | "Pending";
  period: number;
  grace: number;
  lastPingAt: string | null;
  createdAt: string;
}

export async function getHeartbeats(): Promise<Heartbeat[]> {
  const response = await fetch(`${API_BASE_URL}/heartbeats`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch heartbeats");
  }
  return response.json();
}

export async function createHeartbeat(data: {
  name: string;
  period?: number;
  grace?: number;
}): Promise<Heartbeat> {
  const response = await fetch(`${API_BASE_URL}/heartbeats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to create heartbeat");
  }
  return response.json();
}

export async function updateHeartbeat(id: string, data: Partial<Heartbeat>): Promise<Heartbeat> {
  const response = await fetch(`${API_BASE_URL}/heartbeats/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to update heartbeat");
  }
  return response.json();
}

export async function deleteHeartbeat(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/heartbeats/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to delete heartbeat");
  }
}
