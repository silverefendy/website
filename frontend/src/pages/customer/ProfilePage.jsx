import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { DEFAULT_AVATAR_IMAGE, resolveImageUrl } from '../../config/constants';
import useAuthStore from '../../stores/authStore';
import useToastStore from '../../stores/toastStore';

const ProfilePage = () => {
  const { user, fetchMe, updateProfile, isLoading } = useAuthStore();
  const [profile, setProfile] = useState({ name: '', phone: '' });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR_IMAGE);
  const [passwords, setPasswords] = useState({ current_password: '', new_password: '', confirm_password: '' });

  useEffect(() => {
    fetchMe().catch(() => {});
  }, [fetchMe]);

  useEffect(() => {
    setProfile({ name: user?.name || '', phone: user?.phone || '' });
    setAvatarPreview(user?.avatar ? resolveImageUrl(user.avatar) : DEFAULT_AVATAR_IMAGE);
  }, [user]);

  const selectAvatar = (file) => {
    setAvatar(file);
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const submitProfile = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('phone', profile.phone);
    if (avatar) formData.append('avatar', avatar);
    await updateProfile(formData);
  };

  const submitPassword = async (event) => {
    event.preventDefault();
    try {
      await api.put('/auth/change-password', passwords);
      useToastStore.getState().showToast('Password changed successfully.', 'success');
      setPasswords({ current_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      useToastStore.getState().showToast(error.response?.data?.message || 'Unable to change password.', 'error');
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">My Profile</h1>
        <form onSubmit={submitProfile} className="mt-6 space-y-4">
          <div className="flex items-center gap-4">
            <img src={avatarPreview} alt="Profile avatar preview" onError={(event) => { event.currentTarget.src = DEFAULT_AVATAR_IMAGE; }} className="h-20 w-20 rounded-full object-cover" />
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => selectAvatar(event.target.files?.[0])} className="text-sm" />
          </div>
          <label className="block"><span className="text-sm font-semibold">Name</span><input required value={profile.name} onChange={(event) => setProfile((state) => ({ ...state, name: event.target.value }))} className="mt-2 w-full rounded-xl border px-4 py-3" /></label>
          <label className="block"><span className="text-sm font-semibold">Phone</span><input value={profile.phone} onChange={(event) => setProfile((state) => ({ ...state, phone: event.target.value }))} className="mt-2 w-full rounded-xl border px-4 py-3" /></label>
          <button disabled={isLoading} type="submit" className="rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white disabled:opacity-60">Save Profile</button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Change Password</h2>
        <form onSubmit={submitPassword} className="mt-6 space-y-4">
          <input required type="password" value={passwords.current_password} onChange={(event) => setPasswords((state) => ({ ...state, current_password: event.target.value }))} placeholder="Current password" className="w-full rounded-xl border px-4 py-3" />
          <input required type="password" value={passwords.new_password} onChange={(event) => setPasswords((state) => ({ ...state, new_password: event.target.value }))} placeholder="New password" className="w-full rounded-xl border px-4 py-3" />
          <input required type="password" value={passwords.confirm_password} onChange={(event) => setPasswords((state) => ({ ...state, confirm_password: event.target.value }))} placeholder="Confirm new password" className="w-full rounded-xl border px-4 py-3" />
          <button type="submit" className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white">Change Password</button>
        </form>
      </section>
    </div>
  );
};

export default ProfilePage;
