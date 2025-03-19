import { Router, Request, Response } from "express";
import pool from "../db/db";
import { activeSkillChecker } from "../utils/checker";
import { ActiveSkill } from "../interfaces/active_skill";
const activeSkillRoutes = Router();

activeSkillRoutes.get("/active-skills", async (req: Request, res: Response) => {
  try {
    const results = await pool.query("SELECT * FROM active_skills");
    res.json(results.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching active skills" });
  }
});

activeSkillRoutes.post(
  "/active-skills",
  async (req: Request, res: Response) => {
    const { id, bgm_id, name, card_id } = req.body;
    const activeSkill: ActiveSkill = {
      id: +id,
      name,
      bgmId: +bgm_id,
      cardId: +card_id,
    };
    console.log(activeSkill);

    const isValid = activeSkillChecker(activeSkill);
    if (!isValid) {
      res.status(500).json({ error: "Invalid data" });
      return;
    }

    try {
      const text =
        "INSERT INTO active_skills (id, name, bgm_id, card_id) VALUES ($1, $2 , $3, $4)";
      const values = [
        activeSkill.id,
        activeSkill.name,
        activeSkill.bgmId,
        activeSkill.cardId,
      ];
      await pool.query(text, values);
      res.status(201).json({ message: "Created" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }
);

export default activeSkillRoutes;
