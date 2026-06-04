import { useEffect, useState } from 'react';
import api from '../../api/axios';
import useToastStore from '../../stores/toastStore';

const LocationDropdowns = ({ value, onChange, required = false }) => {
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const country = value.country || 'ID';

  useEffect(() => {
    api.get('/locations/countries')
      .then((response) => {
        const payload = response.data?.data || response.data || {};
        setCountries(payload.countries || []);
      })
      .catch((error) => useToastStore.getState().showToast(error.response?.data?.message || 'Unable to load countries.', 'error'));
  }, []);

  useEffect(() => {
    if (!country) {
      setProvinces([]);
      setCities([]);
      onChange({ country: '', province: '', city: '' });
      return;
    }

    api.get(`/locations/countries/${country}/provinces`)
      .then((response) => {
        const payload = response.data?.data || response.data || {};
        setProvinces(payload.provinces || []);
      })
      .catch((error) => useToastStore.getState().showToast(error.response?.data?.message || 'Unable to load provinces.', 'error'));
  }, [country]);

  useEffect(() => {
    if (!country || !value.province) {
      setCities([]);
      if (value.city) onChange({ ...value, city: '' });
      return;
    }

    api.get(`/locations/countries/${country}/provinces/${encodeURIComponent(value.province)}/cities`)
      .then((response) => {
        const payload = response.data?.data || response.data || {};
        setCities(payload.cities || []);
      })
      .catch((error) => useToastStore.getState().showToast(error.response?.data?.message || 'Unable to load cities.', 'error'));
  }, [country, value.province]);

  const selectCountry = (nextCountry) => onChange({ country: nextCountry, province: '', city: '' });
  const selectProvince = (province) => onChange({ ...value, country, province, city: '' });
  const selectCity = (city) => onChange({ ...value, country, city });

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <label><span className="font-semibold">Country</span><select required={required} value={country} onChange={(event) => selectCountry(event.target.value)} className="mt-2 w-full rounded-xl border px-3 py-2"><option value="">Select country</option>{countries.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></label>
      <label><span className="font-semibold">Province</span><select required={required} value={value.province || ''} onChange={(event) => selectProvince(event.target.value)} disabled={!country} className="mt-2 w-full rounded-xl border px-3 py-2"><option value="">Select province</option>{provinces.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></label>
      <label><span className="font-semibold">City</span><select required={required} value={value.city || ''} onChange={(event) => selectCity(event.target.value)} disabled={!value.province} className="mt-2 w-full rounded-xl border px-3 py-2"><option value="">Select city</option>{cities.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></label>
    </div>
  );
};

export default LocationDropdowns;
