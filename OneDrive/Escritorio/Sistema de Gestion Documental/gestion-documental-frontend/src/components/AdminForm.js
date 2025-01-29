import './AdminForm.scss';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function AdminForm({ children }) {
    return (
        <>
        
            <div className="flex">
                <Sidebar />
                
                <div className="content "><Navbar />{children}
                
                </div>
            </div>
            <div>
            
            </div>
        </>
    );
}

export default AdminForm;
