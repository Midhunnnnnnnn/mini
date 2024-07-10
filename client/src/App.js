import React, { useState, useEffect } from 'react';
import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from 'react-router-dom';
import { productsData } from './api/Api';
import Footer from './components/Footer';
import Header from './components/Header';
import Product from './components/Product';
import Home from './Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Blog from './components/blog';
import Shop from './components/shop';
import { ClipLoader } from 'react-spinners';

const Layout = () => {
  return (
    <div>
      <Header />
      <ScrollRestoration />
      <Outlet />
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: productsData,
      },
      {
        path: "/product/:id",
        element: <Product />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
    ],
  },
]);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="font-bodyFont">
      {loading && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-white flex items-center justify-center z-50"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: '#f7f7f7',
            zIndex: 100,
          }}
        >
          <ClipLoader color="#36d7b7" loading={loading} size={150} />
        </div>
      )}
      <RouterProvider router={router} />

      <style jsx>{`
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-color: #f7f7f7;
          z-index: 100;
        }

        .loading-container .ClipLoader {
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}

export default App;