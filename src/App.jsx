import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ExplorerPage from "./pages/ExplorerPage";
import UploadPage from "./pages/UploadPage";
import MemeDetails from "./pages/MemeDetails";
import UserProfile from "./pages/UserProfile";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-100">
          <Router>
            <Navbar />
            <div className="pt-16 text-gray-900 dark:text-gray-100">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorerPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/meme/:id" element={<MemeDetails />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
