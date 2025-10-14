import Header from '../components/header/Header'
import '../assets/pages/Home.css'
import Footer from '../components/footer/Footer';
import InforLayout from '../layouts/inforLayout/InforLayout';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container">
      {/* Header */}
      <Header />

      <InforLayout/>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Home; 