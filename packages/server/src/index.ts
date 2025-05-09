import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/welcome", (req: Request, res: Response, next: NextFunction) => {
  res.send("welcome!");
});

app.listen("3333", () => {
  console.log(`
  ################################################
  🛡️  Server listening on port: 3333🛡️
  ################################################
`);
});

app.get("/api", (req: Request, res: Response, next: NextFunction) => {
  console.log(req);
  res.json("API is working!");
});
