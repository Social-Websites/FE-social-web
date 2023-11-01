import { Fragment } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { privateRoutes, publicRoutes, adminRoutes } from "./routes";
//import { DefaultLayout } from './Layout';
import { ToastContainer } from "react-toastify";
import RequireAuth from "./shared/components/RequireAuth";
import PersistLogin from "./components/Auth/PersistLogin";

function App() {
  return (
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
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
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
          </Route>
          <Route element={<RequireAuth admin={true} />}>
            {adminRoutes.map((route, index) => {
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
          </Route>
        </Route>
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
  );
}

export default App;
