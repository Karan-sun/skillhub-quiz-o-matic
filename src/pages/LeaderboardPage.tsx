
import React, { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { useQuiz } from "@/context/QuizContext";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const LeaderboardPage: React.FC = () => {
  const { quizzes, allResults, getQuizResults } = useQuiz();
  const [selectedQuizId, setSelectedQuizId] = useState<string>("all");
  
  // Filter results based on selected quiz
  const filteredResults = selectedQuizId === "all" 
    ? allResults 
    : getQuizResults(selectedQuizId);
  
  const getLeaderboardTitle = () => {
    if (selectedQuizId === "all") {
      return "Overall Leaderboard";
    }
    
    const quiz = quizzes.find(q => q.id === selectedQuizId);
    return quiz ? `${quiz.title} Leaderboard` : "Leaderboard";
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground mt-1">
            See how you and others are performing across all quizzes
          </p>
        </div>
        
        <Card className="glass-panel mb-6">
          <CardContent className="pt-6">
            <div className="md:w-64">
              <Label htmlFor="quiz-filter" className="mb-2 block">
                Filter by Quiz
              </Label>
              <Select
                value={selectedQuizId}
                onValueChange={setSelectedQuizId}
              >
                <SelectTrigger id="quiz-filter">
                  <SelectValue placeholder="Select a quiz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Quizzes</SelectItem>
                  {quizzes.map((quiz) => (
                    <SelectItem key={quiz.id} value={quiz.id}>
                      {quiz.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {filteredResults.length === 0 ? (
          <div className="text-center p-12 glass-panel rounded-lg">
            <h2 className="text-xl font-semibold mb-2">No results yet</h2>
            <p className="text-muted-foreground">
              There are no quiz results to display for this selection.
            </p>
          </div>
        ) : (
          <LeaderboardTable 
            results={filteredResults} 
            title={getLeaderboardTitle()}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default LeaderboardPage;
