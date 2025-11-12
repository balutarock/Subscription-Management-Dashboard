import { z } from "zod";

export const subscribeToPlanValidation = z.object({
  paymentMethodId: z.string().optional(),
  coupon: z.string().optional(),
});

export const SubscribeToPlanValidation = z.object({
  params: z.object({
    planId: z.string().min(1, "Plan ID is required"),
  }),
  body: subscribeToPlanValidation,
});

export type SubscribeToPlanInput = z.infer<typeof subscribeToPlanValidation>;
