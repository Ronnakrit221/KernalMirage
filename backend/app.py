from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib, tempfile, os, numpy as np
from audio_utils import compute_esd_bands, LABEL_MAP
import traceback
from pathlib import Path

MODEL_DIR = os.getenv("MODEL_DIR", "model")
CLF_PATH = os.path.join(MODEL_DIR, "esd_svm_linear.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "esd_scaler.pkl")

if not (os.path.exists(CLF_PATH) and os.path.exists(SCALER_PATH)):
    raise RuntimeError("Model files not found in ./model")

clf = joblib.load(CLF_PATH)
scaler = joblib.load(SCALER_PATH)

app = FastAPI(
    title="Concrete Hammering Sound API",
    description="API สำหรับวิเคราะห์เสียงเคาะคอนกรีตด้วย AI (SVM + ESD)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

ALLOWED_TYPES = {
    "audio/wav", "audio/x-wav",
    "audio/mpeg", "audio/mp3",
    "audio/x-m4a", "audio/aac",
    "audio/flac", "audio/ogg", "audio/x-ogg"
}

CONTENT_TYPE_TO_EXT = {
    "audio/wav": ".wav",
    "audio/x-wav": ".wav",
    "audio/mpeg": ".mp3",
    "audio/mp3": ".mp3",
    "audio/x-m4a": ".m4a",
    "audio/aac": ".aac",
    "audio/flac": ".flac",
    "audio/ogg": ".ogg",
    "audio/x-ogg": ".ogg",
}

def guess_extension(file: UploadFile) -> str:

    if file.filename:
        ext = Path(file.filename).suffix
        if ext:
            return ext.lower()
    return CONTENT_TYPE_TO_EXT.get(file.content_type, ".wav")


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail=f"Unsupported Content-Type: {file.content_type}")

    tmp_path = None
    try:
        suffix = guess_extension(file)

        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            data = await file.read()
            if not data:
                raise HTTPException(status_code=400, detail="Empty file")

            tmp.write(data)
            tmp.flush()
            tmp_path = tmp.name

        esd_vec, sr = compute_esd_bands(tmp_path, n_bands=22, max_freq=22000, to_mono=True)

        if not np.isfinite(esd_vec).all():
            raise HTTPException(status_code=400, detail="Invalid audio features")

        X_scaled = scaler.transform(esd_vec.reshape(1, -1))
        y_pred = int(clf.predict(X_scaled)[0])
        y_proba = clf.predict_proba(X_scaled)[0]

        prob = {"Abnormal": float(y_proba[1]), "Normal": float(y_proba[0])}

        return {
            "sample_rate": int(sr),
            "prediction": y_pred,
            "label": LABEL_MAP.get(y_pred, str(y_pred)),
            "probability": prob
        }

    except HTTPException:
        raise
    except Exception as e:
        print("===== PREDICT ERROR =====")
        traceback.print_exc()
        print("===== END ERROR =====")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {type(e).__name__}")
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass


@app.get("/")
def root():
    return {"message": "Concrete Hammering Sound API is running"}
