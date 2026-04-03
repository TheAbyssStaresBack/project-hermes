import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useUser() {
  const supabase = createClient();

  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      init();
    });

    init();

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
