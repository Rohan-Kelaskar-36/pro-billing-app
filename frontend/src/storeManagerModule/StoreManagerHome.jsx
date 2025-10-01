import Sidebar, { SidebarItem} from './Sidebar';
import React ,{ useState } from 'react';
import {
  ReceiptText,
  Package,
  PackagePlus,
  ListPlus,
  Warehouse,
  LayoutDashboard
} from "lucide-react"

import ManagerDashboard from './ManagerDashboard';
import ManagerProductManager from './ManagerProductManager';
import Category from './Category';
import ManagerInventory from './ManagerInventory';
import ManagerReports from './ManagerReports';
import TrendInsights from './TrendInsights';


function StoreManagerHome() {
  const [activePage, setActivePage] = useState("Dashboard");


  const renderContent = () => {
    switch (activePage) {
      case "Dashboard": return <ManagerDashboard />;   
      case "products": return <ManagerProductManager/>;
            case "Category": return <Category/>;
            case "inventory": return <ManagerInventory/>;
      case "reports": return <ManagerReports/>;
      case "insights": return <TrendInsights/>;

      default: return <ManagerDashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar>
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={activePage === "Dashboard"} onClick={() => setActivePage("Dashboard")} />
        <SidebarItem icon={<PackagePlus size={20} />} text="Products" active={activePage === "products"} onClick={() => setActivePage("products")} />
        <SidebarItem icon={<ListPlus size={20} />} text="Category" active={activePage === "Category"} onClick={() => setActivePage("Category")} />
        <SidebarItem icon={<Package size={20} />} text="Inventory" active={activePage === "inventory"} onClick={() => setActivePage("inventory")} />
        <SidebarItem icon={<ReceiptText size={20} />} text="Reports" active={activePage === "reports"} onClick={() => setActivePage("reports")} />
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Fashion Insights" active={activePage === "insights"} onClick={() => setActivePage("insights")} />

      </Sidebar>

      <div className="flex-grow overflow-y-auto p-4">
        {renderContent()}
      </div>
    </div>
  );
}

export default StoreManagerHome;



