import { Router } from "express";

import { HealthController } from "@/controllers/health.controller";

const router = Router();

router.get("/live", HealthController.live);
router.get("/ready", HealthController.ready);

export default router;
