'use client';

import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Link, useRouter } from '@/i18n/navigation';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { useSupabaseUser } from '@/lib/supabase/use-user';

export function UserNav() {
  const t = useTranslations('sidebar');
  const router = useRouter();
  const { user } = useSupabaseUser();

  if (!user) {
    return (
      <Button asChild size='sm' variant='outline'>
        <Link href='/auth/sign-in'>{t('signIn')}</Link>
      </Button>
    );
  }

  const name =
    (user.user_metadata?.full_name as string | undefined) ?? user.email ?? '?';
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='relative size-8 rounded-full'
          aria-label={name}
        >
          <Avatar>
            <AvatarFallback>{name.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' sideOffset={10}>
        <DropdownMenuLabel className='font-normal'>
          <p className='truncate text-sm font-medium'>{name}</p>
          <p className='text-muted-foreground truncate text-xs'>{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await getSupabaseBrowser().auth.signOut();
            router.push('/auth/sign-in');
          }}
        >
          {t('signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
