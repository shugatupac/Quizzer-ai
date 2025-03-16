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
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { FileText, Upload, FileUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

interface FileUploadProps {
  onUploadComplete: (data: {
    fileName: string;
    questionCount: number;
    fileType: string;
  }) => void;
  onBack: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete = () => {},
  onBack = () => {},
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file type
    const fileType = selectedFile.type;
    const validTypes = [
      "application/pdf",
      "application/epub+zip",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!validTypes.includes(fileType)) {
      setError(
        "Invalid file type. Please upload a PDF, EPUB, or Word document.",
      );
      return;
    }

    setFile(selectedFile);
    setError("");
  };

  const handleQuestionCountChange = (value: number[]) => {
    setQuestionCount(value[0]);
  };

  const handleUpload = () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);

    // Simulate file upload and processing
    setTimeout(() => {
      setIsUploading(false);

      // Get file extension
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
      let fileType = "document";

      if (fileExtension === "pdf") fileType = "pdf";
      else if (fileExtension === "epub") fileType = "epub";
      else if (["doc", "docx"].includes(fileExtension)) fileType = "word";

      onUploadComplete({
        fileName: file.name,
        questionCount,
        fileType,
      });
    }, 2000);
  };

  const getFileIcon = () => {
    if (!file) return <Upload className="h-12 w-12 text-muted-foreground" />;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    return <FileText className="h-12 w-12 text-blue-500" />;
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
            Upload Learning Material
          </CardTitle>
          <CardDescription className="text-center">
            Upload a PDF, EPUB, or Word document to generate AI questions
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
            <div className="flex flex-col items-center justify-center space-y-4">
              {getFileIcon()}
              <div className="text-center">
                <p className="text-sm font-medium">
                  {file ? file.name : "Drag & drop your file here"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {file
                    ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                    : "PDF, EPUB, or Word document up to 50MB"}
                </p>
              </div>
              <Label
                htmlFor="file-upload"
                className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <FileUp className="h-4 w-4" />
                Browse Files
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.epub,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="question-count">
                  Number of Questions to Generate
                </Label>
                <span className="text-sm font-medium">{questionCount}</span>
              </div>
              <Slider
                id="question-count"
                min={1}
                max={20}
                step={1}
                value={[questionCount]}
                onValueChange={handleQuestionCountChange}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
          <Button variant="outline" onClick={onBack}>
            Back to Topics
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? "Processing..." : "Generate Questions"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default FileUpload;
