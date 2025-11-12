import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/authStore";
import { useNavigate } from "react-router-dom";

export const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  console.log("user >> ", user);
  const navigate = useNavigate();
  const subscriptionStatus = user?.subscription?.status || 'none';
  const planName = user?.subscription?.planId || 'No active plan';

  const handleUpgrade = () => {
    navigate('/plans');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/sign-in');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button variant="default" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-medium">{planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium capitalize">{subscriptionStatus}</span>
              </div>
              {user?.subscription?.currentPeriodEnd && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Renews on:</span>
                  <span className="font-medium">
                    {new Date(user.subscription.currentPeriodEnd).toLocaleDateString()}
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
