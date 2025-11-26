import axios from "axios";
import { Link, CreateLinkInput, CreateLinkResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//create a short link
export async function createLink(
  data: CreateLinkInput
): Promise<CreateLinkResponse> {
  const response = await api.post("/api/links", data);
  return response.data;
}

//get all links
export async function getAllLinks(): Promise<Link[]> {
  const response = await api.get("/api/links");
  return response.data.links;
}

//get single link stats
export async function getLinkByCode(code: string): Promise<Link> {
  const response = await api.get(`/api/links/${code}`);
  return response.data;
}

//delete link
export async function deleteLink(code: string): Promise<void> {
  await api.delete(`/api/links/${code}`);
}

// health check
export async function healthCheck() {
  const response = await api.get("/healthz");
  return response.data;
}
