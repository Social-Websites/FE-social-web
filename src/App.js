import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { privateRoutes, publicRoutes } from './routes';
//import { DefaultLayout } from './Layout';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
      <Router>
          <div className="App">
              <Routes>
                  {publicRoutes.map((route, index) => {
                      const Page = route.component;

                    //   let Layout ;

                    //   if (route.layout) {
                    //       Layout = route.layout;
                    //   } else if (route.layout === null) {
                    //       Layout = Fragment;
                    //   }
                      return (
                          <Route
                              key={index}
                              path={route.path}
                              element={
                                //   <Layout>
                                      <Page />
                                //   </Layout>
                              }
                          />
                      );
                  })}
                  {privateRoutes.map((route, index) => {
                      const Page = route.component;

                    //   let Layout;

                    //   if (route.layout) {
                    //       Layout = route.layout;
                    //   } else if (route.layout === null) {
                    //       Layout = Fragment;
                    //   }

                      return (
                          <Route
                              key={index}
                              path={route.path}
                              element={
                                //   <AuthWrapper>
                                    //   <Layout>
                                          <Page />
                                    //   </Layout>
                                //   </AuthWrapper>
                              }
                          />
                      );
                  })}
              </Routes>
              <ToastContainer
                  position="top-right"
                  autoClose={2000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                  limit={1}
              />
          </div>
      </Router>
  );
}

export default App;
