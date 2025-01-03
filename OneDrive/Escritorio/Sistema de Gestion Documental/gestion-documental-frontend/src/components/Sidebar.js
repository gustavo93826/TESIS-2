import {NavLink} from 'react-router-dom'
import * as FaIcons from 'react-icons/fa'
import { GrOrganization } from "react-icons/gr";
import { IoDocumentLock } from "react-icons/io5";
const Sidebar = () =>{
    return (
       <div className="sidebar bg-light">
            <ul>
                
                <li>
                    <NavLink to="/admin/gestion-usuarios" exact className='text-dark rounded py-2 w-100 d-inline-block px-3' activeClassName="active"><FaIcons.FaUserCog className='me-2'/>Gestinar Usuarios</NavLink>
                </li>
                <li>
                    <NavLink to="/admin/gestion-clientes" exact className='text-dark rounded py-2 w-100 d-inline-block px-3' activeClassName="active"><GrOrganization className='me-2'/>Gestionar Clientes</NavLink>
                </li>
                <li>
                    <NavLink to="/admin/asignar-permisos" exact className='text-dark rounded py-2 w-100 d-inline-block px-3' activeClassName="active"><IoDocumentLock className='me-2'/>Asignar Permisos</NavLink>
                </li>
            </ul>
       </div>
    )
}

export default Sidebar;