import { Router, Request, Response } from "express";
import pool from "../db/db";
import {
  activeSkillChecker,
  finishSkillChecker,
  standBySkillChecker,
} from "../utils/checker";
import { ActiveSkill } from "../interfaces/active_skill";
import { StandBySkill } from "../interfaces/standby_skill";
import { FinishSkill } from "../interfaces/finish_skill";
const finishSkillRoutes = Router();

finishSkillRoutes.get("/finishskills", async (req: Request, res: Response) => {
  try {
    const results = await pool.query("SELECT * FROM finish_skills");
    res.json(results.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching standby skills" });
  }
});

finishSkillRoutes.post("/finishskills", async (req: Request, res: Response) => {
  const { id, bgm_id, name, standby_skill_id } = req.body;
  const finishSkill: FinishSkill = {
    id: +id,
    name,
    bgmId: +bgm_id,
    standBySkillId: +standby_skill_id,
  };
  console.log(finishSkill);

  const isValid = finishSkillChecker(finishSkill);
  if (!isValid) {
    res.status(500).json({ error: "Invalid data" });
    return;
  }

  try {
    const text =
      "INSERT INTO finish_skills (id, name, bgm_id, standby_skill_id) VALUES ($1, $2, $3, $4)";
    const values = [
      finishSkill.id,
      finishSkill.name,
      finishSkill.bgmId,
      finishSkill.standBySkillId,
    ];
    await pool.query(text, values);
    res.status(201).json({ message: "Created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

export default finishSkillRoutes;
