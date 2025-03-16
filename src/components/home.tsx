import React from "react";
import GameContainer from "./quiz/GameContainer";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 mb-3">
            AI-Powered Educational Quiz Game
          </h1>
          <p className="text-xl text-blue-700 max-w-2xl mx-auto">
            Test your knowledge across various academic topics with questions
            generated and evaluated by Gemini AI.
          </p>
        </header>

        <main>
          <GameContainer className="rounded-xl shadow-2xl overflow-hidden" />
        </main>

        <footer className="mt-16 text-center text-sm text-blue-600">
          <p>© 2023 AI Educational Quiz Game. All rights reserved.</p>
          <p className="mt-1">Powered by Gemini AI</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
