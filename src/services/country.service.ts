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

export const listCountriesService = async (page: number, limit: number, lang: string) => {
  const skip = (page - 1) * limit;

  const countries = await Country.find()
    .select(`_id flag name.${lang}`)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Country.countDocuments();

  const formatted = countries.map(country => ({
    id: country._id,
    flag: country.flag,
    [`name_${lang}`]: (country.name as any)?.[lang] || null
  }));

  return {
    data: formatted,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  };
};

