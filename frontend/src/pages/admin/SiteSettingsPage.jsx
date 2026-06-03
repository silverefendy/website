import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { SITE_NAME, SITE_TAGLINE, SUPPORT_EMAIL, WHATSAPP_NUMBER } from '../../config/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import useToastStore from '../../stores/toastStore';

const fallbackSettings = [
  { setting_key: 'site_name', setting_value: SITE_NAME },
  { setting_key: 'site_tagline', setting_value: SITE_TAGLINE },
  { setting_key: 'support_email', setting_value: SUPPORT_EMAIL },
  { setting_key: 'whatsapp_number', setting_value: WHATSAPP_NUMBER },
  { setting_key: 'maintenance_mode', setting_value: 'false' },
];

const labelFor = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const SiteSettingsPage = () => {
  const [settings, setSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/admin/settings');
        const payload = response.data?.data || response.data || {};
        setSettings(payload.settings || fallbackSettings);
      } catch (error) {
        setSettings(fallbackSettings);
        useToastStore.getState().showToast(error.response?.data?.message || 'Using default setting fields until API is available.', 'info');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const updateValue = (key, value) => setSettings((state) => state.map((item) => item.setting_key === key ? { ...item, setting_value: value } : item));
  const save = async (setting) => {
    if (!window.confirm(`Save ${labelFor(setting.setting_key)}?`)) return;
    if (setting.setting_key === 'support_email' && !String(setting.setting_value).includes('@')) {
      useToastStore.getState().showToast('Support email must be valid.', 'error');
      return;
    }
    try {
      await api.put(`/admin/settings/${setting.setting_key}`, { setting_value: String(setting.setting_value) });
      useToastStore.getState().showToast('Setting saved.', 'success');
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to save setting.', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  return <section className="space-y-5"><h1 className="text-2xl font-bold">Site Settings</h1><p className="rounded-2xl bg-primary-50 p-4 text-sm text-primary-800">These settings override environment defaults at runtime.</p><div className="space-y-3">{settings.map((setting) => <div key={setting.setting_key} className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-[220px_1fr_auto] md:items-center"><label className="font-semibold">{labelFor(setting.setting_key)}</label>{setting.setting_key === 'maintenance_mode' ? <label className="flex items-center gap-3"><input type="checkbox" checked={String(setting.setting_value) === 'true'} onChange={(e) => updateValue(setting.setting_key, e.target.checked ? 'true' : 'false')} /> Maintenance mode</label> : <input value={setting.setting_value || ''} onChange={(e) => updateValue(setting.setting_key, e.target.value)} className="rounded-xl border px-4 py-2" />}<button onClick={() => save(setting)} className="rounded-xl bg-slate-950 px-4 py-2 font-semibold text-white">Save</button></div>)}</div></section>;
};

export default SiteSettingsPage;
