import { Router } from "express";

import noteRoutes from "@/routes/v1/note.route";
import healthRoutes from "@/routes/v1/health.route";

const router = Router();

router.use("/notes", noteRoutes);
router.use("/health", healthRoutes);

export default router;
