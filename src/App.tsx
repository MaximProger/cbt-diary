import './App.css';
import Dialog from './components/Dialog/Dialog';
import DiaryTable from './components/DiaryTable/DiaryTable';
import Layout from './components/Layout/Layout';
import Pannel from './components/Pannel/Pannel';

function App() {
  return (
    <Layout>
      <Pannel />
      <DiaryTable />
      <Dialog />
    </Layout>
  );
}

export default App;
