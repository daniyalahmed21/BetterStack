const API_BASE_URL = "http://localhost:3001";

export interface StatusPage {
  id: string;
  name: string;
  slug: string;
  status: "Draft" | "Published";
  websites?: any[];
  createdAt: string;
}

export async function getStatusPages(): Promise<StatusPage[]> {
  const response = await fetch(`${API_BASE_URL}/status-pages`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch status pages");
  }
  return response.json();
}

export async function createStatusPage(data: {
  name: string;
  slug: string;
  websiteIds?: string[];
}): Promise<StatusPage> {
  const response = await fetch(`${API_BASE_URL}/status-pages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to create status page");
  }
  return response.json();
}

export async function updateStatusPage(id: string, data: Partial<StatusPage> & { websiteIds?: string[] }): Promise<StatusPage> {
  const response = await fetch(`${API_BASE_URL}/status-pages/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to update status page");
  }
  return response.json();
}

export async function deleteStatusPage(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/status-pages/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to delete status page");
  }
}

export async function getPublicStatusPage(slug: string): Promise<StatusPage> {
  const response = await fetch(`${API_BASE_URL}/status-pages/public/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch public status page");
  }
  return response.json();
}
