import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SCORE_LEVELS = [
  { min: 80, max: 100, color: "bg-green-400", label: "ปลอดภัย" },
  { min: 60, max: 79, color: "bg-lime-300", label: "ความเสี่ยงต่ำ" },
  { min: 40, max: 59, color: "bg-yellow-300", label: "ความเสี่ยงปานกลาง" },
  { min: 20, max: 39, color: "bg-orange-400", label: "ความเสี่ยงสูง" },
  { min: 0, max: 19, color: "bg-red-400", label: "ความเสี่ยงรุนแรง" }
];

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, filename } = location.state || {};

  if (!result) {
    navigate("/upload");
    return null;
  }

  // ดึงข้อมูลคะแนนและคำนวณเกณฑ์
  const label = result.label;
  const normalPercent = (result.probability.Normal * 100).toFixed(2);
  const activeIdx = SCORE_LEVELS.findIndex(
    ({ min, max }) => normalPercent >= min && normalPercent <= max
  );

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-900 to-pink-500 py-8">
      <div className="mt-10 mb-6 p-4 border-2 border-dashed border-yellow-400 rounded-lg text-white font-semibold text-xl w-[340px] mx-auto text-center">
        {filename}
      </div>

      {/* วงกลมสีแต่ละระดับ */}
      <div className="flex items-center justify-center space-x-10 mb-10 mt-5">
        {SCORE_LEVELS.map((level, idx) => (
          <div
            key={idx}
            className={`w-10 h-10 rounded-full flex items-center justify-center 
              ${level.color} 
              ${idx === activeIdx ? "ring-3 ring-green-500 scale-110" : "opacity-50"}
              transition`}
            title={level.label}
          ></div>
        ))}
      </div>

      {/* สรุปผล */}
      <div className="bg-white bg-opacity-90 rounded-xl p-7 w-[380px] text-center mb-8 shadow-md">
        <div className="text-xl font-bold text-black mb-2">คอนกรีตของคุณอยู่</div>
        <div className={`text-xl font-bold mb-3 ${label === "Normal" ? "text-green-500" : "text-red-500"}`}>
          {label === "Normal" ? "ในเกณฑ์ปลอดภัย" : "ในเกณฑ์มีความเสี่ยงสูง"}
        </div>
        <div className="text-2xl font-bold text-black mb-4">
          คะแนนอยู่ที่ {normalPercent} / 100
        </div>
        <div className="text-xs text-gray-600">
          *หมายเหตุ: นี้เป็นเพียงการประเมินเบื้องต้นเท่านั้น โปรดติดต่อผู้รับเหมา หรือวิศวกรเพื่อประเมินอย่างละเอียดอีกครั้ง
        </div>
      </div>
      {/* feedback พร้อมสีตามระดับ */}
      <div className={`w-[400px] py-4 mb-8 text-xl ${
        activeIdx === 0
          ? "bg-green-400"
          : activeIdx === 1
          ? "bg-lime-300"
          : activeIdx === 2
          ? "bg-yellow-300"
          : activeIdx === 3
          ? "bg-orange-400"
          : "bg-red-400"
      } text-black rounded-lg font-bold shadow text-center`}>
        เสียงที่คุณได้ส่งมาวิเคราะห์มี{SCORE_LEVELS[activeIdx].label}
      </div>
      <div className="flex space-x-6">
        <button
          className="px-6 py-3 bg-black text-white rounded-lg text-lg font-medium hover:bg-gray-800 transition"
          onClick={() => navigate("/")}
        >
          Back to home page
        </button>
        <button
          className="px-6 py-3 bg-purple-900 text-white rounded-lg text-lg font-medium hover:bg-purple-700 transition"
          onClick={() => alert("Show Sound Wave Graph")}
        >
          Sound Wave Graph
        </button>
      </div>
    </div>
  );
};

export default Result;
