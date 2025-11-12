import { db } from "../../prisma/index";

interface SubscribeToPlanParams {
  userId: string;
  planId: string;
  paymentMethodId?: string;
  coupon?: string;
}

export const subscribeToPlan = async ({
  userId,
  planId,
}: SubscribeToPlanParams) => {
  // Check if plan exists
  const plan = await db.plan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    throw new Error("Plan not found");
  }

  // Check if user already has an active subscription
  const existingSubscription = await db.subscription.findFirst({
    where: {
      userId,
      status: {
        in: ["active", "trialing", "past_due"],
      },
    },
  });

  if (existingSubscription) {
    throw new Error("User already has an active subscription");
  }

  // Here you would typically integrate with a payment provider like Stripe
  // This is a simplified version
  const subscription = await db.subscription.create({
    data: {
      userId,
      planId,
      status: "active",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    include: {
      plan: true,
    },
  });

  return subscription;
};

export const getUserSubscription = async (userId: string) => {
  return await db.subscription.findFirst({
    where: {
      userId,
      status: {
        in: ["active", "trialing", "past_due"],
      },
    },
    include: {
      plan: true,
    },
  });
};

export const getAllSubscriptions = async () => {
  return await db.subscription.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      plan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
