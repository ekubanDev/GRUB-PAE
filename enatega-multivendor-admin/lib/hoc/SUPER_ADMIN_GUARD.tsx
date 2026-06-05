'use client';
// Core
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Hooks
import { useUserContext } from '@/lib/hooks/useUser';

// Constants and Utils
import { APP_NAME, ROUTES } from '@/lib/utils/constants';
import { onUseLocalStorage } from '@/lib/utils/methods';

const SUPER_ADMIN_GUARD = <T extends object>(
  Component: React.ComponentType<T>
) => {
  const WrappedComponent = (props: T) => {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useUserContext();

    // Check localStorage synchronously on mount — avoids firing authenticated
    // queries before we know the session state.
    const [isLoggedIn] = useState<boolean>(() => {
      if (typeof window === 'undefined') return false;
      return !!onUseLocalStorage('get', `user-${APP_NAME}`);
    });

    useEffect(() => {
      if (!isLoggedIn) {
        router.replace('/authentication/login');
        return;
      }

      const findRouteName = ROUTES.find((v) => v.route === pathname);

      // For STAFF permissions
      if (
        user &&
        user.userType === 'STAFF' &&
        findRouteName &&
        Array.isArray(user.permissions)
      ) {
        const allowed = user?.permissions?.includes(findRouteName?.text);
        if (!allowed) {
          router.replace('/forbidden');
        }
      }

      // For Others
      if (user?.userType === 'RESTAURANT' || user?.userType === 'VENDOR') {
        router.replace('/forbidden');
      }
    }, [isLoggedIn]);

    if (!isLoggedIn) return null;

    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default SUPER_ADMIN_GUARD;
