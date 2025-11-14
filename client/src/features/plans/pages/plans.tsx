/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useAuthStore } from "@/features/auth/authStore";
import { toast } from "sonner";
import { useCreateSubscription } from '../queries';
import { useQuery } from '@tanstack/react-query';
import { getCurrentSubscription, getPlans } from '../api';

export const PlansPage = () => {
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole('admin');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const { mutate: createSubscription } = useCreateSubscription(selectedPlanId);

  const { data: plansData, isLoading, error } = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
  });


  const { data: currentPlanData }: { data: any } = useQuery({
    queryKey: ['my-subscription'],
    queryFn: getCurrentSubscription,
  });


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading plans. Please try again later.</p>
      </div>
    );
  }

  const handleSelectPlan = (planId: string) => {
    if (planId === 'enterprise') {
      // Handle enterprise contact
      toast.info("Enterprise plan selected. Please contact sales for more information.");
      return;
    }

    // Set the selected plan ID and trigger the subscription
    setSelectedPlanId(planId);
    createSubscription(); // Pass any additional subscription data here if needed

  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground">Select the plan that fits your needs</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plansData?.data?.map((plan) => (
          <Card
            key={plan.id}
            className={`relative overflow-hidden ${currentPlanData?.data?.plan.id === plan.id ? 'border-2 border-primary' : ''}`}
          >
            {currentPlanData?.data?.plan.id === plan.id && (
              <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 absolute right-0 top-4 rounded-l-full">
                Current Plan
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="flex items-baseline mt-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.id !== 'enterprise' && <span className="text-muted-foreground ml-1">/month</span>}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button
                className="w-full"
                // variant={plan.buttonVariant}
                variant="default"
                disabled={plan.id === currentPlanData?.data?.plan.id}
                onClick={() => handleSelectPlan(plan.id)}
              >
                Subscribe
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {isAdmin && (
        <div className="mt-12 text-center">
          <Button variant="link" onClick={() => window.location.href = '/admin/subscriptions'}>
            Go to Admin Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlansPage;
