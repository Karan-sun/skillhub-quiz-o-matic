
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface QuizTimerProps {
  durationInMinutes: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

const QuizTimer: React.FC<QuizTimerProps> = ({
  durationInMinutes,
  onTimeUp,
  isPaused = false,
}) => {
  // Convert minutes to seconds
  const totalSeconds = durationInMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const newTimeLeft = totalSeconds - elapsedSeconds;
      
      if (newTimeLeft <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        onTimeUp();
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [totalSeconds, startTime, onTimeUp, isPaused]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const progressValue = (timeLeft / totalSeconds) * 100;

  // Determine color based on time left
  const getColorClass = () => {
    if (progressValue > 50) return "text-green-600";
    if (progressValue > 20) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Card className="w-full glass-panel">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Time Remaining</span>
          </div>
          <span className={`text-sm font-bold ${getColorClass()}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </CardContent>
    </Card>
  );
};

export default QuizTimer;
