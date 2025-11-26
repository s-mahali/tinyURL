import { Request, Response } from "express";
import { urlService } from "../services/urlService";
import { CreateLinkInput } from "../types";

// POST: api/link create a link
export async function createLink(req: Request, res: Response) {
  try {
    const { longUrl, code } = req.body;
    if (!longUrl) {
      return res
        .status(400)
        .json({ error: "longUrl is required", message: false });
    }

    const link = await urlService.createLink({ longUrl, customCode: code });
    
    const baseUrl = process.env.BASE_URL || "http://localhost:5000"

    return res.status(201).json({
      message: "Shorten Url created successfully",
      success: true,
      shortCode: `${baseUrl}/${link.shortCode}`,
    });
  } catch (error: any) {
    if (error.statusCode === 409) {
      return res.status(409).json({ error: error.message });
    }
    return res.status(400).json({ error: error.message });
  }
}

// GET: api/link get all links
export async function getAllLinks(req: Request, res: Response) {
  try {
    const links = await urlService.getAllLinks();
    return res.status(200).json({ links });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// GET: api/links/:code - Get stats for one link
export async function getLinkStats(req: Request, res: Response) {
  try {
    const { code } = req.params;
    const link = await urlService.getLinkByCode(code as string);

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    return res.status(200).json(link);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// DELETE: api/links/:code - Delete link
export async function deleteLink(req: Request, res: Response) {
  try {
    const { code } = req.params;
    await urlService.deleteLink(code as string);
    return res.status(200).json({ message: "Link deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// GET /:code - Redirect to original URL
export async function redirectToUrl(req: Request, res: Response) {
  try {
    const { code } = req.params;

    const longUrl = await urlService.incrementClick(code as string);

    if (!longUrl) {
      return res.status(404).json({ error: "Link not found" });
    }

    return res.redirect(302, longUrl);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
