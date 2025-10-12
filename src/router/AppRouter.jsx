import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/notFound/NotFound';
import Forbidden from '../pages/Forbidden';
import Login from '../pages/auth/login/Login';
import Register from '../pages/auth/register/Register';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={
          <Home />
      } />
      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRouter; 