import { NavLink } from "react-router-dom";

const links = [
  {
    to: "/", label: "Customer Overview",
    icon: <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
  },
  {
    to: "/usage", label: "Usage Metrics",
    icon: <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
  },
  {
    to: "/support", label: "Support & Comms",
    icon: <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-1.562-1.562A5.98 5.98 0 004 10c0 1.065.277 2.066.764 2.936l1.394-1.82zM10 6c.564 0 1.1.117 1.588.33l1.562-1.562A5.98 5.98 0 0010 4c-.932 0-1.82.213-2.61.593l1.553 1.553c.335-.094.69-.146 1.057-.146z" clipRule="evenodd" /></svg>
  },
  {
    to: "/fleet", label: "Fleet Distribution",
    icon: <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm7 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-5a1 1 0 00-.293-.707l-3-3A1 1 0 0016 4H3zm13 2.5V9h3l-2.5-2.5H16z" /></svg>
  }
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <p className="brand-name">ClearQuote</p>
        <p className="brand-subtitle">Customer Success Dashboard</p>
      </div>
      <nav className="nav-list" aria-label="Dashboard tabs">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className="nav-link" end={link.to === "/"}>
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="demo-indicator">
          <span className="demo-dot" />
          Demo Mode — Seeded Data
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
