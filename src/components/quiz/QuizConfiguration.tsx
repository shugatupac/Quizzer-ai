import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { BookOpen, Clock, HelpCircle } from "lucide-react";

interface QuizConfigurationProps {
  onStartQuiz: (config: QuizConfig) => void;
  onBack: () => void;
  selectedTopic?: string;
  selectedSubtopic?: string;
}

export interface QuizConfig {
  answerFormat: "multiple-choice" | "free-text";
  questionCount: number;
  timeLimit: number;
  showHints: boolean;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
}

const QuizConfiguration = ({
  onStartQuiz = () => {},
  onBack = () => {},
  selectedTopic = "Science",
  selectedSubtopic = "Physics",
}: QuizConfigurationProps) => {
  const [config, setConfig] = useState<QuizConfig>({
    answerFormat: "multiple-choice",
    questionCount: 5,
    timeLimit: 60,
    showHints: true,
    difficultyLevel: "intermediate",
  });

  const handleAnswerFormatChange = (value: string) => {
    setConfig({
      ...config,
      answerFormat: value as "multiple-choice" | "free-text",
    });
  };

  const handleQuestionCountChange = (value: number[]) => {
    setConfig({
      ...config,
      questionCount: value[0],
    });
  };

  const handleTimeLimitChange = (value: number[]) => {
    setConfig({
      ...config,
      timeLimit: value[0],
    });
  };

  const handleHintsToggle = (checked: boolean) => {
    setConfig({
      ...config,
      showHints: checked,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto p-4 bg-background"
    >
      <Card className="w-full shadow-lg">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl font-bold text-center">
            Quiz Configuration
          </CardTitle>
          <CardDescription className="text-center">
            Configure your quiz on {selectedTopic}: {selectedSubtopic}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Answer Format
            </h3>
            <RadioGroup
              value={config.answerFormat}
              onValueChange={handleAnswerFormatChange}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                <RadioGroupItem value="multiple-choice" id="multiple-choice" />
                <Label
                  htmlFor="multiple-choice"
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-medium">Multiple Choice</div>
                  <div className="text-sm text-muted-foreground">
                    Select from provided options
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                <RadioGroupItem value="free-text" id="free-text" />
                <Label htmlFor="free-text" className="flex-1 cursor-pointer">
                  <div className="font-medium">Free Text</div>
                  <div className="text-sm text-muted-foreground">
                    Type your answer freely
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Quiz Settings
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="question-count">Number of Questions</Label>
                  <span className="text-sm font-medium">
                    {config.questionCount}
                  </span>
                </div>
                <Slider
                  id="question-count"
                  min={1}
                  max={20}
                  step={1}
                  value={[config.questionCount]}
                  onValueChange={handleQuestionCountChange}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="time-limit">
                    Time Limit per Question (seconds)
                  </Label>
                  <span className="text-sm font-medium">
                    {config.timeLimit}
                  </span>
                </div>
                <Slider
                  id="time-limit"
                  min={10}
                  max={300}
                  step={5}
                  value={[config.timeLimit]}
                  onValueChange={handleTimeLimitChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="hints"
                    className="text-base flex items-center gap-2"
                  >
                    <HelpCircle className="h-4 w-4 text-primary" />
                    Show Hints
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get helpful hints when you're stuck
                  </p>
                </div>
                <Switch
                  id="hints"
                  checked={config.showHints}
                  onCheckedChange={handleHintsToggle}
                />
              </div>

              <div className="space-y-2 mt-6">
                <Label
                  htmlFor="difficulty-level"
                  className="text-base flex items-center gap-2"
                >
                  Difficulty Level
                </Label>
                <RadioGroup
                  value={config.difficultyLevel}
                  onValueChange={(value) =>
                    setConfig({
                      ...config,
                      difficultyLevel: value as
                        | "beginner"
                        | "intermediate"
                        | "advanced",
                    })
                  }
                  className="grid grid-cols-3 gap-2"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner" className="cursor-pointer">
                      Beginner
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate" className="cursor-pointer">
                      Intermediate
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced" className="cursor-pointer">
                      Advanced
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
          <Button variant="outline" onClick={onBack}>
            Back to Topics
          </Button>
          <Button onClick={() => onStartQuiz(config)}>Start Quiz</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default QuizConfiguration;
