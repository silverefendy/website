import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { formatPrice } from '../../config/constants';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import useToastStore from '../../stores/toastStore';

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [images, setImages] = useState([]);
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [form, setForm] = useState({ name: '', category_id: '', description: '', price: '', stock: '', weight: '', condition: 'new', status: 'active' });
  const slug = useMemo(() => slugify(form.name), [form.name]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [categoryResponse, productResponse] = await Promise.all([
          api.get('/categories'),
          isEdit ? api.get(`/products/id/${id}`) : Promise.resolve(null),
        ]);
        const categoryPayload = categoryResponse.data?.data || categoryResponse.data || {};
        setCategories(categoryPayload.categories || categoryPayload.items || []);
        if (productResponse) {
          const product = productResponse.data?.data?.product || productResponse.data?.data || productResponse.data;
          setForm({ name: product.name || '', category_id: product.category_id || '', description: product.description || '', price: product.price || '', stock: product.stock || '', weight: product.weight || '', condition: product.condition || 'new', status: product.status || 'active' });
        }
      } catch (error) {
        useToastStore.getState().showToast(error.response?.data?.message || 'Unable to load form data.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const update = (key, value) => setForm((state) => ({ ...state, [key]: value }));
  const selectImages = (files) => setImages(Array.from(files).slice(0, 5).map((file) => ({ file, preview: URL.createObjectURL(file) })));

  const validate = () => {
    if (!form.name.trim()) return 'Product name is required.';
    if (!form.category_id) return 'Category is required.';
    if (form.description.trim().length < 20) return 'Description must be at least 20 characters.';
    if (Number(form.price) <= 0) return 'Price must be greater than zero.';
    if (Number(form.stock) < 0) return 'Stock cannot be negative.';
    if (Number(form.weight) <= 0) return 'Weight must be greater than zero.';
    if (images.length > 5) return 'Maximum 5 images are allowed.';
    return null;
  };

  const submit = async (event) => {
    event.preventDefault();
    const error = validate();
    if (error) {
      useToastStore.getState().showToast(error, 'error');
      return;
    }
    const formData = new FormData();
    Object.entries({ ...form, slug, primary_image_index: primaryIndex }).forEach(([key, value]) => formData.append(key, value));
    images.forEach((image) => formData.append('images', image.file));
    try {
      if (isEdit) await api.put(`/products/${id}`, formData);
      else await api.post('/products', formData);
      useToastStore.getState().showToast(`Product ${isEdit ? 'updated' : 'created'} successfully.`, 'success');
      navigate('/seller/products');
    } catch (submitError) {
      useToastStore.getState().showToast(submitError.response?.data?.message || 'Unable to save product.', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-950">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      <form onSubmit={submit} className="mt-6 grid gap-5 lg:grid-cols-2">
        <label className="block lg:col-span-2"><span className="font-semibold">Name</span><input value={form.name} onChange={(event) => update('name', event.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" /><p className="mt-1 text-sm text-slate-500">Slug preview: {slug || '-'}</p></label>
        <label><span className="font-semibold">Category</span><select value={form.category_id} onChange={(event) => update('category_id', event.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3"><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label><span className="font-semibold">Price</span><input type="number" value={form.price} onChange={(event) => update('price', event.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" /><p className="mt-1 text-sm text-slate-500">{formatPrice(form.price || 0)}</p></label>
        <label><span className="font-semibold">Stock</span><input type="number" value={form.stock} onChange={(event) => update('stock', event.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" /></label>
        <label><span className="font-semibold">Weight (grams)</span><input type="number" value={form.weight} onChange={(event) => update('weight', event.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3" /></label>
        <label className="block lg:col-span-2"><span className="font-semibold">Description</span><textarea value={form.description} onChange={(event) => update('description', event.target.value)} rows="5" className="mt-2 w-full rounded-xl border px-4 py-3" /></label>
        <div><p className="font-semibold">Condition</p><div className="mt-2 flex gap-4"><label><input type="radio" checked={form.condition === 'new'} onChange={() => update('condition', 'new')} /> New</label><label><input type="radio" checked={form.condition === 'used'} onChange={() => update('condition', 'used')} /> Used</label></div></div>
        <label className="flex items-center gap-3"><input type="checkbox" checked={form.status === 'active'} onChange={(event) => update('status', event.target.checked ? 'active' : 'inactive')} /> Active</label>
        <div className="lg:col-span-2"><p className="font-semibold">Images</p><input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(event) => selectImages(event.target.files)} className="mt-2" /><div className="mt-3 flex flex-wrap gap-3">{images.map((image, index) => <button type="button" key={image.preview} onClick={() => setPrimaryIndex(index)} className={`rounded-xl border p-1 ${primaryIndex === index ? 'border-primary-600' : 'border-slate-200'}`}><img src={image.preview} alt={`Product preview ${index + 1}`} className="h-20 w-20 rounded-lg object-cover" /><span className="text-xs">{primaryIndex === index ? 'Primary' : 'Set primary'}</span></button>)}</div></div>
        <button type="submit" className="rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white lg:col-span-2">Save Product</button>
      </form>
    </section>
  );
};

export default ProductFormPage;
