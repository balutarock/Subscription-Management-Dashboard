import { db } from "../../prisma";

export const getPlans = async () => {
  return await db.plan.findMany();
};
