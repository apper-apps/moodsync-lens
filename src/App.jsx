import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Board from "@/components/pages/Board";
import Home from "@/components/pages/Home";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board/:boardId" element={<Board />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="toast-container"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;