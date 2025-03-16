import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";

interface FeedbackDisplayProps {
  isCorrect?: boolean;
  explanation?: string;
  visible?: boolean;
}

const FeedbackDisplay = ({
  isCorrect = true,
  explanation = "That's correct! The mitochondria is indeed the powerhouse of the cell, responsible for generating most of the cell's supply of ATP, which is used as a source of chemical energy.",
  visible = true,
}: FeedbackDisplayProps) => {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <Card className="w-full max-w-3xl mx-auto p-4 bg-white shadow-md">
        <Alert
          variant={isCorrect ? "default" : "destructive"}
          className={`border ${isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <div>
              <AlertTitle
                className={`text-lg font-semibold ${isCorrect ? "text-green-700" : "text-red-700"}`}
              >
                {isCorrect ? "Correct!" : "Incorrect"}
              </AlertTitle>
              <AlertDescription className="mt-2 text-sm">
                {explanation}
              </AlertDescription>
            </div>
          </div>
        </Alert>

        {/* Animation for feedback appearance */}
        <div className="mt-4 flex justify-center">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => {}}
          >
            Continue
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

export default FeedbackDisplay;
