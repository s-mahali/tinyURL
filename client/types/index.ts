export interface Link {
  id: number;
  longUrl: string;
  shortCode: string;
  clickCount: number;
  lastClickedAt: string | null;
  createdAt: string;
}

export interface CreateLinkResponse {
  id: number;
  longUrl: string;
  shortCode: string;
  shortUrl: string;
  clickCount: number;
  createdAt: string;
}

export interface CreateLinkInput {
  longUrl: string;
  code?: string;
}

export interface ApiError {
  error: string;
}