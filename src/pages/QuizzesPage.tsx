
import React from "react";
import PageLayout from "@/components/layout/PageLayout";
import QuizList from "@/components/quiz/QuizList";
import { useQuiz } from "@/context/QuizContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const QuizzesPage: React.FC = () => {
  const { quizzes, allResults } = useQuiz();
  const { user, isAdmin } = useAuth();
  
  // Filter results for the current user if logged in
  const userResults = user 
    ? allResults.filter(result => result.userId === user.id) 
    : [];

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Available Quizzes</h1>
            <p className="text-muted-foreground mt-1">
              Choose from our collection of quizzes to test your knowledge
            </p>
          </div>
          
          {isAdmin && (
            <Button asChild>
              <Link to="/admin/quizzes/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Quiz
              </Link>
            </Button>
          )}
        </div>
        
        {quizzes.length === 0 ? (
          <div className="text-center p-12 glass-panel rounded-lg">
            <h2 className="text-2xl font-bold mb-2">No quizzes available</h2>
            <p className="text-muted-foreground mb-6">
              There are no quizzes available at the moment. Please check back later.
            </p>
            
            {isAdmin && (
              <Button asChild>
                <Link to="/admin/quizzes/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Quiz
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <QuizList quizzes={quizzes} results={userResults} />
        )}
      </div>
    </PageLayout>
  );
};

export default QuizzesPage;
