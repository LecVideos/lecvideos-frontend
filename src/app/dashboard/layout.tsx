
import Sidebar from './dashboard-components/sidebar';

interface LayoutProps {
    children: React.ReactNode;
  }

const DashboardLayout = ({ children }: LayoutProps)=> {
   
    return (
        <div className="flex flex-1 overflow-hidden">
            
            {/* SIDE BAR */}
            <Sidebar/>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {children}
            </div>
            
        </div>
    );
}

export default DashboardLayout;
