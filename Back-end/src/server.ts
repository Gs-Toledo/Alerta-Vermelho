import express from "express";
import { gameRouter } from "./routes/gameRoutes";

const app = express();
app.use(express.json());
app.use("/api/game", gameRouter);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
