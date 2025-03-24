
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <PageLayout className="flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <LoginForm />
      </div>
    </PageLayout>
  );
};

export default LoginPage;
