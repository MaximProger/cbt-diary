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

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const dispatch: TAppDispatch = useDispatch();
  const { entries, status, error } = useSelector((state: TRootState) => state.entries);

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

  return (
    <Layout>
      <Header session={session} />
      {session ? (
        <>
          <Pannel />
          {status === 'pending' && <Loader className="text-center" size="xl" />}
          {status === 'fulfilled' && entries.length > 0 && <EntriesList />}
          {entries.length === 0 && status === 'fulfilled' && <NoEntriesAlert session={session} />}
          {error && (
            <Alert color="failure" icon={HiInformationCircle}>
              <span className="font-medium">Ошибка загрузки!</span> Во время загрузки записей возникла ошибка,
              попробуйте позже
            </Alert>
          )}
          <AddDialog user={session.user} />
          <EditDialog />
          <DeleteDialog />
        </>
      ) : (
        <></>
      )}

      {!session && <NoEntriesAlert session={session} />}
      {!session && <AuthDialog />}
      <ToastContainer animation="bounce" />
    </Layout>
  );
}

export default App;
