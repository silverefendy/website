import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import useToastStore from '../../stores/toastStore';

const blank = { id: null, name: '', parent_id: '', description: '', image: null };

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(blank);
  const [isLoading, setIsLoading] = useState(true);
  const tree = useMemo(() => categories.filter((item) => !item.parent_id).map((parent) => ({ ...parent, children: categories.filter((item) => item.parent_id === parent.id) })), [categories]);

  const load = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/categories');
      const payload = response.data?.data || response.data || {};
      setCategories(payload.categories || payload.items || []);
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to load categories.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => { load(); }, []);
  const edit = (category) => setForm({ id: category.id, name: category.name || '', parent_id: category.parent_id || '', description: category.description || '', image: null });

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return useToastStore.getState().showToast('Category name is required.', 'error');
    const data = new FormData();
    data.append('name', form.name);
    data.append('parent_id', form.parent_id);
    data.append('description', form.description);
    if (form.image) data.append('image', form.image);
    try {
      if (form.id) await api.put(`/categories/${form.id}`, data);
      else await api.post('/categories', data);
      useToastStore.getState().showToast('Category saved.', 'success');
      setForm(blank);
      load();
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to save category.', 'error');
    }
  };

  const remove = async (category) => {
    if (!window.confirm(`Delete category ${category.name}?`)) return;
    try {
      await api.delete(`/categories/${category.id}`);
      useToastStore.getState().showToast('Category deleted.', 'success');
      load();
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to delete category.', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  return <div className="grid gap-6 lg:grid-cols-[1fr_420px]"><section className="rounded-2xl bg-white p-5 shadow-sm"><h1 className="text-2xl font-bold">Categories</h1><div className="mt-5 space-y-2">{tree.map((parent) => <div key={parent.id}><div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"><button onClick={() => edit(parent)} className="font-semibold">{parent.name}</button><button onClick={() => remove(parent)} className="text-red-600">Delete</button></div><div className="ml-6 mt-2 space-y-2">{parent.children.map((child) => <div key={child.id} className="flex items-center justify-between rounded-xl border px-4 py-2"><button onClick={() => edit(child)}>{child.name}</button><button onClick={() => remove(child)} className="text-red-600">Delete</button></div>)}</div></div>)}</div></section><form onSubmit={submit} className="h-fit rounded-2xl bg-white p-5 shadow-sm"><h2 className="text-xl font-bold">{form.id ? 'Edit' : 'Add'} Category</h2><input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Name" className="mt-4 w-full rounded-xl border px-4 py-3" /><select value={form.parent_id} onChange={(e) => setForm((s) => ({ ...s, parent_id: e.target.value }))} className="mt-3 w-full rounded-xl border px-4 py-3"><option value="">Top level</option>{categories.filter((c) => !c.parent_id && c.id !== form.id).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><textarea value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} placeholder="Description" className="mt-3 w-full rounded-xl border px-4 py-3" rows="4" /><input type="file" accept="image/*" onChange={(e) => setForm((s) => ({ ...s, image: e.target.files?.[0] }))} className="mt-3" /><button className="mt-4 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white">Save</button></form></div>;
};

export default CategoryManagementPage;
