import { buildCrudRouter } from "./crudFactory.js";

const router = buildCrudRouter("staff", { withImage: true, publicRead: true });

export default router;
