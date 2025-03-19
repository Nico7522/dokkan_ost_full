import { Router, Request, Response } from "express";
import pool from "../db/db";
import { Bgm } from "../interfaces/bgm";
import { bgmChecker } from "../utils/checker";

const bgmRoutes = Router();

bgmRoutes.get("/bgm", async (req: Request, res: Response) => {
  try {
    const results = await pool.query("SELECT * FROM background_music");
    res.json(results.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching bgm" });
  }
});

bgmRoutes.post("/bgm", async (req: Request, res: Response) => {
  const { id, description } = req.body;
  const bgm: Bgm = {
    id: +id,
    description,
  };

  const isValid = bgmChecker(bgm);
  if (!isValid) {
    res.status(500).json({ error: "Invalid data" });
    return;
  }

  try {
    const text =
      "INSERT INTO background_music (id, description) VALUES ($1, $2)";
    const values = [bgm.id, bgm.description];
    await pool.query(text, values);
    res.status(201).json({ message: "Created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

export default bgmRoutes;
