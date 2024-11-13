import { toast } from 'react-toastify';
import { useState } from 'react'; // Ensure correct import
import Fotter from './fotter';

const StarRating = ({ totalStars = 5, onRatingSelect }) => {
  const [hoveredRating, setHoveredRating] = useState(0);  // Track hovered star
  const [selectedRating, setSelectedRating] = useState(0);  // Track selected star

  const handleMouseEnter = (index) => setHoveredRating(index);  // On hover
  const handleMouseLeave = () => setHoveredRating(0);  // On mouse leave

  const handleClick = (index) => {
    setSelectedRating(index);  // Set the selected rating
    console.log(`Selected Rating: ${index}`);  // Log to console
    if (onRatingSelect) onRatingSelect(index);  // Call external function if provided

    // Show a toast notification
    toast.success(`You rated: ${index} / ${totalStars}`, {
      position: "top-center",  // Updated to a string instead of accessing the property
      autoClose: 2000,  // Auto close after 2 seconds
    });
  };

  return (
    <div>
      <div className="flex space-x-2">
        {Array.from({ length: totalStars }, (_, index) => {
          const starValue = index + 1;
          return (
            <span
              key={starValue}
              className={`text-4xl transition-colors duration-200 cursor-pointer ${
                starValue <= (hoveredRating || selectedRating)
                  ? 'text-yellow-400'
                  : 'text-gray-400'
              }`}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(starValue)}
            >
              ★
            </span>
          );
        })}
      </div>
      
      {/* Conditionally render Footer if rating is 3 or below */}
      {selectedRating <= 3 && selectedRating !== 0 ? <Fotter /> : null}
    </div>
  );
};

export default StarRating;
