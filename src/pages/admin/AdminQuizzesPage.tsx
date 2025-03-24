
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import QuizManagement from "@/components/admin/QuizManagement";
import AdminCheck from "@/lib/AdminCheck";

const AdminQuizzesPage: React.FC = () => {
  return (
    <AdminCheck>
      <PageLayout>
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <QuizManagement />
        </div>
      </PageLayout>
    </AdminCheck>
  );
};

export default AdminQuizzesPage;
