import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logoutUser, loadUser, clearError } from '../features/auth/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    const login = useCallback((userData) => dispatch(loginUser(userData)), [dispatch]);
    const register = useCallback((userData) => dispatch(registerUser(userData)), [dispatch]);
    const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);
    const load = useCallback(() => dispatch(loadUser()), [dispatch]);
    const resetError = useCallback(() => dispatch(clearError()), [dispatch]);

    return { user, loading, error, login, register, logout, load, resetError };
};
