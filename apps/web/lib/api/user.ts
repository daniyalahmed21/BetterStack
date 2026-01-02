const API_BASE_URL = "http://localhost:3001";

export interface User {
  id: string;
  name: string;
  organizationName?: string;
  email: string;
  image?: string;
}

export const getUser = async (): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
};

export const updateUser = async (data: Partial<User>): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to update user");
  }
  return response.json();
};
