import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Shield,
  Monitor,
  Info,
  Download,
  CheckCircle2,
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const [version, setVersion] = useState("1.0.0");
  const [updateStatus, setUpdateStatus] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getVersion().then(setVersion);
    }
  }, []);

  const checkUpdate = async () => {
    setChecking(true);
    try {
      if (window.electronAPI) {
        const info = await window.electronAPI.checkForUpdate();
        if (info) {
          setUpdateStatus({ available: true, version: info.version });
        } else {
          setUpdateStatus({ available: false });
        }
      } else {
        // Web mode: check via API
        const { default: api } = await import("../api");
        const data = await api.checkVersion();
        if (data && data.latest_version !== version) {
          setUpdateStatus({
            available: true,
            version: data.latest_version,
            url: data.download_url,
          });
        } else {
          setUpdateStatus({ available: false });
        }
      }
    } catch {
      setUpdateStatus({ available: false });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="text-sm text-gato-500 mt-0.5">
          Account information and application settings
        </p>
      </div>

      {/* Account */}
      <div className="card">
        <h2 className="section-title flex items-center gap-2">
          <User size={14} /> Account
        </h2>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label className="text-xs text-gato-500">Name</label>
            <p className="text-sm text-gato-200 mt-0.5">
              {user?.firstname} {user?.lastname}
            </p>
          </div>
          <div>
            <label className="text-xs text-gato-500">Email</label>
            <p className="text-sm text-gato-200 mt-0.5">{user?.email}</p>
          </div>
          {user?.company && (
            <div>
              <label className="text-xs text-gato-500">Company</label>
              <p className="text-sm text-gato-200 mt-0.5">{user?.company}</p>
            </div>
          )}
        </div>
      </div>

      {/* Connection */}
      <div className="card">
        <h2 className="section-title flex items-center gap-2">
          <Shield size={14} /> Connection
        </h2>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm text-gato-200">Connected</span>
          </div>
          <span className="text-xs text-gato-500">
            Live sync with GatoSports server
          </span>
        </div>
        <p className="text-xs text-gato-500 mt-2">
          Server: gato-companion.gato-international.com
        </p>
      </div>

      {/* Application */}
      <div className="card">
        <h2 className="section-title flex items-center gap-2">
          <Monitor size={14} /> Application
        </h2>
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-sm text-gato-200">
              GatoSports Sales Rep Desktop
            </p>
            <p className="text-xs text-gato-500 mt-0.5">Version {version}</p>
          </div>
          <button
            onClick={checkUpdate}
            disabled={checking}
            className="btn-secondary text-xs"
          >
            {checking ? (
              <div className="w-3 h-3 border border-gato-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download size={14} />
            )}
            Check for Updates
          </button>
        </div>

        {updateStatus && (
          <div className="mt-3 p-3 bg-gato-800/40 rounded-lg">
            {updateStatus.available ? (
              <div className="flex items-center gap-2">
                <Info size={14} className="text-white" />
                <span className="text-sm text-gato-200">
                  Version {updateStatus.version} is available
                </span>
                {updateStatus.url && (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.electronAPI?.openExternal(updateStatus.url);
                    }}
                    className="text-xs text-gato-400 hover:text-white ml-auto"
                  >
                    Download &rarr;
                  </a>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span className="text-sm text-gato-200">
                  You're on the latest version
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* About */}
      <div className="card">
        <h2 className="section-title flex items-center gap-2">
          <Info size={14} /> About
        </h2>
        <p className="text-xs text-gato-500 mt-2 leading-relaxed">
          GatoSports Sales Rep Desktop is a native application for sales
          representatives to manage customers, orders, and pre-orders with
          real-time server synchronization. All data is fetched live from the
          GatoSports system.
        </p>
        <p className="text-xs text-gato-600 mt-3">
          &copy; 2026 GatoSports. All rights reserved.
        </p>
      </div>
    </div>
  );
}
