import prisma from "../lib/prisma";
import { generateRandomCode } from "../lib/randomCodeGenerator";
import { validateShortCode, validateUrl } from "../lib/urlValidation";
import { CreateLinkInput, LinkResponse } from "../types";

export class UrlService {
  //create a new short link
  async createLink(input: CreateLinkInput): Promise<LinkResponse> {
    const { longUrl, customCode } = input;

    //validate URL
    const urlValidation = validateUrl(longUrl);
    if (!urlValidation.valid) {
      throw new Error(urlValidation.error);
    }

    let shortCode: string;

    if (customCode) {
      //validate custom code
      const codeValidation = validateShortCode(customCode);
      if (!codeValidation.valid) {
        throw new Error(codeValidation.error);
      }

      //check if custom code already exists
      const existingCustomCode = await prisma.shortenUrl.findUnique({
        where: { shortCode: customCode },
      });

      if (existingCustomCode) {
        const error: any = new Error("Short code already exist");
        error.statusCode = 409;
        throw error;
      }

     
      shortCode = customCode;
    } else {
      //Generate random code and check for collision
      shortCode = generateRandomCode(6);
      let attempts = 0;
      do {
        shortCode = generateRandomCode(6);
        const existing = await prisma.shortenUrl.findUnique({
          where: { shortCode },
        });
        if (!existing) break;
        attempts++;
      } while (attempts < 5);

      if (attempts === 5) {
        throw new Error("Failed to generate unique code");
      }
    }

    //Create the link
    const link = await prisma.shortenUrl.create({
      data: {
        longUrl,
        shortCode,
      },
    });
    return link;
  }

  //Get all links
  async getAllLinks(): Promise<LinkResponse[]> {
    const links = await prisma.shortenUrl.findMany({
      orderBy: { createdAt: "desc" },
    });
    return links;
  }

  //Get single link by code
  async getLinkByCode(shortCode: string): Promise<LinkResponse | null> {
    const link = await prisma.shortenUrl.findUnique({
      where: { shortCode },
    });
    return link;
  }

  //Delete link
  async deleteLink(shortCode: string): Promise<void> {
    await prisma.shortenUrl.deleteMany({ //using deleteMany instead of delete because in prisma delete return an error if no record found. 
      where: { shortCode },
    });
  }

  //Increment click count (redirect)
  async incrementClick(shortCode: string): Promise<string | null> {
    const link = await prisma.shortenUrl.findUnique({
      where: { shortCode },
    });

    if (!link) {
      return null;
    }
    await prisma.shortenUrl.update({
      where: { shortCode },
      data: {
        clickCount: { increment: 1 },
        lastClickedAt: new Date(),
      },
    });

    return link.longUrl;
  }
}

export const urlService = new UrlService();
