import { buildCrudRouter } from "./crudFactory.js";

const router = buildCrudRouter("children", {
  withImage: true,
  publicRead: true,
});

export default router;