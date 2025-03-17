// OpenAI API client

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function generateQuestionsWithOpenAI(
  content: string,
  questionCount: number,
): Promise<any[]> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    console.error("OpenAI API key is not set");
    return [];
  }

  try {
    const prompt = `Generate ${questionCount} multiple-choice questions based on the following content. For each question, provide 4 options and indicate the correct answer. Format the response as a JSON array of objects, where each object has the properties: question, options (array of 4 strings), correctAnswer (one of the options), and explanation. Content: ${content.substring(0, 4000)}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an educational assistant that creates high-quality multiple-choice questions based on provided content.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = (await response.json()) as OpenAIResponse;

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return [];
    }

    const content = data.choices[0]?.message?.content;
    if (!content) return [];

    try {
      // Parse the JSON response
      const questions = JSON.parse(content);
      return Array.isArray(questions) ? questions : [];
    } catch (error) {
      console.error("Failed to parse OpenAI response:", error);
      return [];
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return [];
  }
}
