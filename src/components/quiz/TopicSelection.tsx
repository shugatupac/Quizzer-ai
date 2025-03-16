import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface SubTopic {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  name: string;
  subtopics: SubTopic[];
}

interface TopicSelectionProps {
  onTopicSelected: (topicId: string, subtopicId: string) => void;
  topics?: Topic[];
}

const TopicSelection = ({
  onTopicSelected = () => {},
  topics = [
    {
      id: "science",
      name: "Science",
      subtopics: [
        { id: "physics", name: "Physics" },
        { id: "chemistry", name: "Chemistry" },
        { id: "biology", name: "Biology" },
        { id: "astronomy", name: "Astronomy" },
        { id: "geology", name: "Geology" },
        { id: "ecology", name: "Ecology" },
      ],
    },
    {
      id: "math",
      name: "Math",
      subtopics: [
        { id: "algebra", name: "Algebra" },
        { id: "geometry", name: "Geometry" },
        { id: "calculus", name: "Calculus" },
        { id: "statistics", name: "Statistics" },
        { id: "trigonometry", name: "Trigonometry" },
        { id: "number-theory", name: "Number Theory" },
      ],
    },
    {
      id: "agriculture",
      name: "Agriculture",
      subtopics: [
        { id: "crop-science", name: "Crop Science" },
        { id: "soil-science", name: "Soil Science" },
        { id: "livestock", name: "Livestock Management" },
        { id: "sustainable-farming", name: "Sustainable Farming" },
        { id: "agricultural-economics", name: "Agricultural Economics" },
        { id: "irrigation-systems", name: "Irrigation Systems" },
      ],
    },
    {
      id: "psychology",
      name: "Psychology",
      subtopics: [
        { id: "clinical", name: "Clinical Psychology" },
        { id: "cognitive", name: "Cognitive Psychology" },
        { id: "developmental", name: "Developmental Psychology" },
        { id: "social", name: "Social Psychology" },
        { id: "behavioral", name: "Behavioral Psychology" },
        { id: "neuropsychology", name: "Neuropsychology" },
      ],
    },
    {
      id: "history",
      name: "History",
      subtopics: [
        { id: "ancient", name: "Ancient History" },
        { id: "medieval", name: "Medieval History" },
        { id: "modern", name: "Modern History" },
        { id: "world-wars", name: "World Wars" },
        { id: "cultural", name: "Cultural History" },
        { id: "economic", name: "Economic History" },
      ],
    },
    {
      id: "literature",
      name: "Literature",
      subtopics: [
        { id: "classics", name: "Classical Literature" },
        { id: "poetry", name: "Poetry" },
        { id: "drama", name: "Drama & Plays" },
        { id: "novels", name: "Novels & Fiction" },
        { id: "literary-theory", name: "Literary Theory" },
        { id: "world-literature", name: "World Literature" },
      ],
    },
    {
      id: "technology",
      name: "Technology",
      subtopics: [
        { id: "programming", name: "Programming" },
        { id: "artificial-intelligence", name: "Artificial Intelligence" },
        { id: "cybersecurity", name: "Cybersecurity" },
        { id: "blockchain", name: "Blockchain" },
        { id: "robotics", name: "Robotics" },
        { id: "web-development", name: "Web Development" },
      ],
    },
    {
      id: "geography",
      name: "Geography",
      subtopics: [
        { id: "physical", name: "Physical Geography" },
        { id: "human", name: "Human Geography" },
        { id: "cartography", name: "Cartography" },
        { id: "climate", name: "Climate & Weather" },
        { id: "geopolitics", name: "Geopolitics" },
        { id: "urban-geography", name: "Urban Geography" },
      ],
    },
  ],
}: TopicSelectionProps) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);

  const handleSubtopicSelect = (topicId: string, subtopicId: string) => {
    setSelectedTopic(topicId);
    setSelectedSubtopic(subtopicId);
  };

  const handleContinue = () => {
    if (selectedTopic && selectedSubtopic) {
      onTopicSelected(selectedTopic, selectedSubtopic);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center">
            Choose a Topic
          </CardTitle>
          <CardDescription className="text-center">
            Select a main topic and subtopic to begin your quiz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {topics.map((topic) => (
              <AccordionItem key={topic.id} value={topic.id}>
                <AccordionTrigger className="text-lg font-medium">
                  {topic.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                    {topic.subtopics.map((subtopic) => (
                      <motion.div
                        key={subtopic.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 rounded-md border cursor-pointer transition-all ${
                          selectedTopic === topic.id &&
                          selectedSubtopic === subtopic.id
                            ? "border-primary bg-primary/10"
                            : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                        }`}
                        onClick={() =>
                          handleSubtopicSelect(topic.id, subtopic.id)
                        }
                      >
                        <div className="flex items-center justify-between">
                          <span>{subtopic.name}</span>
                          {selectedTopic === topic.id &&
                            selectedSubtopic === subtopic.id && (
                              <Check className="h-5 w-5 text-primary" />
                            )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleContinue}
              disabled={!selectedTopic || !selectedSubtopic}
              className="px-6"
            >
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TopicSelection;
