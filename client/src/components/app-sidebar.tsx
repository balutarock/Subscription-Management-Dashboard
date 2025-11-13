import { Calendar, Home, Inbox, Search } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuthStore } from "@/features/auth/authStore";

// Menu items.
const userItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Plans",
        url: "/plans",
        icon: Inbox,
    }
]

const adminItems = [
    {
        title: "Admin Subscriptions",
        url: "/admin/subscriptions",
        icon: Search,
    },
]

const dashboardItems = {
    admin: adminItems,
    user: userItems
}

import logo from "../../public/gnxtace.png"

export function AppSidebar() {
    const user = useAuthStore((state) => state.user);
    const role = user?.roles?.[0] || "user";
    const items = dashboardItems[role]
    return (
        <Sidebar>
            <SidebarHeader className="pt-4 flex items-center">
                <img src={logo} alt="gnxtace logo" className="w-36" />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    {/* <SidebarGroupLabel>Subscriptions Management</SidebarGroupLabel> */}
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items?.map((item) => (
                                <SidebarMenuItem key={item.title} className="bg-primary">
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}