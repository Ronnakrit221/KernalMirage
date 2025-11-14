```bash
python -m venv .venv
.\.venv\Scripts\Activate
pip install -r requirements.txt
uvicorn app:app --reload
```

เปิดดูได้ที่  
- Swagger UI: http://127.0.0.1:8000/docs  

POST `/predict`  
ส่งไฟล์เสียง (.wav, .mp3, .m4a) ผ่าน `multipart/form-data` field ชื่อ `file`  
API จะส่งกลับ JSON เช่น:
```json
{
  "sample_rate": 44100,
  "prediction": 1,
  "label": "Normal",
  "probability": {
    "Abnormal": 0.12,
    "Normal": 0.88
  }
}
```
