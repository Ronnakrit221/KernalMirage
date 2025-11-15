import librosa
import numpy as np
import subprocess
import tempfile
import os
from pathlib import Path


def convert_to_wav_if_needed(path: str) -> tuple[str, bool]:

    ext = Path(path).suffix.lower()
    if ext in [".wav", ".wave"]:
        return path, False

    tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    tmp_path = tmp.name
    tmp.close()

    cmd = [
        "ffmpeg",
        "-y",           
        "-i", path,     
        "-ac", "1",     
        tmp_path
    ]

    try:
        subprocess.run(
            cmd,
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return tmp_path, True
    except Exception as e:
        if os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass
        raise RuntimeError(f"ffmpeg failed to convert {path} to wav: {e}")


def compute_esd_bands(wav_path, n_bands=22, max_freq=22000, to_mono=True):

    converted_path, delete_after = convert_to_wav_if_needed(wav_path)

    try:
        y, sr = librosa.load(converted_path, sr=None, mono=to_mono)
        if y is None or y.size == 0:
            raise ValueError("Empty audio")

        y = np.nan_to_num(
            y,
            nan=0.0,
            posinf=0.0,
            neginf=0.0
        ).astype(np.float32)

        S = np.abs(librosa.stft(y, n_fft=2048, hop_length=512)) ** 2
        freqs = librosa.fft_frequencies(sr=sr, n_fft=2048)

        bands = np.linspace(0, max_freq, n_bands + 1)
        esd = np.zeros(n_bands, dtype=np.float32)

        for i in range(n_bands):
            idx = np.logical_and(freqs >= bands[i], freqs < bands[i + 1])
            if np.any(idx):
                band_power = S[idx, :]
                if np.isfinite(band_power).any():
                    esd[i] = float(np.mean(band_power))
                else:
                    esd[i] = 0.0
            else:
                esd[i] = 0.0

        m = float(np.max(esd))
        if m > 0:
            esd = esd / m

        esd = np.nan_to_num(
            esd,
            nan=0.0,
            posinf=0.0,
            neginf=0.0
        ).astype(np.float32)

        return esd, sr

    finally:
        if delete_after and os.path.exists(converted_path):
            try:
                os.remove(converted_path)
            except Exception:
                pass


LABEL_MAP = {0: "Normal", 1: "Abnormal"}
