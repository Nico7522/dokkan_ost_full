import { Router, Request, Response } from "express";
import pool from "../db/db";
import { Card } from "../interfaces/card";
import { cardChecker } from "../utils/checker";
const cardRoutes = Router();

cardRoutes.get("/cards", async (req: Request, res: Response) => {
  try {
    const results = await pool.query("SELECT * FROM cards");
    res.json(results.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching cards" });
  }
});

cardRoutes.get("/cards/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const text =
      "SELECT cards.*, entrances.bgm_id AS entrance_bgm_id, active_skills.bgm_id AS as_bgm_id FROM cards FULL JOIN entrances ON cards.id = entrances.card_id FULL JOIN active_skills ON active_skills.card_id = cards.id WHERE cards.id = $1";
    const values = [id];
    const results = await pool.query(text, values);
    console.log(results.rows[0]);

    res.json(results.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Card not found" });
  }
});
cardRoutes.post("/cards", async (req: Request, res: Response) => {
  const card: Card = req.body;
  card.id = +card.id;

  const isValid = cardChecker(card);
  if (!isValid) {
    res.status(500).json({ error: "Invalid data" });
    return;
  }

  try {
    const text =
      "INSERT INTO cards (id, name, type, class) VALUES ($1, $2 , $3, $4)";
    const values = [card.id, card.name, card.type, card.class];
    await pool.query(text, values);
    res.status(201).json({ message: "Created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

cardRoutes.put("/thumbs/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { thumb } = req.body;
    console.log("id params", id);
    console.log("thumb", thumb);

    const text = "UPDATE cards SET thumb = $1 WHERE id = $2";
    const values = [thumb, id];
    const result = await pool.query(text, values);
    console.log(result);

    res.status(200).json({ message: "thumb added" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error });
  }
});

cardRoutes.put("/is-legendary/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_legendary } = req.body;
    console.log("id params", id);
    console.log("is legandary", is_legendary);

    const text = "UPDATE cards SET is_legendary = $1 WHERE id = $2";
    const values = [is_legendary, id];
    const result = await pool.query(text, values);
    console.log(result);

    res.status(200).json({ message: "legendary value modified" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

export default cardRoutes;
