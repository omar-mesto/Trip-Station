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

export const listCountriesService = async (
  page: number,
  limit: number,
  lang: string
) => {
  const skip = (page - 1) * limit;
  const total = await Country.countDocuments();
  const countries = await Country.find({})
    .skip(skip)
    .limit(limit)
    .lean();
  const formatted = countries.map((country: any) => ({
    id: country._id,
    name: country.name || null,
    tripType: country.tripType,
    images: Array.isArray(country.images)
      ? country.images.map(
          (img: string) =>
            `${process.env.BASE_URL}/uploads/countryImages/${img}`
        )
      : [],
  }));

  return {
    data: formatted,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
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