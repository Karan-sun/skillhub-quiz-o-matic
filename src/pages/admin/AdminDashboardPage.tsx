
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart, PlusCircle, BookOpen, Settings } from "lucide-react";
import AdminCheck from "@/lib/AdminCheck";

const AdminDashboardPage: React.FC = () => {
  return (
    <AdminCheck>
      <PageLayout>
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-panel hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-primary" />
                  Manage Quizzes
                </CardTitle>
                <CardDescription>
                  View, edit, and delete existing quizzes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/admin/quizzes">
                    Go to Quiz Management
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glass-panel hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PlusCircle className="mr-2 h-5 w-5 text-primary" />
                  Create Quiz
                </CardTitle>
                <CardDescription>
                  Create a new quiz for your users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/admin/quizzes/create">
                    Create New Quiz
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glass-panel hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5 text-primary" />
                  Analytics
                </CardTitle>
                <CardDescription>
                  View quiz participation and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/admin/analytics">
                    View Analytics
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageLayout>
    </AdminCheck>
  );
};

export default AdminDashboardPage;
