import React, { useState, useEffect } from 'react';
import MemeCard from '../components/MemeCard';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [trendingMemes, setTrendingMemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingMemes();
  }, []);

  const fetchTrendingMemes = async () => {
    try {
      const response = await fetch('https://api.imgflip.com/get_memes');
      const data = await response.json();
      const formattedMemes = data.data.memes.slice(0, 12).map(meme => ({
        id: meme.id,
        title: meme.name || 'Cool Meme',
        url: meme.url,
        category: 'Trending',
        likes: Math.floor(Math.random() * 1000)
      }));
      setTrendingMemes(formattedMemes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching memes:', error);
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2 
          className="text-4xl font-bold text-gray-900 dark:text-white mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Trending Memes
        </motion.h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div 
              className="h-16 w-16 border-4 border-indigo-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {trendingMemes.map(meme => (
              <motion.div
                key={meme.id}
                variants={cardVariants}
                whileHover="hover"
                className="transform transition-all duration-300 hover:shadow-xl"
              >
                <MemeCard meme={meme} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default HomePage;
