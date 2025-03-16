import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { Trophy, Award, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface ResultsScreenProps {
  score?: number;
  totalQuestions?: number;
  correctAnswers?: number;
  topic?: string;
  subtopic?: string;
  onPlayAgain?: () => void;
  onChangeTopics?: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score = 800,
  totalQuestions = 10,
  correctAnswers = 8,
  topic = "Science",
  subtopic = "Astronomy",
  onPlayAgain = () => {},
  onChangeTopics = () => {},
}) => {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  // Determine feedback based on score percentage
  const getFeedback = () => {
    if (percentage >= 90) return "Excellent! You're a master of this topic!";
    if (percentage >= 70) return "Great job! You have a solid understanding.";
    if (percentage >= 50) return "Good effort! Keep practicing to improve.";
    return "Keep learning! Try again to improve your score.";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-6 bg-slate-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="w-full shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
              <Trophy className="h-8 w-8" />
              Quiz Results
            </CardTitle>
            <CardDescription className="text-white/90 text-lg">
              {topic}: {subtopic}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 pb-2">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{percentage}%</span>
                </div>
                <svg className="w-32 h-32" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-blue-600"
                    strokeWidth="8"
                    strokeDasharray={`${percentage * 2.51} 251`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>

              <p className="text-xl font-medium mb-2">{getFeedback()}</p>

              <div className="grid grid-cols-2 gap-6 w-full max-w-md mt-4">
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                  <span className="text-2xl font-bold text-blue-600">
                    {correctAnswers}
                  </span>
                  <span className="text-sm text-gray-600">Correct Answers</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
                  <span className="text-2xl font-bold text-purple-600">
                    {score}
                  </span>
                  <span className="text-sm text-gray-600">Total Score</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-2">Achievement</h3>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <Award className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="font-medium">
                    {percentage >= 70 ? "Topic Master" : "Knowledge Seeker"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {percentage >= 70
                      ? "You've demonstrated excellent knowledge in this area!"
                      : "Keep learning to earn the Topic Master badge!"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={onPlayAgain}
              className="w-full sm:w-auto flex items-center gap-2"
              variant="default"
            >
              <RotateCcw className="h-4 w-4" />
              Play Again
            </Button>
            <Button
              onClick={onChangeTopics}
              className="w-full sm:w-auto"
              variant="outline"
            >
              Change Topics
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResultsScreen;
