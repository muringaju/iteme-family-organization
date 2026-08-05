import { buildCrudRouter } from "./crudFactory.js";

const router = buildCrudRouter("reports", {
  withImage: false,
  publicRead: true,
});

export default router;