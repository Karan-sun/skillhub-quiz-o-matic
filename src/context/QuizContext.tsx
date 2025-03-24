
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

// Types
export type QuizQuestion = {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  questions: QuizQuestion[];
  createdAt: string;
};

export type QuizResult = {
  id: string;
  quizId: string;
  userId: string;
  username: string;
  score: number;
  maxScore: number;
  timeTaken: number; // in seconds
  completedAt: string;
};

type QuizContextType = {
  quizzes: Quiz[];
  userResults: QuizResult[];
  allResults: QuizResult[];
  createQuiz: (quiz: Omit<Quiz, "id" | "createdAt">) => void;
  deleteQuiz: (id: string) => void;
  updateQuiz: (id: string, quiz: Partial<Omit<Quiz, "id" | "createdAt">>) => void;
  submitQuizResult: (result: Omit<QuizResult, "id" | "completedAt">) => void;
  getQuiz: (id: string) => Quiz | undefined;
  getQuizResults: (quizId: string) => QuizResult[];
  getUserResults: (userId: string) => QuizResult[];
  activeQuiz: Quiz | null;
  setActiveQuiz: (quiz: Quiz | null) => void;
};

// Sample quiz data
const INITIAL_QUIZZES: Quiz[] = [
  {
    id: "1",
    title: "Web Development Basics",
    description: "Test your knowledge of HTML, CSS, and JavaScript fundamentals.",
    timeLimit: 10,
    questions: [
      {
        id: "q1",
        text: "Which tag is used to create a hyperlink in HTML?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correctOption: 1,
      },
      {
        id: "q2",
        text: "What property is used to change the text color in CSS?",
        options: ["text-color", "font-color", "color", "text-style"],
        correctOption: 2,
      },
      {
        id: "q3",
        text: "Which function is used to select an HTML element by its id in JavaScript?",
        options: ["document.query()", "document.getElementById()", "document.findElement()", "document.selectElement()"],
        correctOption: 1,
      },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Programming Concepts",
    description: "Basic principles of programming and computer science.",
    timeLimit: 15,
    questions: [
      {
        id: "q1",
        text: "What is a variable in programming?",
        options: [
          "A fixed value that never changes",
          "A named storage location for data",
          "A mathematical operation",
          "A programming language",
        ],
        correctOption: 1,
      },
      {
        id: "q2",
        text: "Which data structure follows the LIFO principle?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        correctOption: 1,
      },
      {
        id: "q3",
        text: "What is an algorithm?",
        options: [
          "A programming language",
          "A computer hardware component",
          "A step-by-step procedure to solve a problem",
          "A mathematical equation",
        ],
        correctOption: 2,
      },
      {
        id: "q4",
        text: "What does OOP stand for in programming?",
        options: [
          "Order of Operations",
          "Object-Oriented Programming",
          "Operational Output Process",
          "Organized Object Protocols",
        ],
        correctOption: 1,
      },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Sample results
const INITIAL_RESULTS: QuizResult[] = [
  {
    id: "1",
    quizId: "1",
    userId: "2",
    username: "user",
    score: 2,
    maxScore: 3,
    timeTaken: 240,
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    quizId: "2",
    userId: "2",
    username: "user",
    score: 3,
    maxScore: 4,
    timeTaken: 490,
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [results, setResults] = useState<QuizResult[]>(INITIAL_RESULTS);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  // Load data from localStorage if available
  useEffect(() => {
    const savedQuizzes = localStorage.getItem("skillhub_quizzes");
    const savedResults = localStorage.getItem("skillhub_results");
    
    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes));
    } else {
      localStorage.setItem("skillhub_quizzes", JSON.stringify(INITIAL_QUIZZES));
    }
    
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    } else {
      localStorage.setItem("skillhub_results", JSON.stringify(INITIAL_RESULTS));
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("skillhub_quizzes", JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem("skillhub_results", JSON.stringify(results));
  }, [results]);

  const createQuiz = (quiz: Omit<Quiz, "id" | "createdAt">) => {
    const newQuiz: Quiz = {
      ...quiz,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setQuizzes((prev) => [...prev, newQuiz]);
    toast.success("Quiz created successfully!");
  };

  const deleteQuiz = (id: string) => {
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
    toast.success("Quiz deleted successfully!");
  };

  const updateQuiz = (id: string, updates: Partial<Omit<Quiz, "id" | "createdAt">>) => {
    setQuizzes((prev) =>
      prev.map((quiz) =>
        quiz.id === id ? { ...quiz, ...updates } : quiz
      )
    );
    toast.success("Quiz updated successfully!");
  };

  const submitQuizResult = (result: Omit<QuizResult, "id" | "completedAt">) => {
    const newResult: QuizResult = {
      ...result,
      id: Date.now().toString(),
      completedAt: new Date().toISOString(),
    };
    setResults((prev) => [...prev, newResult]);
    toast.success("Quiz submitted successfully!");
  };

  const getQuiz = (id: string) => {
    return quizzes.find((quiz) => quiz.id === id);
  };

  const getQuizResults = (quizId: string) => {
    return results.filter((result) => result.quizId === quizId);
  };

  const getUserResults = (userId: string) => {
    return results.filter((result) => result.userId === userId);
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        userResults: [],
        allResults: results,
        createQuiz,
        deleteQuiz,
        updateQuiz,
        submitQuizResult,
        getQuiz,
        getQuizResults,
        getUserResults,
        activeQuiz,
        setActiveQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
