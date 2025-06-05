import { Button } from 'flowbite-react';
import { openDialog } from '../../store/dialogSlice';
import { useDispatch } from 'react-redux';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../supabaseClient';

interface IProps {
  session: Session | null;
}

const Header = ({ session }: IProps) => {
  const dispatch = useDispatch();
  const openAuthDialog = () => {
    dispatch(openDialog('isOpenAuthDialog'));
  };

  const logout = () => supabase.auth.signOut();

  return (
    <header className="bg-(--bg-secondary) border-solid border-[1px] border-(--border-primary) rounded-[12px] p-[20px_24px] mb-[24px] shadow-[0_1px_3px_var(--shadow-light)] flex justify-between items-center flex-wrap gap-[16px]">
      <a className="text-lg font-semibold text-(--brand-secondary)" href="/">
        Дневник катастрофизации
      </a>
      <div className="flex gap-[12px]">
        <Button color="gray" size="sm" onClick={logout}>
          Темная тема
        </Button>
        {session && (
          <div className="p-[8px_12px] bg-(--bg-tertiary) rounded-[8px] text-sm text-(--text-secondary)">
            {session.user.email}
          </div>
        )}
        {session ? (
          <Button color="red" size="sm" onClick={logout}>
            Выйти
          </Button>
        ) : (
          <Button size="sm" onClick={openAuthDialog}>
            Войти
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
