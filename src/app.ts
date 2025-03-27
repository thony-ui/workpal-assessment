import express from "express";
import dotenv from "dotenv";
import { defineStudentManagementRoutes } from "./modules/student-management";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();
const app = express();

app.use(express.json());

app.get("/", (req: express.Request, res: express.Response) => {
  res.json({ message: "Hello World" });
});

defineStudentManagementRoutes(app);

app.use(errorHandler);

const PORT = process.env.PORT || 9998;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

export { app, server };
