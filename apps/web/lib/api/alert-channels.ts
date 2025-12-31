const API_BASE_URL = "http://localhost:3001";

export interface AlertChannel {
  id: string;
  name: string;
  type: "Email" | "Slack" | "SMS" | "Voice";
  target: string;
  active: boolean;
  createdAt: string;
}

export async function getAlertChannels(): Promise<AlertChannel[]> {
  const response = await fetch(`${API_BASE_URL}/alert-channels`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch alert channels");
  }
  return response.json();
}

export async function createAlertChannel(data: Partial<AlertChannel>): Promise<AlertChannel> {
  const response = await fetch(`${API_BASE_URL}/alert-channels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to create alert channel");
  }
  return response.json();
}

export async function updateAlertChannel(id: string, data: Partial<AlertChannel>): Promise<AlertChannel> {
  const response = await fetch(`${API_BASE_URL}/alert-channels/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to update alert channel");
  }
  return response.json();
}

export async function deleteAlertChannel(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/alert-channels/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to delete alert channel");
  }
}
