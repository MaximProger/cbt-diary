import { Button } from 'flowbite-react';
import { openDialog } from '../../store/dialogSlice';
import { useDispatch } from 'react-redux';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/supabaseClient';
import { MdLightMode, MdDarkMode, MdLogout, MdLogin, MdInfo } from 'react-icons/md';
import useTheme from '@/hooks/useTheme/useTheme';

interface IProps {
  session: Session | null;
}

const Header = ({ session }: IProps) => {
  const dispatch = useDispatch();
  const openAuthDialogHandler = () => {
    dispatch(openDialog('isOpenAuthDialog'));
  };

  const openInfoDialogHandler = () => {
    dispatch(openDialog('isOpenInfoDialog'));
  };

  const logout = () => supabase.auth.signOut();
  const { isDarkMode, toggle } = useTheme();

  return (
    <header
      className="bg-(--bg-secondary) border-solid border-[1px] border-(--border-primary) rounded-[12px] p-[20px_24px] mb-[24px] shadow-[0_1px_3px_var(--shadow-light)] flex justify-between items-center flex-wrap gap-[16px] max-md:p-[12px] max-md:mb-[12px] max-md:gap-[12px]"
      data-testid="header"
    >
      <a className="text-lg font-semibold text-(--brand-secondary)" href="/" data-testid="logo">
        Дневник катастрофизации
      </a>
      <div className="flex flex-wrap gap-[12px]">
        {session && (
          <div className="p-[8px_12px] bg-(--bg-tertiary) rounded-[8px] text-sm text-(--text-secondary) truncate max-w-[250px]">
            {session.user.email}
          </div>
        )}
        {session ? (
          <Button color="red" size="sm" onClick={logout} aria-label="Выйти">
            <span className="max-md:hidden" data-testid="logout_text">
              Выйти
            </span>{' '}
            <MdLogout className="hidden w-4 h-4 max-md:block" data-testid="logout_icon" />
          </Button>
        ) : (
          <Button size="sm" onClick={openAuthDialogHandler} aria-label="Войти">
            <span className="max-md:hidden" data-testid="login_text">
              Войти
            </span>{' '}
            <MdLogin className="hidden w-4 h-4 max-md:block" data-testid="login_icon" />
          </Button>
        )}

        <Button color="gray" size="sm" onClick={toggle} aria-label="Переключить тему">
          {isDarkMode ? (
            <MdLightMode className="w-4 h-4" data-testid="light_mode_icon" />
          ) : (
            <MdDarkMode className="w-4 h-4" data-testid="dark_mode_icon" />
          )}
        </Button>
        <Button size="sm" onClick={openInfoDialogHandler} aria-label="Информация">
          <MdInfo className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
