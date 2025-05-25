import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthContext } from './context/AuthContext';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import MainPage from './components/layout/pages/MainPage';
import ServicesPage from './components/layout/pages/ServicesPage';
import AboutPage from './components/layout/pages/AboutPage';
import EventsPage from './components/layout/pages/EventsPage';
import ContactsPage from './components/layout/pages/ContactsPage';

import LoginForm from './components/layout/pages/Auth/LoginForm';
import RegForm from './components/layout/pages/Auth/RegForm';

import AdminPage from './components/layout/pages/AdminPage';
import ProfilePage from './components/layout/pages/ProfilePage';

import ScrollToTopButton from './components/ui/ScrollToTopButton';
import PrivateRoute from './components/PrivateRoute';

function App() {
  // Объединяем в один хук
  const { token, role, user } = useContext(AuthContext);
  const isAuth = Boolean(token);

  // Основные публичные страницы
  const publicPages = [
    { name: 'Главная', path: '/', Component: MainPage },
    { name: 'О нас', path: '/about', Component: AboutPage },
    { name: 'Услуги', path: '/services', Component: ServicesPage },
    { name: 'Мероприятия', path: '/events', Component: EventsPage },
    { name: 'Контакты', path: '/contacts', Component: ContactsPage },
  ];

  // Добавляем пункты меню в зависимости от роли
  const menuPages = [...publicPages];
  if (role === 'admin') {
    menuPages.push({ name: 'Админка', path: '/admin', Component: AdminPage });
  }
  if (role === 'user' && user) {
    menuPages.push({
      name: `Профиль, ${user.name}`,
      path: '/profile',
      Component: ProfilePage,
    });
  }

  return (
    <Router>
      <div className='flex flex-col min-h-screen'>
        <Header pages={menuPages} isAuth={isAuth} />

        <div className='flex-1 overflow-y-auto'>
          <Routes>
            {/* Публичные */}
            {publicPages.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}

            {/* Авторизация */}
            <Route path='/login' element={<LoginForm />} />
            <Route path='/registration' element={<RegForm />} />

            {/* Приватные страницы */}
            {role === 'admin' && (
              <Route
                path='/admin'
                element={
                  <PrivateRoute role='admin'>
                    <AdminPage />
                  </PrivateRoute>
                }
              />
            )}
            {role === 'user' && (
              <Route
                path='/profile'
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
            )}

            {/* 404 */}
            <Route path='*' element={<h1>404: Страница не найдена</h1>} />
          </Routes>
          
        </div>
        <ScrollToTopButton />
        <Footer pages={menuPages} />
      </div>
    </Router>
  );
}

export default App;
