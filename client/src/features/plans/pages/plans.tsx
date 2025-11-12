import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/features/auth/authStore";

type Plan = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
};

export const PlansPage = () => {
  const { user, hasRole } = useAuthStore();
  const currentPlanId = user?.subscription?.planId;
  const isAdmin = hasRole('admin');

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started',
      features: [
        'Basic features',
        'Limited access',
        'Community support',
      ],
      buttonText: currentPlanId === 'free' ? 'Current Plan' : 'Get Started',
      buttonVariant: currentPlanId === 'free' ? 'outline' : 'default',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19',
      description: 'For professionals and small teams',
      features: [
        'All Free features',
        'Advanced features',
        'Priority support',
        'API access',
      ],
      popular: true,
      buttonText: currentPlanId === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
      buttonVariant: currentPlanId === 'pro' ? 'outline' : 'default',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'All Pro features',
        'Dedicated support',
        'Custom integrations',
        'SLA 99.9%',
        'Onboarding & training',
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline',
    },
  ];

  const handleSelectPlan = (planId: string) => {
    if (planId === 'enterprise') {
      // Handle enterprise contact
      return;
    }

    // In a real app, you would redirect to a checkout page or handle subscription change
    console.log(`Selected plan: ${planId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground">Select the plan that fits your needs</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative overflow-hidden ${plan.popular ? 'border-2 border-primary' : ''}`}
          >
            {plan.popular && (
              <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 absolute right-0 top-4 rounded-l-full">
                Most Popular
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
                variant={plan.buttonVariant}
                disabled={plan.id === currentPlanId}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.buttonText}
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
