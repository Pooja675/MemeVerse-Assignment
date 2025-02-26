import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const [randomMeme, setRandomMeme] = useState(null);

  // Collection of funny 404-related meme images and texts
  const memes = [
    {
      url: 'https://i.kym-cdn.com/photos/images/newsfeed/000/290/992/0aa.jpg',
      text: "404: Page not found... But I found this cute cat!",
      alt: "I can has page?"
    },
    {
      url: 'https://i.kym-cdn.com/photos/images/original/000/115/642/non-found.jpg',
      text: "Looks like this page pulled a disappearing act!",
      alt: "Page not found meme"
    },
    {
      url: 'https://i.kym-cdn.com/photos/images/newsfeed/000/234/765/b7e.jpg',
      text: "This is not the page you're looking for...",
      alt: "Obi-Wan 404"
    }
  ];

  useEffect(() => {
    // Pick a random meme on component mount
    const randomIndex = Math.floor(Math.random() * memes.length);
    setRandomMeme(memes[randomIndex]);
  }, []);

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    initial: { scale: 0.8, rotate: -5 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 0.9 },
    animate: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        yoyo: Infinity
      }
    }
  };

  if (!randomMeme) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center px-4">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="max-w-2xl w-full text-center"
      >
        <h1 className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
          404
        </h1>
        <motion.div
          className="relative inline-block mb-8"
          variants={imageVariants}
          whileHover="hover"
        >
          <img
            src={randomMeme.url}
            alt={randomMeme.alt}
            className="rounded-lg shadow-xl max-w-full h-auto"
            style={{ maxHeight: '400px' }}
          />
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-6 py-2 rounded-full shadow-lg">
            <p className="text-gray-800 dark:text-gray-200 font-medium">
              {randomMeme.text}
            </p>
          </div>
        </motion.div>

        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 mt-12">
          Oops! Looks like you've wandered into the meme void.
          <br />
          Don't worry, we've got your back!
        </p>

        <motion.div
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-lg transition-colors duration-200"
          >
            Back to Meme Paradise
          </Link>
        </motion.div>

        <div className="mt-8 text-gray-500 dark:text-gray-400">
          <p>Pro tip: Try refreshing for another random meme! 😉</p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
