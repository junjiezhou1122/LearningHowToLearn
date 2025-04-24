import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import RecommendationsPage from "./pages/RecommendationsPage";
import CategoriesPage from "./pages/CategoriesPage";
import BookmarksPage from "./pages/BookmarksPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
