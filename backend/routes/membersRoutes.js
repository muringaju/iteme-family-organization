import { buildCrudRouter } from "./crudFactory.js";

const router = buildCrudRouter("members", {
  withImage: true,
  publicRead: true,
});

export default router;