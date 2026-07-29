import { buildCrudRouter } from "./crudFactory.js";

// Vulnerable students / children needing sponsorship
const router = buildCrudRouter("children", { withImage: true, publicRead: true });

export default router;
