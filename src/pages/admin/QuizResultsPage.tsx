
import React from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import QuizResultsAnalytics from "@/components/admin/QuizResultsAnalytics";
import AdminCheck from "@/lib/AdminCheck";

const QuizResultsPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();

  return (
    <AdminCheck>
      <PageLayout>
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <QuizResultsAnalytics />
        </div>
      </PageLayout>
    </AdminCheck>
  );
};

export default QuizResultsPage;
