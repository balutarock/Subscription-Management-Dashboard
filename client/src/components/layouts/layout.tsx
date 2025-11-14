import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <div className="flex min-h-screen bg-background">
            <SidebarProvider>
                <div className="fixed inset-y-0 left-0 w-64 h-screen">
                    <AppSidebar />

                </div>
                <div className="flex-1">
                    <main>
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </div>
    )
}