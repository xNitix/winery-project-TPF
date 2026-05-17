import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({children, roleNeeded, ...rest}) => {
    let { user } = useContext(AuthContext)

    return !user ? <Navigate to='/login'/> : (user.role <= roleNeeded ? children : <Navigate to='/'/>);
}

export default PrivateRoute;