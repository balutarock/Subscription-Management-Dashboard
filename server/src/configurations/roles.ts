/**
 * Available permissions in the system
 */
export const PERMISSIONS = {
  // Subscription Management
  CREATE_SUBSCRIPTION: "CreateSubscription",
  GET_MY_SUBSCRIPTION: "GetMySubscription",
  GET_ALL_SUBSCRIPTIONS: "GetAllSubscriptions",
} as const;

/**
 * Role-based permissions configuration
 * Each role is assigned specific permissions based on their responsibilities
 */
const ROLE_PERMISSIONS = {
  admin: [
    // Subscription Management
    PERMISSIONS.CREATE_SUBSCRIPTION,
    PERMISSIONS.GET_MY_SUBSCRIPTION,
    PERMISSIONS.GET_ALL_SUBSCRIPTIONS,
  ],

  user: [
    // Subscription Management
    PERMISSIONS.CREATE_SUBSCRIPTION,
    PERMISSIONS.GET_MY_SUBSCRIPTION,
  ],
} as const;

// Export the roles and role rights for use in RBAC
export const roles: string[] = Object.keys(ROLE_PERMISSIONS);
export const roleRights: Map<string, string[]> = new Map(
  Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => [
    role,
    [...permissions],
  ])
);
