import express from "express";
import { GameEngine } from "../game/GameEngine";

export const gameRouter = express.Router();
const game = new GameEngine();

gameRouter.post("/player", (req, res) => {
  const { name } = req.body;
  game.addPlayer(name);
  res.json({ message: `Jogador ${name} adicionado.` });
});
