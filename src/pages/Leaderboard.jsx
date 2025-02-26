import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrophyIcon, FireIcon, UserCircleIcon } from '@heroicons/react/24/solid';

const Leaderboard = () => {
  const [topMemes, setTopMemes] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user from localStorage
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    setCurrentUser(userProfile);

    // Get all memes and their likes from localStorage
    const memeLikes = JSON.parse(localStorage.getItem('memeLikes') || '{}');
    const likedMemes = JSON.parse(localStorage.getItem('likedMemes') || '[]');
    const likedMemesState = JSON.parse(localStorage.getItem('likedMemesState') || '{}');

    // Combine meme data with likes
    const allMemes = likedMemes.map(meme => ({
      ...meme,
      likes: memeLikes[meme.id] || meme.likes || 0
    }));

    // Sort memes by likes and get top 10
    const sortedMemes = allMemes.sort((a, b) => b.likes - a.likes).slice(0, 10);
    setTopMemes(sortedMemes);

    // Calculate user engagement (based on likes received)
    const userEngagement = {};
    Object.keys(likedMemesState).forEach(memeId => {
      const meme = allMemes.find(m => m.id === memeId);
      if (meme) {
        const userName = meme.userName || userProfile.name || 'Anonymous';
        userEngagement[userName] = (userEngagement[userName] || 0) + 1;
      }
    });

    // Add current user if not present
    if (userProfile.name && !userEngagement[userProfile.name]) {
      userEngagement[userProfile.name] = 0;
    }

    // Convert to array and sort by engagement
    const sortedUsers = Object.entries(userEngagement)
      .map(([name, likes]) => ({ 
        name, 
        likes,
        isCurrentUser: name === userProfile.name
      }))
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 10);

    setTopUsers(sortedUsers);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            MemeVerse Leaderboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Top memes and most active users
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Memes Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center mb-6">
              <TrophyIcon className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Top 10 Memes
              </h2>
            </div>
            <div className="space-y-4">
              {topMemes.map((meme, index) => (
                <motion.div
                  key={meme.id}
                  variants={itemVariants}
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="text-2xl font-bold text-gray-500 dark:text-gray-400 w-8">
                    {index + 1}
                  </span>
                  <img
                    src={meme.url}
                    alt={meme.title}
                    className="w-16 h-16 object-cover rounded-md mx-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {meme.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      by {meme.userName || 'Anonymous'}
                    </p>
                    <div className="flex items-center mt-1">
                      <FireIcon className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {meme.likes} likes
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {topMemes.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No memes found. Start liking some memes!
                </div>
              )}
            </div>
          </motion.div>

          {/* Top Users Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center mb-6">
              <UserCircleIcon className="h-6 w-6 text-indigo-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Most Active Users
              </h2>
            </div>
            <div className="space-y-4">
              {topUsers.map((user, index) => (
                <motion.div
                  key={user.name}
                  variants={itemVariants}
                  className={`flex items-center p-4 ${
                    user.isCurrentUser
                      ? 'bg-indigo-50 dark:bg-indigo-900'
                      : 'bg-gray-50 dark:bg-gray-700'
                  } rounded-lg`}
                >
                  <span className="text-2xl font-bold text-gray-500 dark:text-gray-400 w-8">
                    {index + 1}
                  </span>
                  <div className="flex-1 ml-4">
                    <h3 className={`font-medium ${
                      user.isCurrentUser
                        ? 'text-indigo-600 dark:text-indigo-300'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {user.name} {user.isCurrentUser && '(You)'}
                    </h3>
                    <div className="flex items-center mt-1">
                      <FireIcon className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {user.likes} engagements
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {topUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No user activity yet. Be the first to engage!
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
