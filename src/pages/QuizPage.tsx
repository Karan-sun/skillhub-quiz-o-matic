
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import QuizTimer from "@/components/quiz/QuizTimer";
import QuizResults from "@/components/quiz/QuizResults";
import { useQuiz, QuizQuestion as QuestionType } from "@/context/QuizContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { getQuiz, submitQuizResult } = useQuiz();
  const { user } = useAuth();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [startTime] = useState(Date.now());
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultData, setResultData] = useState<{
    id: string;
    quizId: string;
    userId: string;
    username: string;
    score: number;
    maxScore: number;
    timeTaken: number;
    completedAt: string;
  } | null>(null);

  const quiz = getQuiz(quizId || "");

  useEffect(() => {
    if (!quiz) {
      toast.error("Quiz not found");
      navigate("/quizzes");
    }
  }, [quiz, navigate]);

  useEffect(() => {
    if (quizCompleted && !showResults) {
      const calculatedTimeTaken = Math.floor((Date.now() - startTime) / 1000);
      setTimeTaken(calculatedTimeTaken);
      
      // Calculate final score
      let finalScore = 0;
      answers.forEach((answer, index) => {
        if (quiz && index < quiz.questions.length) {
          if (answer === quiz.questions[index].correctOption) {
            finalScore += 1;
          }
        }
      });
      
      setScore(finalScore);
      
      if (user) {
        const result = {
          id: Date.now().toString(),
          quizId: quiz?.id || "",
          userId: user.id,
          username: user.username,
          score: finalScore,
          maxScore: quiz?.questions.length || 0,
          timeTaken: calculatedTimeTaken,
          completedAt: new Date().toISOString(),
        };
        
        submitQuizResult(result);
        setResultData(result);
      }
      
      setShowResults(true);
    }
  }, [quizCompleted, showResults, quiz, answers, user, submitQuizResult, startTime]);

  if (!quiz) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Quiz not found</h1>
          </div>
        </div>
      </PageLayout>
    );
  }

  const handleStartQuiz = () => {
    if (!user) {
      toast.error("Please log in to take a quiz", {
        description: "You need to be logged in to save your results",
        action: {
          label: "Log in",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }
    
    setQuizStarted(true);
    setAnswers(new Array(quiz.questions.length).fill(-1));
  };

  const handleAnswer = (selectedOption: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleTimeUp = () => {
    toast.warning("Time's up!", {
      description: "Your quiz has been submitted automatically"
    });
    setQuizCompleted(true);
  };

  if (showResults && resultData) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <QuizResults result={resultData} quizTitle={quiz.title} />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {!quizStarted ? (
          <Card className="glass-panel animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex items-center mb-4">
                <Button variant="ghost" size="icon" asChild className="mr-2">
                  <Link to="/quizzes">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <CardTitle className="text-2xl font-bold">{quiz.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground">{quiz.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center p-4 bg-secondary/50 rounded-lg">
                  <div className="mr-3 bg-primary/10 p-2 rounded-full">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Number of Questions</p>
                    <p className="text-muted-foreground">{quiz.questions.length} questions</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-secondary/50 rounded-lg">
                  <div className="mr-3 bg-primary/10 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Time Limit</p>
                    <p className="text-muted-foreground">{quiz.timeLimit} minutes</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <p className="text-sm font-medium mb-1">Instructions:</p>
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  <li>Read each question carefully before selecting your answer.</li>
                  <li>You will see immediate feedback after submitting each answer.</li>
                  <li>The timer will start as soon as you begin the quiz.</li>
                  <li>Your results will be saved and displayed on the leaderboard.</li>
                </ul>
              </div>
              
              {!user && (
                <div className="bg-amber-50 text-amber-800 p-4 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Please log in to save your results
                  </p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button onClick={handleStartQuiz} size="lg">
                  Start Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Timer */}
            <QuizTimer 
              durationInMinutes={quiz.timeLimit} 
              onTimeUp={handleTimeUp}
              isPaused={quizCompleted}
            />
            
            {/* Question */}
            <QuizQuestion
              question={quiz.questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={quiz.questions.length}
              onAnswer={handleAnswer}
              onNext={handleNextQuestion}
              showResults={answers[currentQuestionIndex] !== -1}
              selectedOption={answers[currentQuestionIndex]}
            />
            
            {/* Progress indicator */}
            <div className="flex justify-between text-sm text-muted-foreground">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0 || answers[currentQuestionIndex] === -1}
              >
                Previous
              </Button>
              <span>{currentQuestionIndex + 1} of {quiz.questions.length}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === quiz.questions.length - 1 || answers[currentQuestionIndex] === -1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default QuizPage;
