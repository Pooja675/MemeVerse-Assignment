import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaShare, FaTrash } from 'react-icons/fa';

const MemeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const meme = location.state?.meme;
  const [isLiked, setIsLiked] = useState(meme?.isLiked || false);
  const [likeCount, setLikeCount] = useState(meme?.likes || 0);
  const [comments, setComments] = useState(() => {
    const savedComments = localStorage.getItem(`comments-${id}`);
    return savedComments ? JSON.parse(savedComments) : [];
  });
  const [newComment, setNewComment] = useState('');

  if (!meme) {
    navigate('/');
    return null;
  }

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newComments = [...comments, {
        id: Date.now(),
        text: newComment,
        timestamp: new Date().toISOString()
      }];
      setComments(newComments);
      localStorage.setItem(`comments-${id}`, JSON.stringify(newComments));
      setNewComment('');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleDeleteComment = (commentId) => {
    const newComments = comments.filter(comment => comment.id !== commentId);
    setComments(newComments);
    localStorage.setItem(`comments-${id}`, JSON.stringify(newComments));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Meme Title */}
        <h1 className="text-2xl font-bold text-gray-900 p-4 border-b">
          {meme.title}
        </h1>

        {/* Meme Image */}
        <div className="relative">
          <img
            src={meme.url}
            alt={meme.title}
            className="w-full object-contain max-h-[600px]"
          />
        </div>

        {/* Stats Section */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLikeClick}
                className="text-2xl flex items-center space-x-2"
              >
                {isLiked ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-500 hover:text-red-500" />
                )}
                <span className="text-lg font-semibold">{likeCount}</span>
              </motion.button>
              <button
                onClick={handleShare}
                className="text-xl text-gray-500 hover:text-blue-500"
              >
                <FaShare />
              </button>
            </div>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {meme.category}
            </span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Comments</h3>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Post
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 p-4 rounded-lg flex justify-between items-start"
              >
                <div>
                  <p className="text-gray-800">{comment.text}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeDetails;
