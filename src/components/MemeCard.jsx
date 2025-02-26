import React, { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MemeCard = ({ meme }) => {
  const navigate = useNavigate();
  
  // Initialize like state from localStorage
  const [isLiked, setIsLiked] = useState(() => {
    const likedMemes = JSON.parse(localStorage.getItem('likedMemesState') || '{}');
    return likedMemes[meme.id] || false;
  });

  const [likeCount, setLikeCount] = useState(() => {
    const memeLikes = JSON.parse(localStorage.getItem('memeLikes') || '{}');
    return memeLikes[meme.id] || meme.likes || 0;
  });

  const handleLike = (e) => {
    e.stopPropagation();
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount(prev => {
      const newCount = newIsLiked ? prev + 1 : prev - 1;
      // Update likes count in localStorage
      const memeLikes = JSON.parse(localStorage.getItem('memeLikes') || '{}');
      memeLikes[meme.id] = newCount;
      localStorage.setItem('memeLikes', JSON.stringify(memeLikes));
      return newCount;
    });

    // Update liked state in localStorage
    const likedMemes = JSON.parse(localStorage.getItem('likedMemesState') || '{}');
    likedMemes[meme.id] = newIsLiked;
    localStorage.setItem('likedMemesState', JSON.stringify(likedMemes));

    // Update liked memes list for profile
    const likedMemesList = JSON.parse(localStorage.getItem('likedMemes') || '[]');
    if (newIsLiked) {
      if (!likedMemesList.some(m => m.id === meme.id)) {
        likedMemesList.push({
          ...meme,
          likes: likeCount + 1
        });
      }
    } else {
      const index = likedMemesList.findIndex(m => m.id === meme.id);
      if (index !== -1) {
        likedMemesList.splice(index, 1);
      }
    }
    localStorage.setItem('likedMemes', JSON.stringify(likedMemesList));
  };

  const handleMemeClick = () => {
    navigate(`/meme/${meme.id}`, { 
      state: { 
        meme: { 
          ...meme, 
          likes: likeCount, 
          isLiked 
        } 
      } 
    });
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-shadow duration-300 h-full flex flex-col cursor-pointer hover:shadow-xl"
      onClick={handleMemeClick}
    >
      <div className="relative w-full pt-[75%] overflow-hidden">
        <img
          src={meme.url}
          alt={meme.title}
          className="absolute top-0 left-0 w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2 flex-grow">
          {meme.title}
        </h3>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {meme.category}
          </span>
          <motion.button
            className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
            onClick={handleLike}
            whileTap={{ scale: 0.9 }}
          >
            {isLiked ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
            <motion.span
              key={likeCount}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {likeCount}
            </motion.span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default MemeCard;
