"use client";

import { BrainCircuit, Target, Network, BarChart3, GraduationCap, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import { EducationalTooltip } from "@/components/ui/educational-tooltip";
import { getEthicalTooltip } from "@/lib/ethical-design-tooltips";
import { useTooltipLayers } from "@/context/TooltipLayerContext";
import { cn } from "@/lib/utils";

// Menu items
const navItems = [
    { href: "/problems", label: "Problems", icon: Target, tooltipId: "nav_problems" },
    { href: "/graph", label: "Concepts", icon: Network, tooltipId: "nav_concepts" },
    { href: "/journey-summary", label: "Progress", icon: BarChart3, tooltipId: "nav_progress" },
    { href: "/settings", label: "Settings", icon: Settings, tooltipId: "nav_settings" },
];

const teacherItem = { href: "/teacher", label: "Teacher", icon: GraduationCap, tooltipId: "teacher_view" };

export function AppSidebar() {
    const pathname = usePathname();
    const { visibleLayers } = useTooltipLayers();
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                {/* Header / Logo Area inside Sidebar */}
                <div
                    className={cn(
                        "p-4 flex items-center gap-2 border-b transition-colors",
                        isCollapsed ? "justify-center p-2 cursor-pointer hover:bg-sidebar-accent rounded-md my-2 mx-1" : ""
                    )}
                    onClick={() => isCollapsed && toggleSidebar()}
                    title={isCollapsed ? "Click to expand" : undefined}
                >
                    <BrainCircuit className="h-6 w-6 text-primary" />
                    {!isCollapsed && <span className="font-bold font-headline text-lg">KAITE</span>}
                </div>

                <SidebarGroup>
                    <SidebarGroupLabel>Learning Journey</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                const tooltipDef = getEthicalTooltip(item.tooltipId);

                                const ButtonElement = (
                                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                );

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        {tooltipDef ? (
                                            <EducationalTooltip
                                                content={tooltipDef.content}
                                                ethicalDesign={tooltipDef.ethicalDesign}
                                                pedagogy={tooltipDef.pedagogy}
                                                visibleLayers={visibleLayers}
                                                side="right"
                                            >
                                                {/* We need a div wrapper because EducationalTooltip might expect a single child ref,
                             and SidebarMenuButton asChild renders Link.
                             Actually, let's just wrap the button. */}
                                                {ButtonElement}
                                            </EducationalTooltip>
                                        ) : (
                                            ButtonElement
                                        )}
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-auto">
                    <SidebarGroupLabel>Instructor</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === teacherItem.href} tooltip={teacherItem.label}>
                                    <Link href={teacherItem.href}>
                                        <teacherItem.icon />
                                        <span>{teacherItem.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={toggleSidebar} tooltip={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
                            {isCollapsed ? <ChevronRight className="text-primary" /> : <ChevronLeft />}
                            <span>Collapse Sidebar</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
