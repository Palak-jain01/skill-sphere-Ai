import { Router, type IRouter } from "express";
import healthRouter from "./health";
import skillsphereRouter from "./skillsphere";

const router: IRouter = Router();

router.use(healthRouter);
router.use(skillsphereRouter);

export default router;
