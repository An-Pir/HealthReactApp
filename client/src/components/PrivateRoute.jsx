
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Если пропс role указан — проверим, что у пользователя такая же роль.
// Если пропс role не указан — просто проверяем, что пользователь авторизован.
const PrivateRoute = ({ children, role: requiredRole }) => {
  const { token, role } = useContext(AuthContext);

  if (!token) {
    // Если не залогинен — отправляем на логин
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Если есть требование по роли и оно не совпало — на главную
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;