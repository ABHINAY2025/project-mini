import React, { useState } from 'react';

export default function Footer() {
  const [showToast, setShowToast] = useState(false);
  const [translation, setTranslation] = useState('');
  const [isVisible, setIsVisible] = useState(true); // State to manage visibility

  const handleSubmit = () => {
    // Clear the textarea
    setTranslation('');
    setShowToast(true);
    setIsVisible(false); // Hide the box
    setTimeout(() => {
      setShowToast(false);
    }, 2000); // Hide toast after 2 seconds
  };

  if (!isVisible) return null; // Return null if the box should be hidden

  return (
    <div className='border-t-2 border-black p-2 mt-4 w-full h-[50vh]'>
      <div>
        <h1 className="text-3xl mb-4 mt-4">Enter Correct Translation</h1>
        <textarea
          className="w-full h-56 border border-gray-300 rounded-lg p-4"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
        />
        <button 
          onClick={handleSubmit} 
          className="mt-4 bg-blue-500 text-white rounded-lg px-4 py-2"
        >
          Submit
        </button>
      </div>
      {showToast && (
        <div className="mt-4 p-2 bg-green-500 text-white rounded-lg">
          Thank you!
        </div>
      )}
    </div>
  );
}