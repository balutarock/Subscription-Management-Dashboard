import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/authStore";
import { getCurrentSubscription } from "@/features/plans/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const subscriptionStatus = user?.subscription?.status || 'none';

  const handleUpgrade = () => {
    navigate('/plans');
  };



  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: currentPlanData }: { data: any } = useQuery({
    queryKey: ['my-subscription'],
    queryFn: getCurrentSubscription,
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-medium">{currentPlanData?.data?.plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium capitalize">{currentPlanData?.data?.status}</span>
              </div>
              {currentPlanData?.data?.endDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Renews on:</span>
                  <span className="font-medium">
                    {new Date(currentPlanData?.data?.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {subscriptionStatus !== 'active' && (
                <Button className="mt-4 w-full" onClick={handleUpgrade}>
                  Upgrade Plan
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium">{user?.roles.join(', ')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
