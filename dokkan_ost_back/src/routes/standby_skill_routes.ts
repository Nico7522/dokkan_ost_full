import { Router, Request, Response } from "express";
import pool from "../db/db";
import { activeSkillChecker, standBySkillChecker } from "../utils/checker";
import { ActiveSkill } from "../interfaces/active_skill";
import { StandBySkill } from "../interfaces/standby_skill";
const standBySkillRoutes = Router();

standBySkillRoutes.get(
  "/standbyskills",
  async (req: Request, res: Response) => {
    try {
      const results = await pool.query("SELECT * FROM standby_skills");
      res.json(results.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching standby skills" });
    }
  }
);

standBySkillRoutes.post(
  "/standbyskills",
  async (req: Request, res: Response) => {
    const { id, bgm_id, description, card_id } = req.body;
    const standBySkill: StandBySkill = {
      id: +id,
      description,
      bgmId: +bgm_id,
      cardId: +card_id,
    };
    console.log(standBySkill);

    const isValid = standBySkillChecker(standBySkill);
    if (!isValid) {
      res.status(500).json({ error: "Invalid data" });
      return;
    }

    try {
      const text =
        "INSERT INTO standby_skills (id, description, bgm_id, card_id) VALUES ($1, $2, $3, $4)";
      const values = [
        standBySkill.id,
        standBySkill.description,
        standBySkill.bgmId,
        standBySkill.cardId,
      ];
      await pool.query(text, values);
      res.status(201).json({ message: "Created" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }
);

export default standBySkillRoutes;
