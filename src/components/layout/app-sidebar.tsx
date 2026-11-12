'use client';

import {
  IconCalendar,
  IconChevronsDown,
  IconLayoutDashboard,
  IconLayoutKanban,
  IconLogin,
  IconLogout,
  IconSettings,
  IconSparkles,
  IconUsers
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { OrbitLogo } from '@/components/brand/orbit-logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { useSupabaseUser } from '@/lib/supabase/use-user';

const MEET = [
  { key: 'calendar', url: '/dashboard/meet', icon: IconCalendar },
  { key: 'assistant', url: '/dashboard/meet/assistant', icon: IconSparkles },
  { key: 'accounts', url: '/dashboard/meet/accounts', icon: IconUsers },
  { key: 'settings', url: '/dashboard/meet/settings', icon: IconSettings }
] as const;

const LUCENT = [
  { key: 'overview', url: '/dashboard/overview', icon: IconLayoutDashboard },
  { key: 'kanban', url: '/dashboard/kanban', icon: IconLayoutKanban }
] as const;

export default function AppSidebar() {
  const t = useTranslations('sidebar');
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useSupabaseUser();

  const signOut = async () => {
    await getSupabaseBrowser().auth.signOut();
    router.push('/auth/sign-in');
  };

  const group = (
    label: string,
    items: ReadonlyArray<{
      key: string;
      url: string;
      icon: typeof IconCalendar;
    }>
  ) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(({ key, url, icon: Icon }) => (
          <SidebarMenuItem key={key}>
            <SidebarMenuButton
              asChild
              tooltip={t(key)}
              isActive={pathname === url}
            >
              <Link href={url}>
                <Icon />
                <span>{t(key)}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href='/dashboard/meet'>
                <OrbitLogo size={32} className='-ml-0.5' />
                <div className='grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden'>
                  <span className='truncate text-sm font-semibold'>Lucent</span>
                  <span className='text-muted-foreground truncate text-xs'>
                    {t('product')}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className='overflow-x-hidden'>
        {group(t('meet'), MEET)}
        {group(`${t('lucent')} · ${t('preview')}`, LUCENT)}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size='lg'
                    className='data-[state=open]:bg-sidebar-accent'
                  >
                    <span className='bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase'>
                      {(
                        user.user_metadata?.full_name ??
                        user.email ??
                        '?'
                      ).slice(0, 1)}
                    </span>
                    <div className='grid flex-1 text-left leading-tight'>
                      <span className='truncate text-sm font-medium'>
                        {user.user_metadata?.full_name ?? t('account')}
                      </span>
                      <span className='text-muted-foreground truncate text-xs'>
                        {user.email}
                      </span>
                    </div>
                    <IconChevronsDown className='ml-auto size-4' />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className='min-w-56 rounded-lg'
                  side='top'
                  align='end'
                  sideOffset={4}
                >
                  <DropdownMenuLabel className='text-muted-foreground truncate text-xs font-normal'>
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => void signOut()}>
                    <IconLogout className='mr-2 size-4' />
                    {t('signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton asChild tooltip={t('signIn')}>
                <Link href='/auth/sign-in'>
                  <IconLogin />
                  <span>{t('signIn')}</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
