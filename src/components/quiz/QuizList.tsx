
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import QuizCard from "./QuizCard";
import { Quiz, QuizResult } from "@/context/QuizContext";

interface QuizListProps {
  quizzes: Quiz[];
  results?: QuizResult[];
}

const QuizList: React.FC<QuizListProps> = ({ quizzes, results = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCompletedStatus = (quizId: string) => {
    return results.some((result) => result.quizId === quizId);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 w-full max-w-md mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-muted-foreground">No quizzes found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              hasCompleted={getCompletedStatus(quiz.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
