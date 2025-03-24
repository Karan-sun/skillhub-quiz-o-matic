
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, AlertCircle, Save } from "lucide-react";
import { Quiz, QuizQuestion, useQuiz } from "@/context/QuizContext";
import { useNavigate } from "react-router-dom";

interface QuizFormProps {
  initialQuiz?: Quiz;
  mode: "create" | "edit";
}

const QuizForm: React.FC<QuizFormProps> = ({ initialQuiz, mode = "create" }) => {
  const navigate = useNavigate();
  const { createQuiz, updateQuiz } = useQuiz();
  
  const [title, setTitle] = useState(initialQuiz?.title || "");
  const [description, setDescription] = useState(initialQuiz?.description || "");
  const [timeLimit, setTimeLimit] = useState(initialQuiz?.timeLimit.toString() || "10");
  const [questions, setQuestions] = useState<Omit<QuizQuestion, "id">[]>(
    initialQuiz?.questions.map(q => ({
      text: q.text,
      options: q.options,
      correctOption: q.correctOption
    })) || [{ 
      text: "", 
      options: ["", "", "", ""], 
      correctOption: 0 
    }]
  );
  
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    timeLimit?: string;
    questions?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      title?: string;
      description?: string;
      timeLimit?: string;
      questions?: string;
    } = {};
    
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    
    const timeLimitNum = parseFloat(timeLimit);
    if (isNaN(timeLimitNum) || timeLimitNum <= 0) {
      newErrors.timeLimit = "Time limit must be a positive number";
    }
    
    // Validate questions
    const invalidQuestions = questions.filter(
      (q) => !q.text.trim() || q.options.some((opt) => !opt.trim())
    );
    
    if (invalidQuestions.length > 0) {
      newErrors.questions = "All questions and options must be filled out";
    }
    
    if (questions.length === 0) {
      newErrors.questions = "At least one question is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Generate IDs for questions
    const questionsWithIds: QuizQuestion[] = questions.map((q) => ({
      ...q,
      id: Math.random().toString(36).substring(2, 11),
    }));
    
    if (mode === "create") {
      createQuiz({
        title,
        description,
        timeLimit: parseInt(timeLimit),
        questions: questionsWithIds,
      });
      navigate("/admin/quizzes");
    } else if (initialQuiz) {
      updateQuiz(initialQuiz.id, {
        title,
        description,
        timeLimit: parseInt(timeLimit),
        questions: questionsWithIds,
      });
      navigate("/admin/quizzes");
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: ["", "", "", ""],
        correctOption: 0,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      return; // Don't remove the last question
    }
    
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index: number, field: string, value: string) => {
    const newQuestions = [...questions];
    
    if (field === "text") {
      newQuestions[index].text = value;
    }
    
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const updateCorrectOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctOption = optionIndex;
    setQuestions(newQuestions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>{mode === "create" ? "Create New Quiz" : "Edit Quiz"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter quiz description"
              className={errors.description ? "border-red-500" : ""}
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> {errors.description}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
            <Input
              id="timeLimit"
              type="number"
              min="1"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              className={errors.timeLimit ? "border-red-500" : ""}
            />
            {errors.timeLimit && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> {errors.timeLimit}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Questions</h3>
          <Button type="button" onClick={addQuestion} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Question
          </Button>
        </div>

        {errors.questions && (
          <p className="text-red-500 text-sm flex items-center bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-4 w-4 mr-2" /> {errors.questions}
          </p>
        )}

        {questions.map((question, qIndex) => (
          <Card key={qIndex} className="glass-panel">
            <CardHeader className="pb-3 flex flex-row justify-between items-start">
              <CardTitle className="text-lg">Question {qIndex + 1}</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeQuestion(qIndex)}
                disabled={questions.length <= 1}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`question-${qIndex}`}>Question Text</Label>
                <Textarea
                  id={`question-${qIndex}`}
                  value={question.text}
                  onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                  placeholder="Enter question text"
                />
              </div>

              <div className="space-y-3">
                <Label>Options (select the correct answer)</Label>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="flex gap-2 items-center">
                    <Button
                      type="button"
                      variant={question.correctOption === oIndex ? "default" : "outline"}
                      onClick={() => updateCorrectOption(qIndex, oIndex)}
                      size="icon"
                      className="h-8 w-8 shrink-0"
                    >
                      {String.fromCharCode(65 + oIndex)}
                    </Button>
                    <Input
                      value={option}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => navigate("/admin/quizzes")}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          {mode === "create" ? "Create Quiz" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default QuizForm;
