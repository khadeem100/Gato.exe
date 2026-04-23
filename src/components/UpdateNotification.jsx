import React, { useState, useEffect } from "react";
import { Download, X, ArrowDownCircle, Check } from "lucide-react";

export default function UpdateNotification() {
  const [update, setUpdate] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloaded, setDownloaded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!window.electronAPI) return;

    window.electronAPI.onUpdateAvailable((data) => {
      setUpdate(data);
      setDismissed(false);
    });

    window.electronAPI.onUpdateProgress((data) => {
      setProgress(data.percent);
    });

    window.electronAPI.onUpdateDownloaded(() => {
      setDownloaded(true);
      setDownloading(false);
    });
  }, []);

  if (!update || dismissed) return null;

  const handleDownload = async () => {
    setDownloading(true);
    window.electronAPI?.downloadUpdate();
  };

  const handleInstall = () => {
    window.electronAPI?.installUpdate();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-gato-900 border border-gato-700 rounded-xl shadow-2xl p-4 w-80">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <ArrowDownCircle size={18} className="text-white" />
            <span className="text-sm font-semibold text-white">
              Update Available
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-gato-500 hover:text-gato-300 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <p className="text-xs text-gato-400 mb-3">
          Version <span className="text-gato-200 font-medium">{update.version}</span>{" "}
          is available.
          {update.releaseNotes && (
            <span className="block mt-1 text-gato-500">
              {update.releaseNotes}
            </span>
          )}
        </p>

        {downloading && !downloaded && (
          <div className="mb-3">
            <div className="h-1 bg-gato-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-gato-500 mt-1">{progress}% downloaded</p>
          </div>
        )}

        <div className="flex gap-2">
          {!downloading && !downloaded && (
            <>
              <button onClick={handleDownload} className="btn-primary text-xs py-1.5 flex-1">
                <Download size={14} />
                Download
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="btn-ghost text-xs py-1.5"
              >
                Later
              </button>
            </>
          )}
          {downloaded && (
            <button onClick={handleInstall} className="btn-primary text-xs py-1.5 flex-1">
              <Check size={14} />
              Restart & Install
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
