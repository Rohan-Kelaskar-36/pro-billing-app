import Sidebar, { SidebarItem} from './Sidebar'
import React,{ useState } from 'react';
import {
  Store,
  HousePlus,
  UserRoundPlus,
  ReceiptText,
  Percent,
  Package,
  LayoutDashboard,
} from "lucide-react"

import AdminAction from './AdminAction'; 
import AdminStoreList from './AdminStoreList';
import AdminReports from './AdminReports';
import AdminTax from './AdminTax';
import AdminInventoryDashboard from './AdminInventoryDashboard';
import AdminDashBoard from './AdminDashboard';
import CreateStore from './CreateStore';
// import GST from './GST';
// import Inventory from './Inventory';
// import CreateZone from './CreateZone';
// import Report from './Report';
// import StockManagement from './StockManagement';

function AdminHome() {
  const [activePage, setActivePage] = useState("Dashboard");
  // const [showAccountingDropdown, setShowAccountingDropdown] = useState(false);


  const renderContent = () => {
    switch (activePage) {
      case "Dashboard": return <AdminDashBoard/>;
      case "CreateStore": return <CreateStore/>;
      case "action": return <AdminAction />;
      case "stores": return <AdminStoreList />;
      case "reports": return<AdminReports/>
      case "tax": return<AdminTax/>
      case "Inventory": return<AdminInventoryDashboard/>
      default: return <AdminDashBoard/>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar>
        <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" active={activePage === "Dashboard"} onClick={() => setActivePage("Dashboard")} />
        <SidebarItem icon={<HousePlus size={20} />} text="Create Store" active={activePage === "CreateStore"} onClick={() => setActivePage("CreateStore")} />
        <SidebarItem icon={<UserRoundPlus size={20} />} text="Assign" active={activePage === "action"} onClick={() => setActivePage("action")} />
        <SidebarItem icon={<Store size={20} />} text="Stores" active={activePage === "stores"} onClick={() => setActivePage("stores")} />
        <SidebarItem icon={<ReceiptText size={20} />} text="Reports" active={activePage === "reports"} onClick={() => setActivePage("reports")} />
        <SidebarItem icon={<Percent size={20} />} text="Tax" active={activePage === "tax"} onClick={() => setActivePage("tax")} />
        <SidebarItem icon={<Package size={20} />} text="Inventory" active={activePage === "Inventory"} onClick={() => setActivePage("Inventory")} />

      </Sidebar>

      <div className="flex-grow overflow-y-auto p-4"> 
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminHome;



