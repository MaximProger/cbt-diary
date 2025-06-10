import { Button } from 'flowbite-react';
import { openDialog } from '../../store/dialogSlice';
import { useDispatch } from 'react-redux';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../supabaseClient';
import { MdLightMode, MdDarkMode, MdLogout, MdLogin } from 'react-icons/md';

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
    <header className="bg-(--bg-secondary) border-solid border-[1px] border-(--border-primary) rounded-[12px] p-[20px_24px] mb-[24px] shadow-[0_1px_3px_var(--shadow-light)] flex justify-between items-center flex-wrap gap-[16px] max-md:p-[12px] max-md:mb-[12px] max-md:gap-[12px]">
      <a className="text-lg font-semibold text-(--brand-secondary)" href="/">
        Дневник катастрофизации
      </a>
      <div className="flex flex-wrap gap-[12px]">
        {session && (
          <div className="p-[8px_12px] bg-(--bg-tertiary) rounded-[8px] text-sm text-(--text-secondary) truncate max-w-[250px]">
            {session.user.email}
          </div>
        )}
        {session ? (
          <Button color="red" size="sm" onClick={logout}>
            <span className="max-md:hidden">Выйти</span> <MdLogout className="hidden w-4 h-4 max-md:block" />
          </Button>
        ) : (
          <Button size="sm" onClick={openAuthDialog}>
            <span className="max-md:hidden">Войти</span> <MdLogin className="hidden w-4 h-4 max-md:block" />
          </Button>
        )}
        <Button color="gray" size="sm">
          <MdDarkMode className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
