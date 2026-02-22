'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { signOut, useSession } from '@/lib/auth-client';
import { BellDot, EllipsisVertical, LogOut, UserCircle } from 'lucide-react';
import Link from 'next/link';

export function NavUser() {
    const { data: session, isPending } = useSession();
    const { isMobile } = useSidebar();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-full">
                                <AvatarImage
                                    src={session?.user.image!}
                                    alt={session?.user.name}
                                />
                                <AvatarFallback className="rounded-full">
                                    {isPending ? (
                                        <Spinner />
                                    ) : (
                                        session?.user.name
                                            .charAt(0)
                                            .toLocaleUpperCase()
                                    )}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {isPending ? (
                                        <Skeleton className="w-full h-4" />
                                    ) : (
                                        session?.user.name
                                    )}
                                </span>
                                <span className="text-muted-foreground truncate text-xs">
                                    {isPending ? (
                                        <Skeleton className="w-full h-2 mt-1" />
                                    ) : (
                                        session?.user.email
                                    )}
                                </span>
                            </div>
                            <EllipsisVertical className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-full">
                                    <AvatarImage
                                        src={session?.user.image!}
                                        alt={session?.user.name}
                                    />
                                    <AvatarFallback className="rounded-full">
                                        {isPending ? (
                                            <Spinner />
                                        ) : (
                                            session?.user.name
                                                .charAt(0)
                                                .toLocaleUpperCase()
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {isPending ? (
                                            <Skeleton className="w-full h-4" />
                                        ) : (
                                            session?.user.name
                                        )}
                                    </span>
                                    <span className="text-muted-foreground truncate text-xs">
                                        {isPending ? (
                                            <Skeleton className="w-full h-2 mt-1" />
                                        ) : (
                                            session?.user.email
                                        )}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href="/account">
                                    <UserCircle />
                                    Account
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/notifications">
                                    <BellDot />
                                    Notifications
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={async () => {
                                await signOut();
                            }}
                        >
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
