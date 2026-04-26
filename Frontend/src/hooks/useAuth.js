import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logoutUser, loadUser, clearError } from '../features/auth/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    const login = (userData) => dispatch(loginUser(userData));
    const register = (userData) => dispatch(registerUser(userData));
    const logout = () => dispatch(logoutUser());
    const load = () => dispatch(loadUser());
    const resetError = () => dispatch(clearError());

    return { user, loading, error, login, register, logout, load, resetError };
};
