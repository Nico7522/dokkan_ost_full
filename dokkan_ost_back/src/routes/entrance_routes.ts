import { Router, Request, Response } from "express";
import pool from "../db/db";
import { cardChecker, entranceChecker } from "../utils/checker";
import { Entrance } from "../interfaces/entrance";
const entranceRoutes = Router();

entranceRoutes.get("/entrances", async (req: Request, res: Response) => {
  try {
    const results = await pool.query("SELECT * FROM entrances");
    res.json(results.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching entrances" });
  }
});

entranceRoutes.post("/entrances", async (req: Request, res: Response) => {
  const { id, bgm_id, name, card_id } = req.body;
  const entrance: Entrance = {
    id: +id,
    name,
    bgmId: +bgm_id,
    cardId: +card_id,
  };
  console.log(entrance);

  const isValid = entranceChecker(entrance);
  if (!isValid) {
    res.status(500).json({ error: "Invalid data" });
    return;
  }

  try {
    const text =
      "INSERT INTO entrances (id, name, bgm_id, card_id) VALUES ($1, $2 , $3, $4)";
    const values = [
      entrance.id,
      entrance.name,
      entrance.bgmId,
      entrance.cardId,
    ];
    await pool.query(text, values);
    res.status(201).json({ message: "Created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

export default entranceRoutes;
