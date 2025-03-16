import React from "react";
import { Progress } from "../ui/progress";
import { Trophy, Award } from "lucide-react";

interface ScoreTrackerProps {
  currentScore: number;
  totalQuestions: number;
  currentQuestionIndex: number;
}

const ScoreTracker = ({
  currentScore = 0,
  totalQuestions = 10,
  currentQuestionIndex = 0,
}: ScoreTrackerProps) => {
  // Calculate progress percentage
  const progressPercentage = Math.round(
    (currentQuestionIndex / totalQuestions) * 100,
  );

  // Calculate score percentage
  const scorePercentage =
    totalQuestions > 0 ? Math.round((currentScore / totalQuestions) * 100) : 0;

  return (
    <div className="w-full p-4 bg-slate-50 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="font-medium">
            Score: {currentScore}/{totalQuestions}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <Award className="h-5 w-5 text-blue-500" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Score</span>
            <span>{scorePercentage}%</span>
          </div>
          <Progress
            value={scorePercentage}
            className="h-2"
            indicatorClassName={
              scorePercentage >= 70
                ? "bg-green-500"
                : scorePercentage >= 40
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ScoreTracker;
