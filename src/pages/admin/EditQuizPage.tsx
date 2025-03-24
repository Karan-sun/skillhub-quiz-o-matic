import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import QuizForm from "@/components/admin/QuizForm";
import AdminCheck from "@/lib/AdminCheck";
import { useQuiz } from "@/context/QuizContext";
import { toast } from "@/lib/toast";

const EditQuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { getQuiz } = useQuiz();
  
  const quiz = getQuiz(quizId || "");
  
  if (!quiz) {
    toast.error("Quiz not found");
    navigate("/admin/quizzes");
    return null;
  }

  return (
    <AdminCheck>
      <PageLayout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <QuizForm mode="edit" initialQuiz={quiz} />
        </div>
      </PageLayout>
    </AdminCheck>
  );
};

export default EditQuizPage;
