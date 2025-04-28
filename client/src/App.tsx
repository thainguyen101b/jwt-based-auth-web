import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/layout/Navbar";
import { HomePage } from "./pages/HomePage";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import { Profile } from "./components/Profile";
import { ArticlesPage } from "./pages/articles/ArticlesPage";
import { ArticleDetailPage } from "./pages/articles/ArticleDetailPage";
import { ArticleCreatePage } from "./pages/articles/ArticleCreatePage";
import { ArticleEditPage } from "./pages/articles/ArticleEditPage";
import { Container } from "./components/layout/Container";
import { Footer } from "./components/layout/Footer";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <Container>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/:slug" element={<ArticleDetailPage />} />
              <Route path="/create-article" element={<ArticleCreatePage />} />
              <Route path="/edit-article/:slug" element={<ArticleEditPage />} />
            </Routes>
          </Container>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
