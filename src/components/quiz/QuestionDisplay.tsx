import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";
import { Timer, AlertCircle } from "lucide-react";

interface QuestionDisplayProps {
  question?: string;
  options?: string[];
  answerFormat?: "multiple-choice" | "free-text";
  currentQuestionNumber?: number;
  totalQuestions?: number;
  timeLimit?: number;
  onSubmit?: (answer: string) => void;
  isSubmitting?: boolean;
}

const QuestionDisplay = ({
  question = "What is the primary function of mitochondria in a cell?",
  options = [
    "Cell division",
    "Energy production",
    "Protein synthesis",
    "Waste removal",
  ],
  answerFormat = "multiple-choice",
  currentQuestionNumber = 1,
  totalQuestions = 10,
  timeLimit = 60,
  onSubmit = () => {},
  isSubmitting = false,
}: QuestionDisplayProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [textAnswer, setTextAnswer] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<number>(timeLimit);

  // Progress calculation
  const progressPercentage = (currentQuestionNumber / totalQuestions) * 100;

  const handleSubmit = () => {
    if (answerFormat === "multiple-choice") {
      onSubmit(selectedOption);
    } else {
      onSubmit(textAnswer);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full max-w-3xl mx-auto bg-white shadow-lg">
        <CardHeader className="border-b pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">
              Question {currentQuestionNumber} of {totalQuestions}
            </CardTitle>
            <div className="flex items-center gap-2 text-amber-600">
              <Timer size={18} />
              <span className="font-medium">{timeRemaining}s</span>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2 mt-2" />
        </CardHeader>

        <CardContent className="pt-6 pb-4">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">{question}</h3>

            {answerFormat === "multiple-choice" ? (
              <RadioGroup
                value={selectedOption}
                onValueChange={setSelectedOption}
                className="space-y-3"
              >
                {options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 p-3 rounded-md border hover:bg-slate-50 transition-colors"
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-grow cursor-pointer"
                    >
                      {option}
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-2">
                <Textarea
                  placeholder="Type your answer here..."
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  className="min-h-[150px] w-full p-3"
                />
                <div className="flex items-center text-sm text-muted-foreground">
                  <AlertCircle size={14} className="mr-1" />
                  <span>Be specific and concise in your answer</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t pt-4 flex justify-between">
          <Button variant="outline">Skip</Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              (answerFormat === "multiple-choice" && !selectedOption) ||
              (answerFormat === "free-text" && !textAnswer.trim())
            }
          >
            {isSubmitting ? "Submitting..." : "Submit Answer"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default QuestionDisplay;
