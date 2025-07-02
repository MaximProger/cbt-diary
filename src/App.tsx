import './App.css';
import AddDialog from './components/AddDialog/AddDialog';
import Layout from './components/Layout/Layout';
import Pannel from './components/Pannel/Pannel';
import Header from './components/Header/Header';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import AuthDialog from './components/AuthDialog/AuthDialog';
import type { Session } from '@supabase/supabase-js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEntries } from './store/entrySlice';
import type { TAppDispatch, TRootState } from './store';
import Loader from './components/Loader/Loader';
import { Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';
import DeleteDialog from './components/DeleteDialog/DeleteDialog';
import ToastContainer from './components/ToastContainer/ToastContainer';
import EditDialog from './components/EditDialog/EditDialog';
import EntriesList from './components/EntriesList/EntriesList';
import NoEntriesAlert from './components/NoEntriesAlert/NoEntriesAlert';
import useThemeInitializer from '@/hooks/useThemeInitializer/useThemeInitializer';
import InfoDialog from './components/InfoDialog/InfoDialog';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const dispatch: TAppDispatch = useDispatch();
  const { entries, status, error, isInitialLoading } = useSelector((state: TRootState) => state.entries);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    dispatch(fetchEntries());
  }, [dispatch]);

  useThemeInitializer();

  if (isInitialLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader className="h-[80px] w-[80px]" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header session={session} />
      {session ? (
        <>
          <Pannel />
          {entries.length > 0 && <EntriesList isLoading={status === 'pending'} />}
          {entries.length === 0 && status === 'fulfilled' && <NoEntriesAlert session={session} />}
          {error && (
            <Alert color="failure" icon={HiInformationCircle} data-testid="error_alert">
              <span className="font-medium">Ошибка загрузки!</span> Во время загрузки записей возникла ошибка,
              попробуйте позже
            </Alert>
          )}
          <AddDialog user={session.user} />
          <EditDialog />
          <DeleteDialog />
        </>
      ) : (
        <>
          <NoEntriesAlert session={session} />
          <AuthDialog />
        </>
      )}
      <ToastContainer animation="bounce" />
      <InfoDialog />
    </Layout>
  );
}

export default App;
