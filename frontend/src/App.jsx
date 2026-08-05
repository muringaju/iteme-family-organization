
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import VulnerableStudents from "./pages/VulnerableStudents.jsx";
import StudentDetail from "./pages/StudentDetail.jsx";
import Members from "./pages/Members.jsx";
import Staff from "./pages/Staff.jsx";
import CharityWeek from "./pages/CharityWeek.jsx";
import Gallery from "./pages/Gallery.jsx";
import Donate from "./pages/Donate.jsx";
import Reports from "./pages/Reports.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";

// =====================================================
// ADMIN LAYOUT
// =====================================================

import AdminLayout from "./admin/AdminLayout.jsx";

// =====================================================
// ADMIN PAGES
// =====================================================

import Dashboard from "./admin/Dashboard.jsx";
import ManageChildren from "./admin/ManageChildren.jsx";
import ManageStaff from "./admin/ManageStaff.jsx";
import ManageMembers from "./admin/ManageMembers.jsx";
import ManageDonations from "./admin/ManageDonations.jsx";
import ManageReports from "./admin/ManageReports.jsx";
import ManageCharityWeek from "./admin/ManageCharityWeek.jsx";
import ManageMessages from "./admin/ManageMessages.jsx";
import ManageGallery from "./admin/ManageGallery.jsx";

// =====================================================
// PUBLIC LAYOUT
// =====================================================

function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}

// =====================================================
// APP
// =====================================================

export default function App() {
  return (
    <Routes>

      {/* =================================================
          PUBLIC WEBSITE
      ================================================= */}

      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />

      <Route
        path="/about"
        element={
          <PublicLayout>
            <About />
          </PublicLayout>
        }
      />

      <Route
        path="/students"
        element={
          <PublicLayout>
            <VulnerableStudents />
          </PublicLayout>
        }
      />

      <Route
        path="/students/:id"
        element={
          <PublicLayout>
            <StudentDetail />
          </PublicLayout>
        }
      />

      <Route
        path="/members"
        element={
          <PublicLayout>
            <Members />
          </PublicLayout>
        }
      />

      <Route
        path="/staff"
        element={
          <PublicLayout>
            <Staff />
          </PublicLayout>
        }
      />

      <Route
        path="/charity-week"
        element={
          <PublicLayout>
            <CharityWeek />
          </PublicLayout>
        }
      />

      {/* =================================================
          PUBLIC GALLERY
      ================================================= */}

      <Route
        path="/gallery"
        element={
          <PublicLayout>
            <Gallery />
          </PublicLayout>
        }
      />

      <Route
        path="/donate"
        element={
          <PublicLayout>
            <Donate />
          </PublicLayout>
        }
      />

      <Route
        path="/reports"
        element={
          <PublicLayout>
            <Reports />
          </PublicLayout>
        }
      />

      <Route
        path="/contact"
        element={
          <PublicLayout>
            <Contact />
          </PublicLayout>
        }
      />

      {/* =================================================
          LOGIN
      ================================================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* =================================================
          ADMIN DASHBOARD
      ================================================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >

        {/* Dashboard */}
        <Route
          index
          element={<Dashboard />}
        />

        {/* Students */}
        <Route
          path="children"
          element={<ManageChildren />}
        />

        {/* Staff */}
        <Route
          path="staff"
          element={<ManageStaff />}
        />

        {/* Members */}
        <Route
          path="members"
          element={<ManageMembers />}
        />

        {/* Donations */}
        <Route
          path="donations"
          element={<ManageDonations />}
        />

        {/* Charity Week */}
        <Route
          path="charity-week"
          element={<ManageCharityWeek />}
        />

        {/* Gallery */}
        <Route
          path="gallery"
          element={<ManageGallery />}
        />

        {/* Reports */}
        <Route
          path="reports"
          element={<ManageReports />}
        />

        {/* Messages */}
        <Route
          path="messages"
          element={<ManageMessages />}
        />

      </Route>

      {/* =================================================
          404
      ================================================= */}

      <Route
        path="*"
        element={
          <PublicLayout>
            <NotFound />
          </PublicLayout>
        }
      />

    </Routes>
  );
}

