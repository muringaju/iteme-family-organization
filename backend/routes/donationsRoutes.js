import { buildCrudRouter } from "./crudFactory.js";
import { protect } from "../middleware/auth.js";

const router = buildCrudRouter("donations", {
  withImage: false,

  // Public users can create donations
  publicRead: true,

  // Only authenticated admin can change status
  protectUpdate: protect,

  // Only authenticated admin can delete
  protectDelete: protect,
});

export default router;