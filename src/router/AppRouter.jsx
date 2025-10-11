import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/notFound/NotFound';
import Forbidden from '../pages/Forbidden';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={
          <Home />
      } />
      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter; 