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
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getAllSubscriptions } from "../api";
import { useAuthStore } from "@/features/auth/authStore";
import type { Subscription } from "../types";


const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500">Active</Badge>;
    case 'canceled':
      return <Badge variant="outline">Canceled</Badge>;
    case 'past_due':
      return <Badge className="bg-yellow-500">Past Due</Badge>;
    case 'unpaid':
      return <Badge className="bg-red-500">Unpaid</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const AdminSubscriptionsPage = () => {
  const { hasRole } = useAuthStore();
  const isAdmin = hasRole('admin');

  const { data: subscriptionsData, isLoading } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: getAllSubscriptions,
  });

  // Use mock data if API doesn't return any data (for demo purposes)
  const subscriptions = subscriptionsData as Subscription[];
  if (!isAdmin) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions?.map((subscription: Subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{subscription.user.name}</span>
                      <span className="text-xs text-gray-500">{subscription.user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{subscription.plan.name}</div>
                    <div className="text-xs text-gray-500">{subscription.plan.duration} days</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    ${subscription.plan.price.toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                  <TableCell>{formatDate(subscription.startDate)}</TableCell>
                  <TableCell>{formatDate(subscription.endDate)}</TableCell>
                  <TableCell>{formatDate(subscription.createdAt)}</TableCell>
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
