
import Header from '../components/header/Header';
import './Layout.css';
import Footer from '../components/footer/Footer';

const ClientLayout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      
      <Footer />
    </div>
  );
};

export default ClientLayout; 