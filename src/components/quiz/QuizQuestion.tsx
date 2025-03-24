
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { QuizQuestion as QuestionType } from "@/context/QuizContext";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";

interface QuizQuestionProps {
  question: QuestionType;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedOption: number) => void;
  onNext: () => void;
  showResults?: boolean;
  selectedOption?: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
  showResults = false,
  selectedOption,
}) => {
  const [selected, setSelected] = useState<number | undefined>(selectedOption);
  const [isAnswered, setIsAnswered] = useState(selectedOption !== undefined && selectedOption !== -1);

  // Update local state when selectedOption prop changes
  useEffect(() => {
    setSelected(selectedOption === -1 ? undefined : selectedOption);
    setIsAnswered(selectedOption !== undefined && selectedOption !== -1);
  }, [selectedOption]);

  const handleOptionSelect = (value: string) => {
    if (!isAnswered && !showResults) {
      const optionIndex = parseInt(value, 10);
      setSelected(optionIndex);
    }
  };

  const handleSubmit = () => {
    if (selected !== undefined) {
      onAnswer(selected);
      setIsAnswered(true);
      toast.success("Answer submitted!");
    } else {
      toast.error("Please select an answer");
    }
  };

  const getOptionClassName = (index: number) => {
    // Only show correct/incorrect highlighting when the question has been answered
    // AND we're in the results view mode
    if (!showResults || selected === undefined) return "";
    
    if (index === question.correctOption) {
      return "border-green-500 bg-green-50";
    }
    
    if (selected === index && index !== question.correctOption) {
      return "border-red-500 bg-red-50";
    }
    
    return "";
  };

  return (
    <Card className="glass-panel animate-scale-in">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>
        <CardTitle className="text-xl font-semibold">{question.text}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selected?.toString()}
          onValueChange={handleOptionSelect}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center space-x-2 rounded-md border p-3 transition-colors",
                getOptionClassName(index)
              )}
            >
              <RadioGroupItem
                value={index.toString()}
                id={`option-${index}`}
                disabled={isAnswered && showResults}
              />
              <Label
                htmlFor={`option-${index}`}
                className="flex-grow cursor-pointer"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-6 flex justify-end">
          {showResults ? (
            <Button onClick={onNext}>
              {questionNumber === totalQuestions ? "Finish" : "Next Question"}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={selected === undefined || isAnswered}
            >
              {isAnswered ? "Answered" : "Submit Answer"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;
