import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../pages/AuthPage/AuthPage.tsx';

const AuthRoutes: React.FC<unknown> = () => {
  return (
    <Routes>
      <Route path="/Auth" element={<AuthPage />} />
      {/*<Route path="/reset-password/:token" element={<ChangePasswordPage tokenRequired={true} />} />*/}
      <Route path="/" element={<Navigate to="/Auth" replace />} />
      <Route path="*" element={<Navigate to="/Auth" replace />} />
    </Routes>
  );
};

export default AuthRoutes;
