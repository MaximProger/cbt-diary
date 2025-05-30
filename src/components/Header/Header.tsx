import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';
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
    <Navbar fluid rounded>
      <NavbarBrand href="https://flowbite-react.com">
        {/* <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" /> */}
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">КПТ Дневник</span>
      </NavbarBrand>
      <div className="flex md:order-2">
        {session ? (
          <Button className="cursor-pointer" onClick={logout}>
            Выйти
          </Button>
        ) : (
          <Button className="cursor-pointer" onClick={openAuthDialog}>
            Войти
          </Button>
        )}
      </div>
      <NavbarCollapse>
        <NavbarLink href="#" active>
          Home
        </NavbarLink>
        <NavbarLink href="#">About</NavbarLink>
        <NavbarLink href="#">Services</NavbarLink>
        <NavbarLink href="#">Pricing</NavbarLink>
        <NavbarLink href="#">Contact</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
};

export default Header;
