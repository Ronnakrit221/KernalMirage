import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { predictConcreteSound } from "../services/api";

const UploadAudio = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setErrMsg("");
    try {
      const result = await predictConcreteSound(selectedFile);
      navigate("/result", { state: { result, filename: selectedFile.name } });
    } catch (error) {
      setErrMsg("เกิดข้อผิดพลาดในการอัปโหลดหรือประมวลผล");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-900 to-pink-500 relative">
      {/* ปุ่มย้อนกลับ */}
      <div className="absolute top-8 left-10">
        <button
          className="text-white text-3xl"
          onClick={() => navigate("/")}
        >
          &lt;
        </button>
      </div>
      {/* โลโก้และหัวข้อ */}
      <div className="text-center mb-8 mt-4">
        <div className="flex items-center justify-center mb-3">
          {/* ไอคอนหูฟังตัวอย่าง */}
          <span className="mr-2">
            <p className="text-4xl">🎧</p>
          </span>
          <h2 className="text-4xl font-bold text-white">ConSound</h2>
        </div>
        <p className="text-lg text-white mb-8">
          Upload or record the sound for AI<br />
          to analyze their strength.
        </p>
      </div>
      {/* เลือกไฟล์ */}
      <div className="p-4 border-2 border-dashed border-yellow-400 rounded-lg mb-8 bg-transparent flex items-center w-96 justify-between">
        <label className="cursor-pointer px-4 py-2 bg-white rounded font-semibold text-gray-900">
          Choose file
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={e => setSelectedFile(e.target.files[0])}
          />
        </label>
        <span className="text-white font-medium text-base ml-4 truncate w-40">
          {selectedFile ? selectedFile.name : "No file chosen"}
        </span>
      </div>
      {/* ปุ่มอัปโหลด */}
      <button
        className="w-80 py-3 bg-yellow-400 text-lg font-medium rounded mb-6 hover:bg-yellow-500 transition"
        onClick={handleUpload}
        disabled={!selectedFile || loading}
      >
        {loading ? "Processing..." : "Upload"}
      </button>
      {/* OR */}
      <div className="text-white font-semibold mb-6 text-lg">OR</div>
      {/* ปุ่มเริ่มอัดเสียง */}
      <button
        className="w-80 py-3 bg-purple-900 text-white text-lg font-medium rounded hover:bg-purple-800 transition"
        onClick={() => alert("Voice recording feature coming soon")}
      >
        Start Record
      </button>
      {errMsg && <div className="text-red-500 mt-4">{errMsg}</div>}
    </div>
  );
};

export default UploadAudio;
