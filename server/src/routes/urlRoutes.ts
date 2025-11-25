import { Router } from "express";
import { createLink, deleteLink, getAllLinks, getLinkStats } from "../controllers/urlControllers";

export const urlRoutes: any = Router();

urlRoutes.get("/links", getAllLinks)
urlRoutes.post("/links", createLink)
urlRoutes.get("/links/:code", getLinkStats)
urlRoutes.delete("/links/:code", deleteLink)
