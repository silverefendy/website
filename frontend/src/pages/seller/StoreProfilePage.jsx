import { useEffect, useState } from 'react';
import { DEFAULT_PRODUCT_IMAGE, resolveImageUrl } from '../../config/constants';
import useAuthStore from '../../stores/authStore';

const StoreProfilePage = () => {
  const { user, fetchMe, updateProfile, isLoading } = useAuthStore();
  const [form, setForm] = useState({ store_name: '', description: '', address: '', city: '', province: '', postal_code: '' });
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [previews, setPreviews] = useState({ logo: DEFAULT_PRODUCT_IMAGE, banner: DEFAULT_PRODUCT_IMAGE });

  useEffect(() => { fetchMe().catch(() => {}); }, [fetchMe]);
  useEffect(() => {
    const store = user?.store || {};
    setForm({ store_name: store.store_name || '', description: store.description || '', address: store.address || '', city: store.city || '', province: store.province || '', postal_code: store.postal_code || '' });
    setPreviews({ logo: store.logo ? resolveImageUrl(store.logo) : DEFAULT_PRODUCT_IMAGE, banner: store.banner ? resolveImageUrl(store.banner) : DEFAULT_PRODUCT_IMAGE });
  }, [user]);

  const update = (key, value) => setForm((state) => ({ ...state, [key]: value }));
  const setFile = (key, file) => {
    if (key === 'logo') setLogo(file);
    if (key === 'banner') setBanner(file);
    if (file) setPreviews((state) => ({ ...state, [key]: URL.createObjectURL(file) }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.store_name.trim()) return;
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (logo) data.append('logo', logo);
    if (banner) data.append('banner', banner);
    await updateProfile(data);
  };

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-950">Store Profile</h1>
      <form onSubmit={submit} className="mt-6 grid gap-5 lg:grid-cols-2">
        <label className="lg:col-span-2"><span className="font-semibold">Store name</span><input required value={form.store_name} onChange={(event) => update('store_name', event.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" /></label>
        <label className="lg:col-span-2"><span className="font-semibold">Description</span><textarea value={form.description} onChange={(event) => update('description', event.target.value)} rows="4" className="mt-2 w-full rounded-xl border px-4 py-3" /></label>
        {['address', 'city', 'province', 'postal_code'].map((field) => <label key={field}><span className="font-semibold capitalize">{field.replace('_', ' ')}</span><input value={form[field]} onChange={(event) => update(field, event.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" /></label>)}
        <div><p className="font-semibold">Logo</p><img src={previews.logo} alt="Store logo preview" className="mt-2 h-24 w-24 rounded-xl object-cover" /><input type="file" accept="image/*" onChange={(event) => setFile('logo', event.target.files?.[0])} className="mt-3" /></div>
        <div><p className="font-semibold">Banner</p><img src={previews.banner} alt="Store banner preview" className="mt-2 h-24 w-full rounded-xl object-cover" /><input type="file" accept="image/*" onChange={(event) => setFile('banner', event.target.files?.[0])} className="mt-3" /></div>
        <button disabled={isLoading} type="submit" className="rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white lg:col-span-2">Save Store</button>
      </form>
    </section>
  );
};

export default StoreProfilePage;
