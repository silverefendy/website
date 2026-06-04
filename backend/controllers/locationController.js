const { successResponse, errorResponse } = require('../helpers/responseHelper');

const locations = {
  ID: {
    name: 'Indonesia',
    provinces: {
      'DKI Jakarta': ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur'],
      'Jawa Barat': ['Bandung', 'Bogor', 'Bekasi', 'Depok', 'Cirebon'],
      'Jawa Tengah': ['Semarang', 'Solo', 'Magelang', 'Pekalongan'],
      'Jawa Timur': ['Surabaya', 'Malang', 'Sidoarjo', 'Kediri'],
      Banten: ['Tangerang', 'Tangerang Selatan', 'Serang', 'Cilegon'],
      Bali: ['Denpasar', 'Badung', 'Gianyar'],
    },
  },
};

const countries = (req, res) => successResponse(res, {
  countries: Object.entries(locations).map(([code, country]) => ({ code, name: country.name })),
}, 'Countries retrieved successfully.');

const provinces = (req, res) => {
  const country = locations[req.params.countryCode];
  if (!country) return errorResponse(res, 'Country not found.', 404);
  return successResponse(res, {
    provinces: Object.keys(country.provinces).map((name) => ({ code: name, name })),
  }, 'Provinces retrieved successfully.');
};

const cities = (req, res) => {
  const country = locations[req.params.countryCode];
  if (!country) return errorResponse(res, 'Country not found.', 404);
  const provinceName = decodeURIComponent(req.params.provinceCode);
  const provinceCities = country.provinces[provinceName];
  if (!provinceCities) return errorResponse(res, 'Province not found.', 404);
  return successResponse(res, {
    cities: provinceCities.map((name) => ({ code: name, name })),
  }, 'Cities retrieved successfully.');
};

module.exports = { countries, provinces, cities };
