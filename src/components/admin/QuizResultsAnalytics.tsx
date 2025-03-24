
import React from "react";
import { useParams } from "react-router-dom";
import { useQuiz, QuizResult } from "@/context/QuizContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Award, CheckCircle, XCircle } from "lucide-react";

const QuizResultsAnalytics: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { getQuiz, getQuizResults } = useQuiz();

  const quiz = getQuiz(quizId || "");
  const results = getQuizResults(quizId || "");

  if (!quiz) {
    return (
      <div className="text-center p-12">
        <h2 className="text-2xl font-bold">Quiz not found</h2>
      </div>
    );
  }

  // Calculate analytics
  const averageScore = results.length
    ? results.reduce((sum, result) => sum + (result.score / result.maxScore) * 100, 0) /
      results.length
    : 0;

  const averageTimeTaken = results.length
    ? results.reduce((sum, result) => sum + result.timeTaken, 0) / results.length
    : 0;

  // Format time (seconds) as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  // Score distribution data for bar chart
  const scoreRanges = [
    { name: "0-20%", range: [0, 20], count: 0 },
    { name: "21-40%", range: [21, 40], count: 0 },
    { name: "41-60%", range: [41, 60], count: 0 },
    { name: "61-80%", range: [61, 80], count: 0 },
    { name: "81-100%", range: [81, 100], count: 0 },
  ];

  results.forEach((result) => {
    const scorePercentage = Math.round((result.score / result.maxScore) * 100);
    const range = scoreRanges.find(
      (r) => scorePercentage >= r.range[0] && scorePercentage <= r.range[1]
    );
    if (range) range.count++;
  });

  // Pass/Fail data for pie chart (considering 60% as passing score)
  const passFailData = [
    {
      name: "Pass",
      value: results.filter(
        (result) => (result.score / result.maxScore) * 100 >= 60
      ).length,
    },
    {
      name: "Fail",
      value: results.filter(
        (result) => (result.score / result.maxScore) * 100 < 60
      ).length,
    },
  ];

  const COLORS = ["#10b981", "#ef4444"];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>{quiz.title} - Results Analysis</CardTitle>
          <CardDescription>
            Analytics based on {results.length} participant{results.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-500" />
              Total Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{results.length}</div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Award className="mr-2 h-5 w-5 text-amber-500" />
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {averageScore.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Clock className="mr-2 h-5 w-5 text-purple-500" />
              Average Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatTime(averageTimeTaken)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={scoreRanges}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }} 
                  />
                  <Bar dataKey="count" fill="#3b82f6" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-lg">Pass/Fail Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              {results.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={passFailData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {passFailData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-lg">Participant Results</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No results yet
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead className="text-center">Time Taken</TableHead>
                    <TableHead className="text-right">Completed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">
                        {result.username}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={
                            result.score / result.maxScore >= 0.7
                              ? "bg-green-500/10 text-green-700 hover:bg-green-500/10"
                              : result.score / result.maxScore >= 0.4
                              ? "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10"
                              : "bg-red-500/10 text-red-700 hover:bg-red-500/10"
                          }
                        >
                          {result.score}/{result.maxScore}{" "}
                          {`(${Math.round((result.score / result.maxScore) * 100)}%)`}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {formatTime(result.timeTaken)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {new Date(result.completedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizResultsAnalytics;
