
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { QuizProvider } from "./context/QuizContext";

// Pages
import HomePage from "./pages/HomePage";
import QuizzesPage from "./pages/QuizzesPage";
import QuizPage from "./pages/QuizPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminQuizzesPage from "./pages/admin/AdminQuizzesPage";
import CreateQuizPage from "./pages/admin/CreateQuizPage";
import EditQuizPage from "./pages/admin/EditQuizPage";
import QuizResultsPage from "./pages/admin/QuizResultsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <QuizProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quizzes" element={<QuizzesPage />} />
              <Route path="/quizzes/:quizId" element={<QuizPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/quizzes" element={<AdminQuizzesPage />} />
              <Route path="/admin/quizzes/create" element={<CreateQuizPage />} />
              <Route path="/admin/quizzes/edit/:quizId" element={<EditQuizPage />} />
              <Route path="/admin/quizzes/results/:quizId" element={<QuizResultsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QuizProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
