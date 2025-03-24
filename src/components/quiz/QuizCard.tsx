
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock } from "lucide-react";
import { Quiz } from "@/context/QuizContext";

interface QuizCardProps {
  quiz: Quiz;
  hasCompleted?: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, hasCompleted = false }) => {
  const formattedDate = new Date(quiz.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="glass-card overflow-hidden hover-scale">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2">
              {quiz.questions.length} Questions
            </Badge>
            <CardTitle className="text-xl line-clamp-1">{quiz.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
          {quiz.description}
        </p>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          <span>{quiz.timeLimit} min</span>
          <span className="mx-2">•</span>
          <span>{formattedDate}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          variant={hasCompleted ? "secondary" : "default"}
          className="w-full"
        >
          <Link to={`/quizzes/${quiz.id}`}>
            <PlayCircle className="mr-2 h-4 w-4" />
            {hasCompleted ? "Take Again" : "Start Quiz"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
