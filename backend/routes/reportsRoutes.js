import { buildCrudRouter } from "./crudFactory.js";

// Annual / financial / activity reports (image field doubles as a cover image)
const router = buildCrudRouter("reports", { withImage: true, publicRead: true });

export default router;
