"use client";

import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import {
  LayoutDashboard,
  User,
  Plus,
  Briefcase,
  Bookmark,
  CreditCard,
  Building,
  Settings,
  LogOut,
  Menu,
  Search,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { logoutThunk } from "../lib/AuthSlice";
import { useAppDispatch } from "../lib/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const base = "/simpleUser";

const navigationItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: base + "/dashboard" },
  { name: "Perspectives", icon: User, href: base + "/profile" },
  { name: "Tasks", icon: Plus, href: base + "/jobs/createJobs" },
  { name: "Documents", icon: Briefcase, href: base + "/jobs/listJobs" },
  { name: "Reports", icon: Bookmark, href: base + "/saved-candidates" },
  { name: "Users & roles", icon: CreditCard, href: base + "/billing" },
];

// Navbar Component
const Navbar = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { mutate: LogoutUser } = useMutation({
    mutationFn: () => dispatch(logoutThunk()).unwrap(),
    onSuccess: async (res) => {
      if (res.success) {
        toast.success(res.message);
        router.push("/login");
      }
    },
  });

  // Mock user data - replace with actual user data from your auth system
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://github.com/shadcn.png",
    initials: "JD",
  };

  return (
    <header className="sticky top-0 z-30  flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* z-30 removed  up*/}

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>

      {/* Search Bar */}
      <div className="flex flex-1 items-center gap-4 md:gap-6 h-8 lg:ml-6">
        <div className="relative flex-1 md:flex-initial md:w-80 rounded-xl">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#8597A8]" />
          <Input
            type="search"
            placeholder="Search"
            className="w-full pl-8 md:w-80 bg-[#F5F8FA] text-[#8597A8] text-sm font-normal"
          />
        </div>
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notification Icon */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-2.5 h-2 w-2 rounded-full bg-red-600" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 gap-2 pl-0 rounded-full pr-2 bg-[#F9FAFA]"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block text-sm font-medium">
                {user.name}
              </span>
              {/* Chevron down icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1 h-4 w-4 text-muted-foreground"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={base + "/profile"}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={base + "/setting"}>Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => LogoutUser()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

// Desktop Sidebar Component - UPDATED with Figma colors
const DesktopSidebar = () => {
  const pathname = usePathname();

  function isLinkActive(href: string, pathname: string) {
    if (!href || href === "#") return false;
    if (pathname === href) return true;
    return pathname.startsWith(href + "/");
  }

  return (
    <div className="hidden md:flex md:w-[256px] md:flex-col md:fixed md:inset-y-0 md:z-20">
      <div className="flex flex-col h-full bg-[#1D3557]">
        {" "}
        {/* Sidebar background color */}
        {/* <div className="h-8 w-8 rounded-full bg-red-400 absolute  top-[30px] -right-3 ">ddd</div> */}
        <div className="absolute -right-3 top-5 z-30">
          <div className="relative">
            {/* White circle background */}
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
              <Image
                src="/backIcon.png"
                alt="Toggle Sidebar"
                width={14}
                height={14}
                className="brightness-0" // Dark icon for light background
              />
            </div>
            {/* Optional: Small connecting line from circle to sidebar edge */}
            <div className="absolute right-3 top-3 w-3 h-0.5 bg-white/30"></div>
          </div>
        </div>
        <div className="p-2 pl-6">
          <Link href={base + "/dashboard"} className="block">
            <Image
              src="/logo.png"
              alt="Employers Dashboard Logo"
              width={100}
              height={40}
              className="h-auto w-auto " // Makes white logo if your logo is dark
              priority
            />
          </Link>
        </div>
        <nav className="flex flex-col items-center justify-center space-y-1 overflow-y-auto">
          {navigationItems.map((curNav, index) => {
            const Icon = curNav.icon;
            const isActive = isLinkActive(curNav.href || "", pathname);

            return (
              <Link
                key={curNav.name}
                href={curNav.href || "#"}
                className={cn(
                  "flex items-center gap-3 w-52  px-3 h-10 text-sm font-medium rounded-lg transition-colors",
                  index == 0 && "mt-3",
                  isActive
                    ? "bg-[#98AEC01A] text-white" // Active: background #98AEC01A, text white
                    : "text-[#7B9FC3] hover:text-white hover:bg-[#98AEC01A]", // Inactive: text #7B9FC3, hover effects
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive
                      ? "text-white"
                      : "text-[#7B9FC3] group-hover:text-white",
                  )}
                />
                {curNav.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

// Mobile Sidebar Component (Sheet) - UPDATED with Figma colors
const MobileSidebar = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();

  function isLinkActive(href: string, pathname: string) {
    if (!href || href === "#") return false;
    if (pathname === href) return true;
    return pathname.startsWith(href + "/");
  }

  const { mutate: LogoutUser } = useMutation({
    mutationFn: () => dispatch(logoutThunk()).unwrap(),
    onSuccess: async (res) => {
      if (res.success) {
        toast.success(res.message);
        router.push("/login");
      }
    },
  });

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-[256px] p-0 bg-[#1D3557] border-r-0"
      >
        {" "}
        {/* Mobile sidebar background color */}
        <SheetTitle className="sr-only">
          Employers Dashboard Navigation
        </SheetTitle>
        <SheetDescription className="sr-only">
          Mobile navigation menu for employers dashboard
        </SheetDescription>
        <div className="flex flex-col h-full">
          <div className="p-4">
            <Link
              href={base + "/dashboard"}
              onClick={() => onClose()}
              className="block"
            >
              <Image
                src="/logo.png"
                alt="Employers Dashboard Logo"
                width={100}
                height={40}
                className="h-auto w-auto " // Makes white logo if your logo is dark
                priority
              />
            </Link>
          </div>

          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {navigationItems.map((curNav) => {
              const Icon = curNav.icon;
              const isActive = isLinkActive(curNav.href || "", pathname);

              return (
                <Link
                  key={curNav.name}
                  href={curNav.href || "#"}
                  onClick={() => onClose()}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-[#98AEC01A] text-white" // Active: background #98AEC01A, text white
                      : "text-[#7B9FC3] hover:text-white hover:bg-[#98AEC01A]", // Inactive: text #7B9FC3, hover effects
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      isActive ? "text-white" : "text-[#7B9FC3]",
                    )}
                  />
                  {curNav.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-[#98AEC01A]">
            {" "}
            {/* Border with opacity */}
            <button
              onClick={() => {
                LogoutUser();
                onClose();
              }}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#7B9FC3] hover:text-white hover:bg-[#98AEC01A] rounded-lg transition-colors w-full"
            >
              <LogOut className="h-4 w-4 text-[#7B9FC3] group-hover:text-white" />
              Log-out
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Main UserSidebar component
interface UserSidebarProps {
  children: React.ReactNode;
}

const UserSidebar = ({ children }: UserSidebarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content wrapper with navbar - adjusted padding to match 256px sidebar */}

      <div className="md:pl-[256px] flex flex-col flex-1 min-h-screen">
        <Navbar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 ">{children}</main>
      </div>
    </>
  );
};

export default UserSidebar;
