import React, { useState, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import { HomeIcon, SettingsIcon, SearchIcon, FileText, CheckCircle, MessageSquare, Inbox, Users, Megaphone, LogOut, ChevronDown, ChevronRight, Sun, Moon } from "lucide-react";
import { api } from "@/lib/api";

interface NavbarProps {
  className?: string;
}

interface ISubLink {
  label: string;
  href: string;
  Icon: typeof HomeIcon;
  permission?: string;
}

interface ILink {
  label: string;
  href: string;
  Icon: typeof HomeIcon;
  permission?: string;
  subItems?: ISubLink[];
}

const links: ILink[] = [
  {
    label: "SEO Management",
    href: "/admin/seo",
    Icon: SearchIcon,
    permission: "manage_blogs",
  },
  {
    label: "Demo Requests",
    href: "/admin/leads",
    Icon: Inbox,
    permission: "manage_leads",
  },
  {
    label: "Contact Messages",
    href: "/admin/contacts",
    Icon: MessageSquare,
    permission: "manage_contacts",
  },
  {
    label: "News and Updates",
    href: "/admin/updates",
    Icon: Megaphone,
    permission: "manage_blogs",
  },
  {
    label: "Blog Posts",
    href: "/admin/blogs",
    Icon: FileText,
    permission: "manage_blogs",
    subItems: [
      {
        label: "All Blog Posts",
        href: "/admin/blogs",
        Icon: FileText,
        permission: "manage_blogs",
      },
      {
        label: "Blog Comments",
        href: "/admin/comments",
        Icon: MessageSquare,
        permission: "manage_comments",
      },
      {
        label: "Registered Users",
        href: "/admin/users",
        Icon: Users,
        permission: "manage_users",
      },
    ],
  },
  {
    label: "Solutions",
    href: "/admin/solutions",
    Icon: CheckCircle,
    permission: "manage_solutions",
  },
  {
    label: "Industries",
    href: "/admin/industries",
    Icon: HomeIcon,
    permission: "manage_industries",
  },
  {
    label: "Staff / Admins",
    href: "/admin/admins",
    Icon: Users,
    permission: "manage_users",
  },
  {
    label: "Roles",
    href: "/admin/roles",
    Icon: SettingsIcon,
    permission: "manage_users",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    Icon: SettingsIcon,
    permission: "manage_users",
  },
];

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roleName, setRoleName] = useState<string>('');

  // Dropdown open state for Blog Posts
  const isBlogSubActive = pathname.startsWith('/admin/blogs') || pathname.startsWith('/admin/comments') || pathname.startsWith('/admin/users');
  const [isBlogOpen, setIsBlogOpen] = useState(isBlogSubActive);

  useEffect(() => {
    if (isBlogSubActive) {
      setIsBlogOpen(true);
    }
  }, [pathname, isBlogSubActive]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      // Apply cached permissions instantly
      const cached = localStorage.getItem('admin_permissions');
      if (cached) {
        try { setPermissions(JSON.parse(cached)); } catch (_) {}
      }
      const cachedRole = localStorage.getItem('admin_role_name');
      if (cachedRole) setRoleName(cachedRole);

      // Always fetch latest to stay synced
      api.get('/auth/me', token).then((res) => {
        const perms = res.data?.user?.roleId?.permissions || [];
        const role = res.data?.user?.roleId?.name || '';
        setPermissions(perms);
        setRoleName(role);
        localStorage.setItem('admin_permissions', JSON.stringify(perms));
        localStorage.setItem('admin_role_name', role);
      }).catch(console.error);
    }
  }, []);

  const hasPermission = (required?: string) => {
    if (!required) return true;
    if (roleName === 'Admin') return true;
    return permissions.includes('*') || permissions.includes(required);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_permissions');
    localStorage.removeItem('admin_role_name');
    window.location.href = '/admin/login';
  };

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const activeTheme = savedTheme || (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    setTheme(activeTheme);
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const [logoBlack, setLogoBlack] = useState('/digitory-black.png');
  const [logoWhite, setLogoWhite] = useState('/digitory-white.png');

  useEffect(() => {
    const handleBrandingSync = () => {
      const savedBlack = localStorage.getItem('branding_logo_black');
      const savedWhite = localStorage.getItem('branding_logo_white');
      if (savedBlack) setLogoBlack(savedBlack);
      if (savedWhite && savedWhite !== savedBlack) {
        setLogoWhite(savedWhite);
      } else {
        setLogoWhite('/digitory-white.png');
      }
    };

    handleBrandingSync();

    api.get('/settings').then(res => {
      const b = res.data?.branding || res.data?.data?.branding;
      if (b) {
        if (b.logo) {
          setLogoBlack(b.logo);
          localStorage.setItem('branding_logo_black', b.logo);
        }
        if (b.logoWhite && b.logoWhite !== b.logo) {
          setLogoWhite(b.logoWhite);
          localStorage.setItem('branding_logo_white', b.logoWhite);
        } else {
          setLogoWhite('/digitory-white.png');
          localStorage.setItem('branding_logo_white', '/digitory-white.png');
        }
      }
    }).catch(() => {});

    window.addEventListener('branding_logo_update', handleBrandingSync);
    return () => {
      window.removeEventListener('branding_logo_update', handleBrandingSync);
    };
  }, []);

  return (
    <div className={clsx("w-64 flex-shrink-0 bg-white dark:bg-[#121214] border-r border-zinc-200 dark:border-zinc-800/80 transition-colors duration-300", className)}>
      <div className="flex h-full flex-col justify-between py-6 px-4">
        
        {/* Logo/Header area */}
        <div className="mb-8 px-2">
          <Link href="/admin/seo" className="block">
            <img
              src={logoBlack}
              alt="Digitory Logo"
              className="object-contain h-7 w-auto block dark:hidden"
            />
            <img
              src={logoWhite}
              alt="Digitory Logo"
              className="object-contain h-7 w-auto hidden dark:block"
            />
          </Link>
        </div>

        {/* Main Navigation */}
        <div className="flex h-full flex-col gap-1.5 overflow-y-auto pr-2 custom-scrollbar">
          {links
            .filter(link => hasPermission(link.permission))
            .map((link, indx) => {
              const linkUrl = new URL(link.href, 'http://localhost');
              const isPathMatch = pathname === linkUrl.pathname || (linkUrl.pathname !== '/admin/dashboard' && pathname.startsWith(linkUrl.pathname));
              
              // Handle dropdown items
              if (link.subItems) {
                const isOpen = isBlogOpen;
                return (
                  <div key={indx} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setIsBlogOpen(!isBlogOpen)}
                      className={clsx(
                        "w-full flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 font-semibold text-[14px] cursor-pointer",
                        isBlogSubActive
                          ? "bg-[#FFF3EF] dark:bg-orange-950/20 text-[#FF4F18]"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
                      )}
                    >
                      <div className="flex items-center">
                        <link.Icon size={18} className="mr-3 shrink-0" strokeWidth={isBlogSubActive ? 2.5 : 2} />
                        <span>{link.label}</span>
                      </div>
                      {isOpen ? (
                        <ChevronDown size={16} className="shrink-0 text-zinc-400" />
                      ) : (
                        <ChevronRight size={16} className="shrink-0 text-zinc-400" />
                      )}
                    </button>

                    {/* Submenu Items */}
                    {isOpen && (
                      <div className="pl-6 space-y-1 animate-fade-in border-l-2 border-orange-100 dark:border-zinc-800 ml-4 my-1">
                        {link.subItems
                          .filter(sub => hasPermission(sub.permission))
                          .map((sub, subIdx) => {
                            const isSubActive = pathname === sub.href || (sub.href !== '/admin/blogs' && pathname.startsWith(sub.href));
                            return (
                              <Link
                                key={subIdx}
                                href={sub.href}
                                className={clsx(
                                  "flex items-center rounded-lg px-3 py-2 transition-all duration-200 font-semibold text-[13px]",
                                  isSubActive
                                    ? "text-[#FF4F18] font-extrabold bg-[#FFF3EF]/60 dark:bg-orange-950/30"
                                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
                                )}
                              >
                                <sub.Icon size={15} className="mr-2.5 shrink-0" strokeWidth={isSubActive ? 2.5 : 2} />
                                {sub.label}
                              </Link>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavItem key={indx} {...link} isActive={isPathMatch} />
              );
            })}
        </div>

        {/* Bottom actions: Dark Mode Toggle & Logout */}
        <div className="pt-4 mt-4 border-t border-zinc-150 dark:border-zinc-800/80 space-y-1">
          <button
            type="button"
            onClick={toggleDarkTheme}
            className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 font-semibold text-[14px] text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
          >
            <div className="flex items-center">
              {theme === 'dark' ? (
                <Sun size={18} className="mr-3 text-amber-400 shrink-0" strokeWidth={2} />
              ) : (
                <Moon size={18} className="mr-3 text-zinc-500 shrink-0" strokeWidth={2} />
              )}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
              {theme === 'dark' ? 'DARK' : 'LIGHT'}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center rounded-xl px-3 py-2.5 transition-all duration-200 font-bold text-[14px] text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 group cursor-pointer"
          >
            <LogOut size={18} className="mr-3 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={2.5} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const NavItem: React.FC<ILink & { className?: string; isActive?: boolean }> = ({
  label,
  href,
  Icon,
  className,
  isActive,
}) => {
  return (
    <Link
      className={clsx(
        "flex items-center rounded-xl px-3 py-2.5 transition-all duration-200 font-semibold text-[14px]",
        isActive 
          ? "bg-[#FFF3EF] dark:bg-orange-950/20 text-[#FF4F18]" 
          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white",
        className,
      )}
      href={href}
    >
      <Icon size={18} className="mr-3 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
      {label}
    </Link>
  );
};

export default Navbar;
