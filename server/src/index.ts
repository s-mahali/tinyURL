import express, { Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { urlRoutes } from "./routes/urlRoutes";
import {redirectToUrl} from "./controllers/urlControllers"

dotenv.config()
const app = express();
const port = process.env.PORT || 5000;

//Middleware
const corsOptions = {
  origin: [process.env.BASE_URL || 'http://localhost:3000'],
  credentials: true,
};   
app.use(cors(corsOptions))
console.log("nodeenv", process.env.BASE_URL, process.env.NODE_ENV)

app.use(express.json())

//Health check endpoint
app.get('/healthz', (req:Request, res: Response) => {
    res.status(200).json({
    ok: true,
    version: '1.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
})

//URL routes 
app.use('/api', urlRoutes)

//redirect route
app.get('/:code', redirectToUrl)

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

 