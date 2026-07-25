import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import TreeholePage from '@/pages/TreeholePage';
import EventsPage from '@/pages/EventsPage';
import PhotosPage from '@/pages/PhotosPage';
import PlansPage from '@/pages/PlansPage';
import { useAppStore } from '@/store/useAppStore';

export default function App() {
  const init = useAppStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/treehole" element={<TreeholePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/photos" element={<PhotosPage />} />
          <Route path="/plans" element={<PlansPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}