import companyModel from '../models/company.model';

export const createCompanyService = async (data: any) => {
  return await companyModel.create(data);
};

export const updateCompanyService = async (id: string, data: any) => {
  return await companyModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCompanyService = async (id: string) => {
  return await companyModel.findByIdAndDelete(id);
};

export const listCompaniesService = async (page: number, limit: number, lang: string) => {
  const skip = (page - 1) * limit;

  const companies = await companyModel.find()
    .select(`_id name.${lang} rating logo contact`)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await companyModel.countDocuments();

  const formatted = companies.map(company => ({
    id: company._id,
    logo: company.logo,
    rating: company.rating,
    contact: company.contact,
    name: (company.name as any)[lang] || null
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
