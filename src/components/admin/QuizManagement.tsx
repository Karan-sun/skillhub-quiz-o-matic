
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuiz } from "@/context/QuizContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  BarChart,
  Copy,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const QuizManagement: React.FC = () => {
  const { quizzes, deleteQuiz, getQuizResults } = useQuiz();
  const [searchTerm, setSearchTerm] = useState("");
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);

  // Filter quizzes based on search term
  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteQuiz = (id: string) => {
    deleteQuiz(id);
    setQuizToDelete(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass-panel">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Manage Quizzes</CardTitle>
              <CardDescription>
                Create, edit, and manage your quizzes
              </CardDescription>
            </div>
            <Button asChild>
              <Link to="/admin/quizzes/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Quiz
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
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
        </CardContent>
      </Card>

      <Card className="glass-panel">
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">Title</TableHead>
                  <TableHead className="text-center">Questions</TableHead>
                  <TableHead className="text-center">Time Limit</TableHead>
                  <TableHead className="text-center">Participants</TableHead>
                  <TableHead className="text-right">Created</TableHead>
                  <TableHead className="text-right w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuizzes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center"
                    >
                      No quizzes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuizzes.map((quiz) => {
                    const resultsCount = getQuizResults(quiz.id).length;
                    return (
                      <TableRow key={quiz.id} className="hover-scale">
                        <TableCell className="font-medium">
                          {quiz.title}
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {quiz.description}
                          </p>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">
                            {quiz.questions.length}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {quiz.timeLimit} min
                        </TableCell>
                        <TableCell className="text-center">
                          {resultsCount}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-sm">
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link
                                  to={`/admin/quizzes/edit/${quiz.id}`}
                                  className="flex items-center cursor-pointer"
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  to={`/admin/quizzes/results/${quiz.id}`}
                                  className="flex items-center cursor-pointer"
                                >
                                  <BarChart className="mr-2 h-4 w-4" />
                                  <span>Results</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  to={`/quizzes/${quiz.id}`}
                                  className="flex items-center cursor-pointer"
                                >
                                  <Copy className="mr-2 h-4 w-4" />
                                  <span>Preview</span>
                                </Link>
                              </DropdownMenuItem>
                              <AlertDialog
                                open={quizToDelete === quiz.id}
                                onOpenChange={(isOpen) => {
                                  if (!isOpen) setQuizToDelete(null);
                                }}
                              >
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      setQuizToDelete(quiz.id);
                                    }}
                                    className="text-destructive focus:text-destructive cursor-pointer"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure you want to delete this quiz?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the
                                      quiz and all associated results.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => handleDeleteQuiz(quiz.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizManagement;
