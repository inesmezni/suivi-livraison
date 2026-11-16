import { NavLink } from "react-router-dom";
import {LayoutDashboard,Truck,Package,Users,Clock,MapPin,Bell} from "lucide-react";
import "./SidebarAdmin.css"
import Logo from "../../assets/logo.png"

const menuItems = [
  { to: "/admin", label: "Tableau de bord", Icon: LayoutDashboard },
  { to: "/admin/livreurs", label: "Livreurs", Icon: Truck },
  { to: "/admin/livraisons", label: "Livraisons", Icon: Package },
  { to: "/admin/clients", label: "Clients", Icon: Users },
   { to: "/admin/SuiviColis", label: "Carte en temps réel", Icon: MapPin },
  { to: "/admin/historique", label: "Historique", Icon: Clock },
  { to: "/admin/notifications", label: "Notifications", Icon: Bell },
];

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <img
          src={Logo}
          alt="Delivery Pro"
          className="delivery-pro-round-logo"
        />
      </div>

      <nav className="menu">
        {menuItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `menu-link ${isActive ? "active" : ""}`}
          >
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="version">v1.0.0</p>
      </div>
    </div>
  );
};

export default Sidebar;
