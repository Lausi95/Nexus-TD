import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home/Home.tsx';

const ProtectedRoutes: React.FC<unknown> = () => {
  // const dispatch: AppDispatch = useDispatch();
  // const { _id } = useSelector((state: RootState) => state.authSlice.user);
  // const { loading } = useSelector((state: RootState) => state.authSlice.meta);

  // useEffect(() => {
  //   dispatch(getMe());
  // }, [dispatch]);

  // const handleLogout = () => {
  //   dispatch(logout());
  // };

  // if (loading) {
  //   return (
  //     <Routes>
  //       <Route
  //         path="/*"
  //         element={
  //           <Box
  //             sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
  //           >
  //             <CircularProgress color={'primary'} />
  //           </Box>
  //         }
  //       />
  //     </Routes>
  //   );
  // } else if (!_id) {
  //   return (
  //     <Routes>
  //       <Route
  //         path="/*"
  //         element={
  //           <Box
  //             sx={{
  //               width: '100%',
  //               height: '100%',
  //               display: 'flex',
  //               justifyContent: 'center',
  //               alignItems: 'center',
  //               flexDirection: 'column',
  //               gap: 2,
  //             }}
  //           >
  //             <Typography color={'primary'}>{'Something went wrong, user not found'}</Typography>
  //             <Button className={styles.btn} onClick={handleLogout} sx={{ display: 'flex', gap: 1 }}>
  //               <LogoutIcon />
  //               {'LOGOUT'}
  //             </Button>
  //           </Box>
  //         }
  //       />
  //     </Routes>
  //   );
  // }

  return (
    <Routes>
      <Route path="/Home" element={<Home />} />
      <Route path="/" element={<Navigate to="/Home" replace />} />
      <Route path="*" element={<Navigate to="/Home" replace />} />
    </Routes>
  );
};

export default ProtectedRoutes;
