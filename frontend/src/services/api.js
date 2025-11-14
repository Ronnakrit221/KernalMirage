import axios from "axios";

// ฟังก์ชันสำหรับอัปโหลดไฟล์เสียงไปยัง AI Model API
export const predictConcreteSound = async (file) => {
  const formData = new FormData();
  formData.append("file", file); // field name ต้องเป็น "file" ตาม API

  const response = await axios.post(
    "http://185.84.161.239:8000/predict",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data; // ได้ object ที่มี label และ probability
};
