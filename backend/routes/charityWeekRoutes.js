import { buildCrudRouter } from "./crudFactory.js";

const router = buildCrudRouter("charityWeeks", { withImage: true, publicRead: true });

export default router;
