import Country from '../models/country.model';

export const createCountryService = async (data: any) => {
  return await Country.create(data);
};

export const updateCountryService = async (id: string, data: any) => {
  return await Country.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCountryService = async (id: string) => {
  return await Country.findByIdAndDelete(id);
};

export const listCountriesService = async (lang: string) => {
  const countries = await Country.find({}).lean();

  const data = countries.map((country: any) => ({
    id: country._id,
    name: country.name?.[lang] || country.name?.en || null,
    tripType: country.tripType,
    images: Array.isArray(country.images)? country.images.map((img: string) =>`${process.env.BASE_URL}/uploads/countryImages/${img}`):[],}));
  return data;
};

export const localCountryService = async (lang: string) => {
  const countries = await Country.find({ tripType: "local" }).lean();
   const data = countries.map((country: any) => ({
    id: country._id,
    name: country.name?.[lang] || country.name?.en || null,
    tripType: country.tripType,
    images: Array.isArray(country.images)? country.images.map((img: string) =>`${process.env.BASE_URL}/uploads/countryImages/${img}`):[],}));
  return data;
};

export const internationalCountryService = async (lang: string) => {
  const countries = await Country.find({ tripType: "international" }).lean();
   const data = countries.map((country: any) => ({
    id: country._id,
    name: country.name?.[lang] || country.name?.en || null,
    tripType: country.tripType,
    images: Array.isArray(country.images)? country.images.map((img: string) =>`${process.env.BASE_URL}/uploads/countryImages/${img}`):[],}));
  return data;
};