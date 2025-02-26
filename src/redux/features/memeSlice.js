import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  const likes = JSON.parse(localStorage.getItem('memeLikes')) || {};
  const comments = JSON.parse(localStorage.getItem('memeComments')) || {};
  const memes = JSON.parse(localStorage.getItem('memes')) || [];
  return {
    likes,
    comments,
    memes,
    currentMeme: null
  };
};

const memeSlice = createSlice({
  name: 'meme',
  initialState: getInitialState(),
  reducers: {
    toggleLike: (state, action) => {
      const memeId = action.payload;
      state.likes[memeId] = !state.likes[memeId];
      localStorage.setItem('memeLikes', JSON.stringify(state.likes));
    },
    addComment: (state, action) => {
      const { memeId, comment } = action.payload;
      if (!state.comments[memeId]) {
        state.comments[memeId] = [];
      }
      state.comments[memeId].push({
        id: Date.now(),
        text: comment,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('memeComments', JSON.stringify(state.comments));
    },
    deleteComment: (state, action) => {
      const { memeId, commentId } = action.payload;
      state.comments[memeId] = state.comments[memeId].filter(
        comment => comment.id !== commentId
      );
      localStorage.setItem('memeComments', JSON.stringify(state.comments));
    },
    setMemes: (state, action) => {
      state.memes = action.payload;
      localStorage.setItem('memes', JSON.stringify(action.payload));
    },
    setCurrentMeme: (state, action) => {
      state.currentMeme = action.payload;
    }
  }
});

export const { toggleLike, addComment, deleteComment, setMemes, setCurrentMeme } = memeSlice.actions;
export default memeSlice.reducer;
