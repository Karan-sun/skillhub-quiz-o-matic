
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <PageLayout className="flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16 max-w-lg">
        <RegisterForm />
      </div>
    </PageLayout>
  );
};

export default RegisterPage;
