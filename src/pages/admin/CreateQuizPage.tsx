
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import QuizForm from "@/components/admin/QuizForm";
import AdminCheck from "@/lib/AdminCheck";

const CreateQuizPage: React.FC = () => {
  return (
    <AdminCheck>
      <PageLayout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <QuizForm mode="create" />
        </div>
      </PageLayout>
    </AdminCheck>
  );
};

export default CreateQuizPage;
