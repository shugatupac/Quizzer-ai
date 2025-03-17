import React, { useState, useEffect } from "react";
import TopicSelection from "./TopicSelection";
import QuizConfiguration from "./QuizConfiguration";
import QuestionDisplay from "./QuestionDisplay";
import FeedbackDisplay from "./FeedbackDisplay";
import ScoreTracker from "./ScoreTracker";
import ResultsScreen from "./ResultsScreen";
import FileUpload from "./FileUpload";
import { Button } from "@/components/ui/button";

// Game stages to track the current state of the quiz
enum GameStage {
  TOPIC_SELECTION,
  QUIZ_CONFIGURATION,
  QUESTION_DISPLAY,
  FEEDBACK_DISPLAY,
  RESULTS_SCREEN,
  FILE_UPLOAD,
  FILE_PROCESSING,
}

// Define the QuizConfig interface here instead of importing it
interface QuizConfig {
  answerFormat: "multiple-choice" | "free-text";
  questionCount: number;
  timeLimit: number;
  showHints: boolean;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
}

interface GameContainerProps {
  className?: string;
}

const GameContainer: React.FC<GameContainerProps> = ({ className = "" }) => {
  // State management for the game
  const [gameStage, setGameStage] = useState<GameStage>(
    GameStage.TOPIC_SELECTION,
  );
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>("");
  const [quizConfig, setQuizConfig] = useState<QuizConfig>({
    answerFormat: "multiple-choice",
    questionCount: 5,
    timeLimit: 60,
    showHints: true,
    difficultyLevel: "intermediate",
  });

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<{
    fileName: string;
    questionCount: number;
    fileType: string;
    fileContent?: string;
  } | null>(null);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Track used questions to avoid repetition
  const [usedQuestionIndices, setUsedQuestionIndices] = useState<
    Record<string, number[]>
  >({});

  // Mock questions for demonstration - organized by topic
  const [questionsByTopic] = useState<Record<string, any[]>>({
    science: [
      {
        question: "What is the primary function of mitochondria in a cell?",
        options: [
          "Cell division",
          "Energy production",
          "Protein synthesis",
          "Waste removal",
        ],
        correctAnswer: "Energy production",
        explanation:
          "Mitochondria are often referred to as the powerhouse of the cell because they generate most of the cell's supply of ATP, which is used as a source of chemical energy.",
      },
      {
        question: "Which of the following is NOT a type of chemical bond?",
        options: [
          "Ionic bond",
          "Covalent bond",
          "Magnetic bond",
          "Hydrogen bond",
        ],
        correctAnswer: "Magnetic bond",
        explanation:
          "Magnetic bond is not a type of chemical bond. The main types of chemical bonds are ionic, covalent, hydrogen, and metallic bonds.",
      },
      {
        question:
          "What is the process by which plants make their own food using sunlight?",
        options: ["Respiration", "Photosynthesis", "Fermentation", "Digestion"],
        correctAnswer: "Photosynthesis",
        explanation:
          "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water.",
      },
      {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: "Au",
        explanation:
          "The chemical symbol for gold is Au, which comes from the Latin word 'aurum', meaning gold.",
      },
      {
        question: "Which planet in our solar system has the most moons?",
        options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
        correctAnswer: "Saturn",
        explanation:
          "Saturn has 83 confirmed moons, which is more than any other planet in our solar system. Jupiter is a close second with 79 confirmed moons.",
      },
      {
        question: "What is the smallest unit of life?",
        options: ["Atom", "Cell", "Molecule", "Organelle"],
        correctAnswer: "Cell",
        explanation:
          "The cell is the smallest unit of life that can replicate independently.",
      },
      {
        question: "Which of these is NOT a state of matter?",
        options: ["Solid", "Liquid", "Gas", "Mineral"],
        correctAnswer: "Mineral",
        explanation:
          "The main states of matter are solid, liquid, gas, and plasma. Mineral is a type of solid material.",
      },
    ],
    math: [
      {
        question: "What is the value of π (pi) to two decimal places?",
        options: ["3.14", "3.41", "3.12", "3.16"],
        correctAnswer: "3.14",
        explanation:
          "The value of π (pi) to two decimal places is 3.14. It is the ratio of a circle's circumference to its diameter.",
      },
      {
        question: "What is the square root of 144?",
        options: ["12", "14", "10", "16"],
        correctAnswer: "12",
        explanation: "The square root of 144 is 12, because 12 × 12 = 144.",
      },
      {
        question:
          "In a right-angled triangle, what is the Pythagorean theorem?",
        options: ["a² + b² = c²", "a + b = c", "a² - b² = c²", "a × b = c"],
        correctAnswer: "a² + b² = c²",
        explanation:
          "The Pythagorean theorem states that in a right-angled triangle, the square of the length of the hypotenuse (c) equals the sum of squares of the other two sides (a and b).",
      },
      {
        question: "What is the derivative of x²?",
        options: ["2x", "x", "2", "x²"],
        correctAnswer: "2x",
        explanation:
          "The derivative of x² with respect to x is 2x, following the power rule of differentiation.",
      },
      {
        question: "What is the value of log₁₀(100)?",
        options: ["1", "2", "10", "100"],
        correctAnswer: "2",
        explanation: "log₁₀(100) = 2 because 10² = 100.",
      },
      {
        question: "What is the formula for the area of a circle?",
        options: ["πr²", "2πr", "πd", "r²"],
        correctAnswer: "πr²",
        explanation:
          "The area of a circle is calculated using the formula A = πr², where r is the radius of the circle.",
      },
    ],
    history: [
      {
        question: "In which year did World War II end?",
        options: ["1943", "1945", "1947", "1950"],
        correctAnswer: "1945",
        explanation:
          "World War II ended in 1945 with the surrender of Germany in May and Japan in September.",
      },
      {
        question: "Who was the first President of the United States?",
        options: [
          "Thomas Jefferson",
          "John Adams",
          "George Washington",
          "Benjamin Franklin",
        ],
        correctAnswer: "George Washington",
        explanation:
          "George Washington was the first President of the United States, serving from 1789 to 1797.",
      },
      {
        question: "Which ancient civilization built the pyramids at Giza?",
        options: ["Romans", "Greeks", "Mayans", "Egyptians"],
        correctAnswer: "Egyptians",
        explanation:
          "The ancient Egyptians built the pyramids at Giza as tombs for their pharaohs.",
      },
      {
        question: "When did the French Revolution begin?",
        options: ["1689", "1789", "1889", "1989"],
        correctAnswer: "1789",
        explanation:
          "The French Revolution began in 1789 with the storming of the Bastille on July 14.",
      },
    ],
    literature: [
      {
        question: "Who wrote 'Romeo and Juliet'?",
        options: [
          "Charles Dickens",
          "William Shakespeare",
          "Jane Austen",
          "Mark Twain",
        ],
        correctAnswer: "William Shakespeare",
        explanation:
          "'Romeo and Juliet' was written by William Shakespeare around 1595.",
      },
      {
        question:
          "Which novel begins with the line 'It was the best of times, it was the worst of times'?",
        options: [
          "Great Expectations",
          "Oliver Twist",
          "A Tale of Two Cities",
          "David Copperfield",
        ],
        correctAnswer: "A Tale of Two Cities",
        explanation:
          "'A Tale of Two Cities' by Charles Dickens begins with this famous opening line.",
      },
      {
        question: "Who is the author of 'To Kill a Mockingbird'?",
        options: [
          "J.D. Salinger",
          "Harper Lee",
          "F. Scott Fitzgerald",
          "Ernest Hemingway",
        ],
        correctAnswer: "Harper Lee",
        explanation:
          "'To Kill a Mockingbird' was written by Harper Lee and published in 1960.",
      },
    ],
  });

  // Current questions for the quiz
  const [questions, setQuestions] = useState<any[]>([
    {
      question: "What is the primary function of mitochondria in a cell?",
      options: [
        "Cell division",
        "Energy production",
        "Protein synthesis",
        "Waste removal",
      ],
      correctAnswer: "Energy production",
      explanation:
        "Mitochondria are often referred to as the powerhouse of the cell because they generate most of the cell's supply of ATP, which is used as a source of chemical energy.",
    },
    {
      question: "Which planet in our solar system has the most moons?",
      options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
      correctAnswer: "Saturn",
      explanation:
        "Saturn has 83 confirmed moons, which is more than any other planet in our solar system. Jupiter is a close second with 79 confirmed moons.",
    },
    {
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: "Au",
      explanation:
        "The chemical symbol for gold is Au, which comes from the Latin word 'aurum', meaning gold.",
    },
    {
      question: "Which of the following is NOT a type of chemical bond?",
      options: [
        "Ionic bond",
        "Covalent bond",
        "Magnetic bond",
        "Hydrogen bond",
      ],
      correctAnswer: "Magnetic bond",
      explanation:
        "Magnetic bond is not a type of chemical bond. The main types of chemical bonds are ionic, covalent, hydrogen, and metallic bonds.",
    },
    {
      question:
        "What is the process by which plants make their own food using sunlight?",
      options: ["Respiration", "Photosynthesis", "Fermentation", "Digestion"],
      correctAnswer: "Photosynthesis",
      explanation:
        "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water.",
    },
  ]);

  // Handle topic selection
  const handleTopicSelected = (topicId: string, subtopicId: string) => {
    setSelectedTopic(topicId);
    setSelectedSubtopic(subtopicId);
    setGameStage(GameStage.QUIZ_CONFIGURATION);
  };

  // Handle quiz configuration
  const handleStartQuiz = (config: QuizConfig) => {
    setQuizConfig(config);
    setCurrentQuestionIndex(0);
    setScore(0);

    // Select questions for this topic/subtopic
    const topicKey = selectedTopic;
    if (questionsByTopic[topicKey]) {
      const availableQuestions = questionsByTopic[topicKey];
      const usedIndices = usedQuestionIndices[topicKey] || [];

      // Find unused questions
      const unusedIndices = Array.from(
        { length: availableQuestions.length },
        (_, i) => i,
      ).filter((index) => !usedIndices.includes(index));

      // If we've used all questions, reset
      if (unusedIndices.length < config.questionCount) {
        setUsedQuestionIndices((prev) => ({
          ...prev,
          [topicKey]: [],
        }));

        // Use all available indices
        const selectedQuestions = shuffleArray(availableQuestions).slice(
          0,
          config.questionCount,
        );

        setQuestions(selectedQuestions);

        // Mark these questions as used
        setUsedQuestionIndices((prev) => ({
          ...prev,
          [topicKey]: Array.from(
            { length: selectedQuestions.length },
            (_, i) => i,
          ),
        }));
      } else {
        // Randomly select unused questions
        const shuffledUnused = shuffleArray(unusedIndices);
        const selectedIndices = shuffledUnused.slice(0, config.questionCount);
        const selectedQuestions = selectedIndices.map(
          (index) => availableQuestions[index],
        );

        setQuestions(selectedQuestions);

        // Mark these questions as used
        setUsedQuestionIndices((prev) => ({
          ...prev,
          [topicKey]: [...usedIndices, ...selectedIndices],
        }));
      }
    } else {
      // Fallback to default questions if topic not found
      setQuestions([
        {
          question: "What is the primary function of mitochondria in a cell?",
          options: [
            "Cell division",
            "Energy production",
            "Protein synthesis",
            "Waste removal",
          ],
          correctAnswer: "Energy production",
          explanation:
            "Mitochondria are often referred to as the powerhouse of the cell because they generate most of the cell's supply of ATP.",
        },
      ]);
    }

    setGameStage(GameStage.QUESTION_DISPLAY);
  };

  // Helper function to shuffle array
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Handle answer submission
  const handleAnswerSubmit = (answer: string) => {
    setIsSubmitting(true);

    // Simulate API call to evaluate answer
    setTimeout(() => {
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = answer === currentQuestion.correctAnswer;

      setIsAnswerCorrect(isCorrect);
      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }

      setIsSubmitting(false);
      setGameStage(GameStage.FEEDBACK_DISPLAY);
    }, 1000);
  };

  // Handle file upload completion
  const handleFileUploadComplete = (fileData: {
    fileName: string;
    questionCount: number;
    fileType: string;
    fileContent?: string;
  }) => {
    setUploadedFile(fileData);
    setGameStage(GameStage.FILE_PROCESSING);

    // Process the document and generate questions
    (async () => {
      try {
        // Generate AI questions based on the document
        const generatedQuestions =
          await generateAIQuestionsFromDocument(fileData);
        setQuestions(generatedQuestions);

        // Set up quiz configuration
        setQuizConfig({
          ...quizConfig,
          questionCount: fileData.questionCount,
        });

        setCurrentQuestionIndex(0);
        setScore(0);
        setGameStage(GameStage.QUESTION_DISPLAY);
      } catch (error) {
        console.error("Error generating questions:", error);
        // Show error message or fallback
        setGameStage(GameStage.TOPIC_SELECTION);
      }
    })();
  };

  // Generate questions from a document based on its content
  const generateAIQuestionsFromDocument = async (fileData: {
    fileName: string;
    questionCount: number;
    fileType: string;
    fileContent?: string;
  }) => {
    const fileContent = fileData.fileContent || "";
    let questions = [];

    try {
      // Import the OpenAI function
      const { generateQuestionsWithOpenAI } = await import("@/lib/openai");

      // Try to generate questions with OpenAI
      const openAIQuestions = await generateQuestionsWithOpenAI(
        fileContent,
        fileData.questionCount,
      );

      if (openAIQuestions && openAIQuestions.length > 0) {
        return openAIQuestions;
      }
    } catch (error) {
      console.error("Error generating questions with OpenAI:", error);
    }

    // Fallback to basic question generation if OpenAI fails
    console.log("Falling back to basic question generation");

    // Extract some words from the content to use in questions
    const words = fileContent
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 4)
      .slice(0, 20);

    // If we have content to work with
    if (words.length > 0) {
      for (let i = 0; i < Math.min(fileData.questionCount, words.length); i++) {
        const word = words[i] || "concept";

        questions.push({
          question: `What is the significance of "${word}" in the context of this document?`,
          options: [
            `${word} is a key concept that defines the main thesis`,
            `${word} is mentioned as a supporting example`,
            `${word} is criticized or presented as a counterargument`,
            `${word} is not significantly relevant to the main topic`,
          ],
          correctAnswer: `${word} is a key concept that defines the main thesis`,
          explanation: `The term "${word}" appears in the document and represents an important concept related to the subject matter.`,
        });
      }
    }

    // Fill remaining questions if needed
    while (questions.length < fileData.questionCount) {
      const index = questions.length + 1;
      questions.push({
        question: `Based on the content of ${fileData.fileName}, what is the main topic discussed?`,
        options: [
          `The document primarily discusses theoretical concepts`,
          `The document focuses on practical applications`,
          `The document presents a historical overview`,
          `The document analyzes comparative perspectives`,
        ],
        correctAnswer: `The document primarily discusses theoretical concepts`,
        explanation: `After analyzing the content of the document, it appears to focus mainly on theoretical frameworks and concepts.`,
      });
    }

    return questions;
  };

  // Handle continuing to next question after feedback
  const handleContinue = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setGameStage(GameStage.QUESTION_DISPLAY);
    } else {
      setGameStage(GameStage.RESULTS_SCREEN);
    }
  };

  // Handle play again
  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameStage(GameStage.QUESTION_DISPLAY);
  };

  // Handle change topics
  const handleChangeTopics = () => {
    setGameStage(GameStage.TOPIC_SELECTION);
  };

  // Render the appropriate component based on the current game stage
  const renderGameStage = () => {
    switch (gameStage) {
      case GameStage.TOPIC_SELECTION:
        return (
          <div className="space-y-6">
            <TopicSelection onTopicSelected={handleTopicSelected} />
            <div className="flex justify-center">
              <Button
                onClick={() => setGameStage(GameStage.FILE_UPLOAD)}
                className="mt-4"
                variant="outline"
              >
                Or Upload Document for AI Questions
              </Button>
            </div>
          </div>
        );

      case GameStage.FILE_UPLOAD:
        return (
          <FileUpload
            onUploadComplete={handleFileUploadComplete}
            onBack={() => setGameStage(GameStage.TOPIC_SELECTION)}
          />
        );

      case GameStage.FILE_PROCESSING:
        return (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <h3 className="text-xl font-medium">Processing Your Document</h3>
            <p className="text-muted-foreground text-center max-w-md">
              AI is analyzing {uploadedFile?.fileName} and generating{" "}
              {uploadedFile?.questionCount} questions...
            </p>
          </div>
        );

      case GameStage.QUIZ_CONFIGURATION:
        return (
          <QuizConfiguration
            onStartQuiz={handleStartQuiz}
            onBack={handleChangeTopics}
            selectedTopic={selectedTopic}
            selectedSubtopic={selectedSubtopic}
          />
        );

      case GameStage.QUESTION_DISPLAY:
        const currentQuestion = questions[currentQuestionIndex];
        return (
          <div className="space-y-6">
            <ScoreTracker
              currentScore={score}
              totalQuestions={questions.length}
              currentQuestionIndex={currentQuestionIndex}
            />
            <QuestionDisplay
              question={currentQuestion?.question || "Loading question..."}
              options={currentQuestion?.options || []}
              answerFormat={quizConfig.answerFormat}
              currentQuestionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              timeLimit={quizConfig.timeLimit}
              onSubmit={handleAnswerSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        );

      case GameStage.FEEDBACK_DISPLAY:
        const feedbackQuestion = questions[currentQuestionIndex];
        return (
          <div className="space-y-6">
            <ScoreTracker
              currentScore={score}
              totalQuestions={questions.length}
              currentQuestionIndex={currentQuestionIndex}
            />
            <FeedbackDisplay
              isCorrect={isAnswerCorrect}
              explanation={feedbackQuestion?.explanation || ""}
              visible={true}
            />
            <div className="flex justify-center">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={handleContinue}
              >
                {currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : "See Results"}
              </button>
            </div>
          </div>
        );

      case GameStage.RESULTS_SCREEN:
        return (
          <ResultsScreen
            score={score * 100}
            totalQuestions={questions.length}
            correctAnswers={score}
            topic={
              uploadedFile
                ? `Document: ${uploadedFile.fileName}`
                : selectedTopic
            }
            subtopic={uploadedFile ? uploadedFile.fileType : selectedSubtopic}
            onPlayAgain={handlePlayAgain}
            onChangeTopics={handleChangeTopics}
          />
        );

      default:
        return <TopicSelection onTopicSelected={handleTopicSelected} />;
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto p-4 bg-white ${className}`}>
      {renderGameStage()}
    </div>
  );
};

export default GameContainer;
