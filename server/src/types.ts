export interface UrlValidationResult {
  valid: boolean;
  error?: string;
}

export interface CodeValidationResult {
  valid: boolean;
  error?: string;
}

export interface CreateLinkInput {
  longUrl: string;
  customCode?: string;
}

export interface LinkResponse {
  id: number;
  longUrl: string;
  shortCode: string;
  clickCount: number;
  lastClickedAt: Date | null;
  createdAt: Date;
}