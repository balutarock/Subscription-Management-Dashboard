import { LayoutDashboard, LogOut, TicketsPlane } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useAuthStore } from "@/features/auth/authStore";
import { useLocation, useNavigate } from "react-router-dom";

type MenuItem = {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
} & (
    | { url: string; action?: never }
    | { url?: never; action: true }
);

// Common items with sign out action
const commonItems: MenuItem[] = [
    {
        title: "Sign Out",
        icon: LogOut,
        action: true
    },
];

// Menu items for regular users
const userItems: MenuItem[] = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Plans",
        url: "/plans",
        icon: TicketsPlane,
    },
    ...commonItems
];

// Menu items for admin users
const adminItems: MenuItem[] = [
    {
        title: "Subscriptions",
        url: "/admin/subscriptions",
        icon: TicketsPlane,
    },
    ...commonItems
];

const dashboardItems = {
    admin: adminItems,
    user: userItems
} as const;

import logo from "/gnxtace.png"

export function AppSidebar() {
    const user = useAuthStore((state) => state.user);
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const role = (user?.roles?.[0] as keyof typeof dashboardItems) || "user";
    const items = dashboardItems[role] || [];
    const currentPath = location.pathname;

    const handleLogout = async () => {
        await logout();
        navigate('/sign-in');
    };

    const handleItemClick = (item: MenuItem) => (e: React.MouseEvent) => {
        if (item.url) {
            e.preventDefault();
            navigate(item.url);
        }
    };

    return (
        <Sidebar>
            <SidebarHeader className="pt-4 flex items-center">
                <img src={logo} alt="gnxtace logo" className="w-36" />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {item.action ? (
                                        <div className="w-full">
                                            <ConfirmDialog
                                                title="Sign Out"
                                                description="Are you sure you want to sign out?"
                                                confirmText="Sign Out"
                                                onConfirm={handleLogout}
                                            >
                                                <SidebarMenuButton 
                                                    className="w-full text-left text-primary hover:bg-accent"
                                                >
                                                    <item.icon className="w-5 h-5 mr-2" />
                                                    <span>{item.title}</span>
                                                </SidebarMenuButton>
                                            </ConfirmDialog>
                                        </div>
                                    ) : (
                                        <SidebarMenuButton 
                                            asChild 
                                            className={`${currentPath === item.url ? "bg-primary hover:bg-primary text-white hover:text-white" : "text-primary hover:bg-accent"}`}
                                        >
                                            <a 
                                                href={item.url} 
                                                className="w-full flex items-center"
                                                onClick={handleItemClick(item)}
                                            >
                                                <item.icon className="w-5 h-5 mr-2" />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}