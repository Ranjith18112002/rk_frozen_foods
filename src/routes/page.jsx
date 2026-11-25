
  // import { Routes, Route, Navigate } from "react-router-dom";

  // import AdminLayout from "../components/AdminLayout";
  // import Dashboard from "../pages/Dashbord/Dashbord";

  // import Products from "../pages/Products/Products";
  // import ProductFrom from "../pages/Products/ProductFrom";
  // import ProductView from "../pages/Products/ProductView";

  // import Category from "../pages/Categories/Category";
  // import CategoryForm from "../pages/Categories/CategoryForm";

  // import Enquiries from "../pages/Enquiries/Enquiries";
  // import BulkOrders from "../pages/BulkOrders/BulkOrders";
  // import BulkOrderView from "../pages/BulkOrders/BulkOrderView";

  // import Settings from "../pages/Settings/Settings";
  // // import Profile from "../pages/Profile/Profile";

  // import Banner from "../pages/Banners/Banner";
  // import BannerForm from "../pages/Banners/BannerForm";
  // import BannerView from "../pages/Banners/BannerView";

  // import Announcements from "../pages/Announcements/Announcements";
  // import AnnouncementForm from "../pages/Announcements/AnnouncementForm";
  // import Reviews from "../pages/Review/Reviews";
  // import ContactEnquiries from "../pages/contact/ContactEnquiries";

  // // Authentication pages
  // import Login from "../pages/Login/Login";
  // // import Register from "../pages/Register/Register";

  // // Protect admin pages
  // const ProtectedRoute = ({ children }) => {
  //   const token = localStorage.getItem("adminToken");

  //   if (!token) {
  //     return <Navigate to="/login" replace />;
  //   }

  //   return children;
  // };

  // // Existing admin pages
  // const AdminPages = () => {
  //   return (
  //     <AdminLayout>
  //       <Routes>
  //         <Route path="/" element={<Dashboard />} />

  //         {/* Products */}
  //         <Route path="/products" element={<Products />} />
  //         <Route path="/products/add" element={<ProductFrom />} />
  //         <Route path="/products/edit/:id" element={<ProductFrom />} />
  //         <Route path="/products/view" element={<ProductView />} />

  //         {/* Categories */}
  //         <Route path="/categories" element={<Category />} />
  //         <Route path="/categories/add" element={<CategoryForm />} />
  //         <Route path="/categories/edit/:id" element={<CategoryForm />} />

  //         {/* Banners */}
  //         <Route path="/banners" element={<Banner />} />
  //         <Route path="/banners/add" element={<BannerForm />} />
  //         <Route path="/banners/edit/:id" element={<BannerForm />} />
  //         <Route path="/banners/view/:id" element={<BannerView />} />

  //         {/* Announcements */}
  //         <Route path="/announcements" element={<Announcements />} />
  //         <Route path="/announcements/add" element={<AnnouncementForm />} />
  //         <Route path="/announcements/edit/:id" element={<AnnouncementForm />} />

  //         {/* Enquiries */}
  //         <Route path="/enquiries" element={<Enquiries />} />
  //         <Route path="/contact-enquiries" element={<ContactEnquiries />} />

  //         {/* Bulk Orders */}
  //         <Route path="/bulk-orders" element={<BulkOrders />} />
  //         <Route path="/bulk-orders/view/:id" element={<BulkOrderView />} />

  //         {/* Profile */}
  //         {/* <Route path="/profile" element={<Profile />} /> */}

  //         {/* Reviews */}
  //         <Route path="/reviews" element={<Reviews />} />

  //         {/* Settings */}
  //         <Route path="/settings" element={<Settings />} />

  //         {/* Unknown admin route */}
  //         {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
  //       </Routes>
  //     </AdminLayout>
  //   );
  // };

  // const Page = () => {
  //   return (
  //     <Routes>
  //       {/* Public routes */}
  //       <Route path="/login" element={<Login />} />
  //       {/* <Route path="/register" element={<Register />} /> */}

  //       {/* Protected admin routes */}
  //       <Route
  //         path="/*"
  //         element={
  //           <ProtectedRoute>
  //             <AdminPages />
  //           </ProtectedRoute>
  //         }
  //       />
  //     </Routes>
  //   );
  // };

  // export default Page;



import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../components/AdminLayout";
import Dashboard from "../pages/Dashbord/Dashbord";

import Products from "../pages/Products/Products";
import ProductFrom from "../pages/Products/ProductFrom";
import ProductView from "../pages/Products/ProductView";

import Category from "../pages/Categories/Category";
import CategoryForm from "../pages/Categories/CategoryForm";

import Enquiries from "../pages/Enquiries/Enquiries";
import BulkOrders from "../pages/BulkOrders/BulkOrders";
import BulkOrderView from "../pages/BulkOrders/BulkOrderView";

import Settings from "../pages/Settings/Settings";

import Banner from "../pages/Banners/Banner";
import BannerForm from "../pages/Banners/BannerForm";
import BannerView from "../pages/Banners/BannerView";

import Announcements from "../pages/Announcements/Announcements";
import AnnouncementForm from "../pages/Announcements/AnnouncementForm";
import Reviews from "../pages/Review/Reviews";
import ContactEnquiries from "../pages/contact/ContactEnquiries";

import Login from "../pages/Login/Login";

// Check admin login
const isAuthenticated = () => {
  return Boolean(localStorage.getItem("adminToken"));
};

// Protect admin pages
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Prevent logged-in admin from opening login page
const PublicOnlyRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Admin pages
const AdminPages = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        {/* Products */}
        <Route path="/products" element={<Products />} />
        <Route path="/products/add" element={<ProductFrom />} />
        <Route path="/products/edit/:id" element={<ProductFrom />} />
        <Route path="/products/view" element={<ProductView />} />

        {/* Categories */}
        <Route path="/categories" element={<Category />} />
        <Route path="/categories/add" element={<CategoryForm />} />
        <Route path="/categories/edit/:id" element={<CategoryForm />} />

        {/* Banners */}
        <Route path="/banners" element={<Banner />} />
        <Route path="/banners/add" element={<BannerForm />} />
        <Route path="/banners/edit/:id" element={<BannerForm />} />
        <Route path="/banners/view/:id" element={<BannerView />} />

        {/* Announcements */}
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/announcements/add" element={<AnnouncementForm />} />
        <Route path="/announcements/edit/:id" element={<AnnouncementForm />} />

        {/* Enquiries */}
        <Route path="/enquiries" element={<Enquiries />} />
        <Route path="/contact-enquiries" element={<ContactEnquiries />} />

        {/* Bulk Orders */}
        <Route path="/bulk-orders" element={<BulkOrders />} />
        <Route path="/bulk-orders/view/:id" element={<BulkOrderView />} />

        {/* Reviews */}
        <Route path="/reviews" element={<Reviews />} />

        {/* Settings */}
        <Route path="/settings" element={<Settings />} />

        {/* Unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  );
};

const Page = () => {
  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />

      {/* Protected admin pages */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminPages />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Page;

