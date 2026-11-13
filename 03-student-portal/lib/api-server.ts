import "server-only";
import axios from "axios";
import { cookies } from "next/headers";

// ApiServer (slide 019): used in Server Components. There is no browser here
// to attach the cookie, so we read it ourselves and send it as a Bearer token.
export default async function apiserver() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  return axios.create({
    baseURL: process.env.API_URL ?? "http://localhost:4000",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
