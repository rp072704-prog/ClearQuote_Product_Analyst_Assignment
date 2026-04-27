import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import CustomerOverview from "./pages/CustomerOverview";
import UsageMetrics from "./pages/UsageMetrics";
import SupportComms from "./pages/SupportComms";
import FleetDistribution from "./pages/FleetDistribution";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <div className="app-main">
          <Navbar />
          <main className="page-frame">
            <Routes>
              <Route path="/" element={<CustomerOverview />} />
              <Route path="/usage" element={<UsageMetrics />} />
              <Route path="/support" element={<SupportComms />} />
              <Route path="/fleet" element={<FleetDistribution />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
