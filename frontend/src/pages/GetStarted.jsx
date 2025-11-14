import React from "react";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-900 to-pink-500">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-light text-white mb-3">Welcome to</h1>
        <h2 className="text-5xl font-bold text-white mb-6">ConSound !</h2>
        <p className="text-lg text-white">
          เว็บแอปพลิเคชันตรวจสอบคุณภาพคอนกรีต
          <br />
          จากคลื่นเสียงสะท้อนเบื้องต้น
        </p>
      </div>
      <button
        className="px-6 py-2 bg-black text-white rounded-md mt-8 text-lg hover:bg-gray-800 transition"
        onClick={() => navigate("/upload")}
      >
        Let’s get started
      </button>
    </div>
  );
};

export default GetStarted;
