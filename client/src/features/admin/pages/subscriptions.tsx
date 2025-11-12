import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/authStore";
import { format } from "date-fns";

// Mock data - in a real app, this would come from an API
type Subscription = {
  id: string;
  userId: string;
  userEmail: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodEnd: string;
  amount: number;
  currency: string;
  createdAt: string;
};

const mockSubscriptions: Subscription[] = [
  {
    id: 'sub_1',
    userId: 'user_1',
    userEmail: 'user1@example.com',
    planId: 'pro',
    status: 'active',
    currentPeriodEnd: '2025-12-31T23:59:59Z',
    amount: 1900,
    currency: 'usd',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'sub_2',
    userId: 'user_2',
    userEmail: 'user2@example.com',
    planId: 'free',
    status: 'active',
    currentPeriodEnd: '2025-12-31T23:59:59Z',
    amount: 0,
    currency: 'usd',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'sub_3',
    userId: 'user_3',
    userEmail: 'user3@example.com',
    planId: 'pro',
    status: 'past_due',
    currentPeriodEnd: '2024-11-01T23:59:59Z',
    amount: 1900,
    currency: 'usd',
    createdAt: '2024-02-01T00:00:00Z',
  },
];

const statusVariantMap = {
  active: 'default',
  canceled: 'outline',
  past_due: 'destructive',
  unpaid: 'destructive',
} as const;

export const AdminSubscriptionsPage = () => {
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole('admin');

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground">
            Manage all user subscriptions
          </p>
        </div>
        <Button onClick={() => { }}>Export</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Renews On</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">
                    {subscription.userEmail}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {subscription.planId}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={statusVariantMap[subscription.status]}
                      className="capitalize"
                    >
                      {subscription.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {subscription.amount > 0
                      ? formatCurrency(subscription.amount, subscription.currency)
                      : 'Free'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(subscription.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubscriptionsPage;
