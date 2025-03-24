
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { useQuiz } from "@/context/QuizContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Award, LogOut, User, Clock, BookOpen } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { quizzes, allResults } = useQuiz();
  const navigate = useNavigate();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  // Filter results for the current user
  const userResults = allResults.filter((result) => result.userId === user.id);

  // Calculate statistics
  const totalQuizzesTaken = new Set(userResults.map((r) => r.quizId)).size;
  const averageScore =
    userResults.length > 0
      ? userResults.reduce(
          (sum, result) => sum + (result.score / result.maxScore) * 100,
          0
        ) / userResults.length
      : 0;

  // Prepare data for the chart
  const quizScoresData = userResults.map((result) => {
    const quiz = quizzes.find((q) => q.id === result.quizId);
    return {
      name: quiz ? quiz.title : "Unknown Quiz",
      score: Math.round((result.score / result.maxScore) * 100),
    };
  });

  // Format time (seconds) as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <Card className="glass-panel lg:col-span-1 animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{user.username}</h2>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                    {isAdmin ? "Admin" : "User"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-lg">
                  <div className="text-3xl font-bold text-primary">
                    {totalQuizzesTaken}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Quizzes Taken
                  </div>
                </div>
                <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-lg">
                  <div className="text-3xl font-bold text-primary">
                    {averageScore.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Average Score
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col space-y-3">
                {isAdmin && (
                  <Button asChild>
                    <Link to="/admin/quizzes">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Manage Quizzes
                    </Link>
                  </Button>
                )}
                <Button variant="outline" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats and History */}
          <div className="lg:col-span-2 space-y-8">
            {/* Statistics Card */}
            <Card className="glass-panel animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quizScoresData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={quizScoresData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) =>
                            value.length > 15
                              ? `${value.substring(0, 15)}...`
                              : value
                          }
                        />
                        <YAxis
                          label={{
                            value: "Score (%)",
                            angle: -90,
                            position: "insideLeft",
                            style: { textAnchor: "middle" },
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                          }}
                        />
                        <Bar dataKey="score" fill="#3b82f6" barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No quiz data available. Take some quizzes to see your
                    performance.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quiz History */}
            <Card className="glass-panel animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">Recent Quiz Results</CardTitle>
              </CardHeader>
              <CardContent>
                {userResults.length > 0 ? (
                  <div className="divide-y">
                    {userResults
                      .sort(
                        (a, b) =>
                          new Date(b.completedAt).getTime() -
                          new Date(a.completedAt).getTime()
                      )
                      .slice(0, 5)
                      .map((result) => {
                        const quiz = quizzes.find((q) => q.id === result.quizId);
                        return (
                          <div
                            key={result.id}
                            className="py-4 flex items-center justify-between hover:bg-secondary/20 px-2 rounded-md"
                          >
                            <div className="flex items-center">
                              <div className="mr-3">
                                {(result.score / result.maxScore) * 100 >= 80 ? (
                                  <Award className="h-10 w-10 text-amber-500" />
                                ) : (
                                  <BookOpen className="h-10 w-10 text-blue-500" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium">
                                  {quiz ? quiz.title : "Unknown Quiz"}
                                </h3>
                                <div className="flex text-sm text-muted-foreground space-x-3">
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatTime(result.timeTaken)}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Score:{" "}
                                    {Math.round(
                                      (result.score / result.maxScore) * 100
                                    )}
                                    %
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" asChild size="sm">
                              <Link to={`/quizzes/${result.quizId}`}>
                                Take Again
                              </Link>
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    You haven't taken any quizzes yet.{" "}
                    <Link to="/quizzes" className="text-primary hover:underline">
                      Start your first quiz
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProfilePage;
