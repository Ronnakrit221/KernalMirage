import librosa
import numpy as np

def compute_esd_bands(wav_path, n_bands=22, max_freq=22000, to_mono=True):
    y, sr = librosa.load(wav_path, sr=None, mono=to_mono)
    if y is None or y.size == 0:
        raise ValueError("Empty audio")

    y = np.nan_to_num(y, nan=0.0, posinf=0.0, neginf=0.0).astype(np.float32)

    S = np.abs(librosa.stft(y, n_fft=2048, hop_length=512)) ** 2
    freqs = librosa.fft_frequencies(sr=sr, n_fft=2048)

    bands = np.linspace(0, max_freq, n_bands + 1)
    esd = np.zeros(n_bands, dtype=np.float32)

    for i in range(n_bands):
        idx = np.logical_and(freqs >= bands[i], freqs < bands[i + 1])
        if np.any(idx):
            esd[i] = float(np.mean(S[idx, :])) if np.isfinite(S[idx, :]).any() else 0.0
        else:
            esd[i] = 0.0

    m = float(np.max(esd))
    if m > 0:
        esd = esd / m
    esd = np.nan_to_num(esd, nan=0.0, posinf=0.0, neginf=0.0).astype(np.float32)
    return esd, sr

LABEL_MAP = {0: "Normal", 1: "Abnormal"}
