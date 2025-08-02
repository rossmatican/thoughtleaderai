import React from 'react';
import { Editor } from './editor/Editor';
import { DependencyMeter } from './meter/DependencyMeter';
import { SocraticModal } from './modal/SocraticModal';
import { useAnalysis } from './hooks/useAnalysis';

function App() {
  // Initialize analysis hook
  useAnalysis();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thought Leader AI – Dependency Monitor
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Write authentically. This tool analyzes your text in real-time to detect 
            AI-dependency patterns and helps you develop your own unique voice.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Editor - takes up 2/3 on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 h-96 lg:h-[500px]">
              <Editor />
            </div>
          </div>

          {/* Dependency Meter - takes up 1/3 on large screens */}
          <div className="lg:col-span-1">
            <DependencyMeter />
          </div>
        </div>

        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>Analysis runs every 30 seconds. Interventions appear when dependency score > 70%</p>
        </footer>
      </div>

      {/* Modal */}
      <SocraticModal />
    </div>
  );
}

export default App;