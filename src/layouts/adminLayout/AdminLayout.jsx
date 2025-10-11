import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import "./Layout.css";

const AdminLayout = ({ children }) => {
	return (
		<div className="layout">
			<div className="headerLayout">
				<Header />
			</div>

			<div className="footerLayOut">
				<Footer />
			</div>
		</div>
	);
};

export default AdminLayout;
