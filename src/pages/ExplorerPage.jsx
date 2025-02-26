import React, { useState, useEffect, useCallback, useRef } from 'react';
import MemeCard from '../components/MemeCard';
import { motion } from 'framer-motion';
import debounce from 'lodash/debounce';

const ITEMS_PER_PAGE = 12;
const categories = ['All', 'Trending', 'New', 'Classic', 'Random'];
const sortOptions = [
  { value: 'likes', label: 'Most Liked' },
  { value: 'date', label: 'Latest' },
  { value: 'comments', label: 'Most Comments' }
];

const ExplorerPage = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('likes');
  const [searchQuery, setSearchQuery] = useState('');
  const [allMemes, setAllMemes] = useState([]);
  const observer = useRef();

  // Fetch all memes initially
  useEffect(() => {
    fetchAllMemes();
  }, []);

  const fetchAllMemes = async () => {
    try {
      const response = await fetch('https://api.imgflip.com/get_memes');
      const data = await response.json();
      const formattedMemes = data.data.memes.map(meme => ({
        id: meme.id,
        title: meme.name,
        url: meme.url,
        category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        date: new Date(Date.now() - Math.random() * 10000000000).toISOString()
      }));
      setAllMemes(formattedMemes);
      processAndSetMemes(formattedMemes);
    } catch (error) {
      console.error('Error fetching memes:', error);
      setLoading(false);
    }
  };

  const processAndSetMemes = useCallback((memesToProcess) => {
    let filteredMemes = [...memesToProcess];

    // Apply category filter
    if (selectedCategory !== 'All') {
      filteredMemes = filteredMemes.filter(meme => meme.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      filteredMemes = filteredMemes.filter(meme =>
        meme.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filteredMemes.sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.likes - a.likes;
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'comments':
          return b.comments - a.comments;
        default:
          return 0;
      }
    });

    // Apply pagination
    const paginatedMemes = filteredMemes.slice(0, page * ITEMS_PER_PAGE);
    setMemes(paginatedMemes);
    setLoading(false);
  }, [selectedCategory, sortBy, searchQuery, page]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      setPage(1);
    }, 500),
    []
  );

  // Effect to process memes when filters change
  useEffect(() => {
    processAndSetMemes(allMemes);
  }, [selectedCategory, sortBy, searchQuery, page, processAndSetMemes]);

  // Infinite scroll setup
  const lastMemeElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search memes..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-none focus:ring-2 focus:ring-indigo-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Meme Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {memes.map((meme, index) => (
            <div
              key={`${meme.id}-${index}`}
              ref={index === memes.length - 1 ? lastMemeElementRef : null}
            >
              <MemeCard meme={meme} />
            </div>
          ))}
        </motion.div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center h-32">
            <motion.div
              className="h-16 w-16 border-4 border-indigo-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorerPage;
