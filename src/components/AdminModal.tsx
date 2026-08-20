import { useState, useEffect, FormEvent } from 'react';
import { X, Check, AlertTriangle, AlertCircle, Plus, Trash2, CheckCircle2, ShieldCheck, Lock, LogOut, Key } from 'lucide-react';
import { SystemStatusResponse, ServiceStatus } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SystemStatusResponse | null;
  onDataUpdated: (newData: SystemStatusResponse) => void;
}

export function AdminModal({ isOpen, onClose, data, onDataUpdated }: AdminModalProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // New incident form state
  const [newTitle, setNewTitle] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newServiceId, setNewServiceId] = useState('thinking_mode');
  const [newStatus, setNewStatus] = useState<'investigating' | 'identified' | 'monitoring'>('investigating');
  const [showAddIncident, setShowAddIncident] = useState(false);

  // Load saved session token from localStorage if available
  useEffect(() => {
    const savedToken = localStorage.getItem('wnel_admin_password');
    if (savedToken) {
      setPassword(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  if (!isOpen || !data) return null;

  // Handle Login submission
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoadingAction('login');
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('wnel_admin_password', password);
      } else {
        const result = await res.json();
        setAuthError(result.error || 'Şifre hatalı. Lütfen tekrar deneyin.');
        setIsAuthenticated(false);
      }
    } catch {
      setAuthError('Sunucu ile iletişim kurulamadı.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('wnel_admin_password');
    setPassword('');
    setIsAuthenticated(false);
    setAuthError(null);
  };

  // Helper fetch with auth header
  const authFetch = async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'x-admin-password': password,
      ...(options.headers || {}),
    };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      handleLogout();
      setAuthError('Oturum süresi doldu veya şifre geçersiz.');
      throw new Error('Unauthorized');
    }
    return res;
  };

  // Change service status
  const handleSetServiceStatus = async (serviceId: string, status: ServiceStatus, statusText?: string) => {
    setLoadingAction(`svc-${serviceId}-${status}`);
    try {
      const res = await authFetch('/api/admin/service-status', {
        method: 'POST',
        body: JSON.stringify({ serviceId, status, statusText }),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.payload) onDataUpdated(result.payload);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setLoadingAction(null);
    }
  };

  // Toggle Auto Probe
  const handleToggleAutoProbe = async () => {
    setLoadingAction('toggle-probe');
    try {
      const res = await authFetch('/api/admin/toggle-auto-probe', {
        method: 'POST',
        body: JSON.stringify({ enabled: !data.autoProbeEnabled }),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.payload) onDataUpdated(result.payload);
      }
    } catch (err) {
      console.error('Failed to toggle auto probe:', err);
    } finally {
      setLoadingAction(null);
    }
  };

  // Create new incident
  const handleCreateIncident = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setLoadingAction('create-inc');
    try {
      const res = await authFetch('/api/admin/incidents', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: newServiceId,
          title: newTitle,
          summary: newSummary,
          status: newStatus,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.payload) onDataUpdated(result.payload);
        setNewTitle('');
        setNewSummary('');
        setShowAddIncident(false);
      }
    } catch (err) {
      console.error('Failed to create incident:', err);
    } finally {
      setLoadingAction(null);
    }
  };

  // Resolve incident
  const handleResolveIncident = async (id: string) => {
    setLoadingAction(`resolve-${id}`);
    try {
      const res = await authFetch(`/api/admin/incidents/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'resolved' }),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.payload) onDataUpdated(result.payload);
      }
    } catch (err) {
      console.error('Failed to resolve incident:', err);
    } finally {
      setLoadingAction(null);
    }
  };

  // Delete incident
  const handleDeleteIncident = async (id: string) => {
    setLoadingAction(`del-${id}`);
    try {
      const res = await authFetch(`/api/admin/incidents/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const result = await res.json();
        if (result.payload) onDataUpdated(result.payload);
      }
    } catch (err) {
      console.error('Failed to delete incident:', err);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
      <div
        id="admin-management-modal"
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold">
              {isAuthenticated ? (
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              ) : (
                <Lock className="w-4 h-4 text-amber-500" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {isAuthenticated ? 'Yönetici Kontrol Paneli' : 'Yönetici Girişi Gerekli'}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {isAuthenticated
                  ? 'Servis durumlarını ve bildirimleri güvenli yönetin'
                  : 'Sadece yetkili yöneticiler değişiklik yapabilir'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                title="Yönetici Oturumunu Kapat"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer flex items-center gap-1 text-xs"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!isAuthenticated ? (
          /* Password Authentication Screen */
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
              <Key className="w-7 h-7" />
            </div>

            <div className="max-w-sm space-y-1.5">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Yönetici Şifrenizi Girin
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Bu alana sadece yetkili sistem yöneticisi erişebilir.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-3 text-left">
              <div>
                <input
                  type="password"
                  placeholder="Yönetici Şifresi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loadingAction === 'login' || !password.trim()}
                className="w-full py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-semibold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {loadingAction === 'login' ? 'Doğrulanıyor...' : 'Giriş Yap'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Management View */
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
            
            {/* Mode Switcher Banner */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>Otomatik Probe Modu:</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      data.autoProbeEnabled
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {data.autoProbeEnabled ? 'Açık (Canlı Test)' : 'Kapalı (Manuel Sabit)'}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {data.autoProbeEnabled
                    ? 'Arka plandaki sağlık kontrolü durumları otomatik günceller.'
                    : 'Manuel mod aktif. Seçtiğiniz renkler ve durumlar siz değiştirene kadar sabit kalır.'}
                </p>
              </div>
              <button
                onClick={handleToggleAutoProbe}
                disabled={loadingAction === 'toggle-probe'}
                className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 font-medium text-xs text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shrink-0 cursor-pointer shadow-xs"
              >
                {data.autoProbeEnabled ? 'Manuele Al' : 'Otomatike Al'}
              </button>
            </div>

            {/* Service Status Quick Selector */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Servis Durumlarını Belirle
              </h3>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
                {data.services.map((svc) => (
                  <div key={svc.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {svc.name}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {svc.subtitle || svc.id} • Şu anki durum:{' '}
                        <span
                          className={`font-semibold ${
                            svc.status === 'operational'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : svc.status === 'degraded'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {svc.statusText || svc.status}
                        </span>
                      </div>
                    </div>

                    {/* 3 Quick Buttons (Normal / Degraded / Outage) */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleSetServiceStatus(svc.id, 'operational', 'Normal')}
                        disabled={loadingAction === `svc-${svc.id}-operational`}
                        title="Normal / Çalışıyor olarak ayarla"
                        className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          svc.status === 'operational'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/50'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Normal</span>
                      </button>

                      <button
                        onClick={() => handleSetServiceStatus(svc.id, 'degraded', 'Degraded')}
                        disabled={loadingAction === `svc-${svc.id}-degraded`}
                        title="Performans Düşüklüğü (Sarı) olarak ayarla"
                        className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          svc.status === 'degraded'
                            ? 'bg-amber-500 text-zinc-950 shadow-xs'
                            : 'bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/50'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Degraded</span>
                      </button>

                      <button
                        onClick={() => handleSetServiceStatus(svc.id, 'major_outage', 'Incident')}
                        disabled={loadingAction === `svc-${svc.id}-major_outage`}
                        title="Kesinti (Kırmızı) olarak ayarla"
                        className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          svc.status === 'major_outage'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800/50'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Incident</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Incidents Manager */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Aktif Olaylar & Bildirimler
                </h3>
                <button
                  onClick={() => setShowAddIncident(!showAddIncident)}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddIncident ? 'İptal' : 'Yeni Olay Ekle'}</span>
                </button>
              </div>

              {/* Add Incident Form */}
              {showAddIncident && (
                <form
                  onSubmit={handleCreateIncident}
                  className="p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 space-y-3"
                >
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      İlgili Servis
                    </label>
                    <select
                      value={newServiceId}
                      onChange={(e) => setNewServiceId(e.target.value)}
                      className="w-full text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100"
                    >
                      {data.services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.subtitle || s.id})
                        </option>
                      ))}
                      <option value="general">Genel Sistem</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Olay Başlığı
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Düşünen Mod - Model temporarily unavailable Sorunu"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Açıklama / Durum Özeti
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Kullanıcılara gösterilecek durum ve çalışma açıklaması..."
                      value={newSummary}
                      onChange={(e) => setNewSummary(e.target.value)}
                      className="w-full text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100"
                    >
                      <option value="investigating">İnceleniyor (Investigating)</option>
                      <option value="identified">Belirlendi (Identified)</option>
                      <option value="monitoring">İzleniyor (Monitoring)</option>
                    </select>

                    <button
                      type="submit"
                      disabled={loadingAction === 'create-inc'}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 cursor-pointer shadow-xs"
                    >
                      Olayı Yayınla
                    </button>
                  </div>
                </form>
              )}

              {/* List of active incidents */}
              {data.activeIncidents.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 text-center text-xs text-zinc-500">
                  Aktif açık bir olay bildirimi bulunmuyor.
                </div>
              ) : (
                <div className="space-y-2">
                  {data.activeIncidents.map((inc) => (
                    <div
                      key={inc.id}
                      className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                          <span>{inc.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold">
                            {inc.status}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          {inc.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleResolveIncident(inc.id)}
                          disabled={loadingAction === `resolve-${inc.id}`}
                          title="Olayı Çözüldü olarak işaretle"
                          className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 font-medium text-xs flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/40 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Çözüldü</span>
                        </button>

                        <button
                          onClick={() => handleDeleteIncident(inc.id)}
                          disabled={loadingAction === `del-${inc.id}`}
                          title="Sil"
                          className="p-1 rounded-md text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-end bg-zinc-50/50 dark:bg-zinc-800/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
