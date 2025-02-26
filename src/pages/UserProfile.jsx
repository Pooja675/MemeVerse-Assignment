import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MemeCard from '../components/MemeCard';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const UserProfile = () => {
  // User state
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: 'MemeVerse User',
      bio: 'I love creating and sharing memes!',
      profilePicture: null
    };
  });

  // Liked memes state
  const [likedMemes, setLikedMemes] = useState(() => {
    const saved = localStorage.getItem('likedMemes');
    return saved ? JSON.parse(saved) : [];
  });

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  // Save profile changes
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setProfile(editForm);
    localStorage.setItem('userProfile', JSON.stringify(editForm));
    setIsEditing(false);
  };

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          {isEditing ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  {editForm.profilePicture ? (
                    <img
                      src={editForm.profilePicture}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-32 h-32 text-gray-400" />
                  )}
                  <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                {profile.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-32 h-32 text-gray-400" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{profile.bio}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Liked Memes Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Liked Memes
          </h2>

          {/* Memes Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {likedMemes.map((meme) => (
              <motion.div
                key={meme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MemeCard meme={meme} />
              </motion.div>
            ))}
            {likedMemes.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
                No liked memes yet. Start exploring and like some memes!
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
