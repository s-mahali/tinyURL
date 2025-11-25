import express from "express"
import cors from "cors"

const app = express();
const port = process.env.PORT || 5000;

//cors config
app.use(cors({
  origin: process.env.NODE_ENV === 'PROD' ? "" : "http://localhost:3000",
  credentials: true
}))

//express middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send("tinyURL")
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

 