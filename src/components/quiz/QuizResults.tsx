
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Award, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { QuizResult } from "@/context/QuizContext";

interface QuizResultsProps {
  result: QuizResult;
  quizTitle: string;
}

const QuizResults: React.FC<QuizResultsProps> = ({ result, quizTitle }) => {
  const scorePercentage = Math.round((result.score / result.maxScore) * 100);
  
  // Format completed time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Determine result message and color based on score
  const getResultInfo = () => {
    if (scorePercentage >= 90) {
      return {
        message: "Excellent!",
        description: "You've mastered this topic!",
        className: "text-green-600",
      };
    } else if (scorePercentage >= 70) {
      return {
        message: "Well done!",
        description: "You have a good understanding of this topic.",
        className: "text-blue-600",
      };
    } else if (scorePercentage >= 50) {
      return {
        message: "Good effort!",
        description: "You're on the right track, but there's room for improvement.",
        className: "text-amber-600",
      };
    } else {
      return {
        message: "Keep practicing!",
        description: "Don't worry, learning takes time and practice.",
        className: "text-red-600",
      };
    }
  };

  const resultInfo = getResultInfo();

  return (
    <Card className="glass-panel mx-auto max-w-lg animate-scale-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-center">{quizTitle} - Results</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="w-32 h-32 rounded-full flex items-center justify-center bg-background border-4 border-primary">
          <div className="text-center">
            <div className="text-3xl font-bold">{scorePercentage}%</div>
            <div className="text-xs font-medium text-muted-foreground">Score</div>
          </div>
        </div>

        <div className="text-center">
          <h3 className={`text-xl font-bold ${resultInfo.className}`}>{resultInfo.message}</h3>
          <p className="text-muted-foreground mt-1">{resultInfo.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-col items-center p-4 rounded-lg bg-accent/50">
            <div className="flex space-x-2 items-center mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Correct</span>
            </div>
            <span className="text-2xl font-bold">{result.score}</span>
          </div>
          
          <div className="flex flex-col items-center p-4 rounded-lg bg-accent/50">
            <div className="flex space-x-2 items-center mb-1">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Incorrect</span>
            </div>
            <span className="text-2xl font-bold">{result.maxScore - result.score}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>Time taken: {formatTime(result.timeTaken)}</span>
        </div>

        <div className="flex gap-4 w-full">
          <Button asChild variant="outline" className="w-1/2">
            <Link to="/quizzes">More Quizzes</Link>
          </Button>
          <Button asChild className="w-1/2">
            <Link to="/leaderboard">
              <Award className="mr-2 h-4 w-4" />
              Leaderboard
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizResults;
