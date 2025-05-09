import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/welcome", (req: Request, res: Response, next: NextFunction) => {
  res.send("welcome!");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: ${PORT} 🛡️
  ################################################
`);
});

app.get("/api", (req: Request, res: Response, next: NextFunction) => {
  console.log(req);
  res.json("API is working!");
});
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log(req);
  res.json("API is working!");
});
