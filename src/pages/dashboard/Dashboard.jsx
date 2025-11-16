import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import usePermissions from "../../hooks/usePermissions";
import { getLastName } from "../../utils/nameHelper";
import "./Dashboard.css";
import Projects from "../projects/Projects";
import Tasks from "../tasks/Tasks";
import MyTasks from "../myTasks/MyTasks";
import Team from "../team/Team";
import Notifications from "../notifications/Notifications";
import Reports from "../reports/Reports";
import Chat from "../chat/Chat";
import LogoDash from "../../assets/img/BrandTaskHub.png"

const Dashboard = () => {
	const { user, logout } = useAuth();
	const permissions = usePermissions();
	const navigate = useNavigate();
	const [currentView, setCurrentView] = useState("overview");

	const role = user?.role || "mb";
	const isPM = role === "pm" || role === "ad";
	const isTL = role === "tl" || isPM;

	const setView = (view) => () => setCurrentView(view);

	const handleProfileClick = () => {
		navigate('/profile');
	};

	const renderView = () => {
		switch (currentView) {
			case "projects":
				return <Projects />;
			case "team":
				return <Team />;
			case "reports":
				return <Reports />;
			case "tasks":
				return <Tasks />;
			case "my-tasks":
				return <MyTasks />;
			case "chat":
				return <Chat />;
			case "notifications":
				return <Notifications />;
			default:
				return <Reports />;
		}
	};

	return (
		<div className="dash-layout">
			<aside className="dash-sidebar">
				<div className="brand">
					<img src={LogoDash} alt="logo" className="dash-logo" />
					<h2>TASK HUB</h2>
				</div>
				<div className="user-box">
					<div className="avatar" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
						{(user?.username || "U").slice(0, 1).toUpperCase()}
					</div>
					<div className="user-info" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
						<div className="user-name">{getLastName(user?.username) || "Người dùng"}</div>
						<div className="user-role" style={{ color: permissions.getRoleColor() }}>
							{permissions.getRoleDisplayName()}
						</div>
					</div>
					<button 
						className="logout-btn"
						onClick={logout}
						title="Đăng xuất"
					>
						<i className="fa-solid fa-sign-out-alt"></i>
					</button>
				</div>

				<nav className="menu">
					{(isPM || isTL) && (
						<>
							<div className="menu-label">Quản lý dự án</div>
							<button
								className={`menu-item ${
									currentView === "projects" ? "active" : ""
								}`}
								onClick={setView("projects")}
							>
								Dự án
							</button>
							<button
								className={`menu-item ${
									currentView === "team" ? "active" : ""
								}`}
								onClick={setView("team")}
							>
								Thành viên
							</button>
							{isPM && (
								<button
									className={`menu-item ${
										currentView === "reports" ? "active" : ""
									}`}
									onClick={setView("reports")}
								>
									Báo cáo
								</button>
							)}
						</>
					)}

					<div className="menu-label">Công việc</div>
					<button
						className={`menu-item ${currentView === "tasks" ? "active" : ""}`}
						onClick={setView("tasks")}
					>
						Tasks
					</button>
					<button
						className={`menu-item ${
							currentView === "my-tasks" ? "active" : ""
						}`}
						onClick={setView("my-tasks")}
					>
						Công việc của tôi
					</button>
					<button
						className={`menu-item ${currentView === "chat" ? "active" : ""}`}
						onClick={setView("chat")}
					>
						Chat theo Task
					</button>

					<div className="menu-label">Khác</div>
					<button
						className={`menu-item ${
							currentView === "notifications" ? "active" : ""
						}`}
						onClick={setView("notifications")}
					>
						Thông báo
					</button>
				</nav>
			</aside>

			<main className="dash-main">{renderView()}</main>
		</div>
	);
};

export default Dashboard;
