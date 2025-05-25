import { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole]   = useState(localStorage.getItem('role'));
  const [user, setUser]   = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const data = await res.json();
        // ожидаем, что data.registeredEvents = [ 'id1','id2',… ]
        setUser(data);
      } catch (err) {
        console.error('Ошибка при получении профиля:', err);
        logout();
      }
    };
    fetchProfile();
  }, [token, logout]);

  const login = (newToken, newRole) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    setToken(newToken);
    setRole(newRole);
  };

  // 1) Мерджим новые поля в старый user
  const updateUser = updatedFields => {
    setUser(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  // 2) Метод для «дописать» новый eventId в registeredEvents
  const addRegisteredEvent = eventId => {
    setUser(prev => ({
      ...prev,
      registeredEvents: [...(prev.registeredEvents || []), eventId]
    }));
  };

  return (
    <AuthContext.Provider value={{
      token,
      role,
      user,
      login,
      logout,
      updateUser,
      addRegisteredEvent
    }}>
      {children}
    </AuthContext.Provider>
  );
};