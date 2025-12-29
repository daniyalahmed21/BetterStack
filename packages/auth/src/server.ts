import { auth } from "./index";

export async function getSessionFromToken(token: string) {
  return auth.api.getSession({
    headers: {
      authorization: `Bearer ${token}`
    }
  });
}
