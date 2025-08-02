import React, { useCallback, useMemo } from 'react';
import { useStore } from '../state/useStore';

const AI_PHRASES = [
  "Moreover",
  "However",
  "It's important to note",
  "As you can see",
  "Furthermore",
  "Nevertheless",
  "In conclusion",
  "To summarize",
  "In other words",
  "That being said",
  "On the other hand",
  "In fact",
  "Indeed",
  "Certainly",
  "Undoubtedly"
];

export function Editor() {
  const { text, setText } = useStore();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, [setText]);

  const highlightedText = useMemo(() => {
    if (!text) return '';
    
    let highlighted = text;
    AI_PHRASES.forEach(phrase => {
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<mark class="bg-yellow-200 dark:bg-yellow-600">$&</mark>`);
    });
    
    return highlighted;
  }, [text]);

  const aiPhraseCount = useMemo(() => {
    let count = 0;
    AI_PHRASES.forEach(phrase => {
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) count += matches.length;
    });
    return count;
  }, [text]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Thought Editor</h2>
        {aiPhraseCount > 0 && (
          <div className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
            {aiPhraseCount} AI phrase{aiPhraseCount !== 1 ? 's' : ''} detected
          </div>
        )}
      </div>
      
      <div className="flex-1 relative">
        {/* Preview layer for highlighting */}
        <div 
          className="absolute inset-0 p-4 text-gray-800 pointer-events-none whitespace-pre-wrap break-words font-mono text-sm leading-relaxed overflow-auto"
          dangerouslySetInnerHTML={{ __html: highlightedText }}
        />
        
        {/* Actual textarea */}
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Start writing your thoughts here... AI dependency phrases will be highlighted automatically."
          className="w-full h-full p-4 text-gray-800 bg-transparent resize-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-mono text-sm leading-relaxed"
          style={{ color: 'transparent', caretColor: '#374151' }}
        />
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <div className="flex justify-between">
          <span>{text.length} characters</span>
          <span>{text.split(/\s+/).filter(word => word.length > 0).length} words</span>
        </div>
      </div>
    </div>
  );
}