export const canadianProvincesAndTerritories = [
  { name: 'Alberta', abbreviation: 'AB' },
  { name: 'British Columbia', abbreviation: 'BC' },
  { name: 'Manitoba', abbreviation: 'MB' },
  { name: 'New Brunswick', abbreviation: 'NB' },
  { name: 'Newfoundland and Labrador', abbreviation: 'NL' },
  { name: 'Northwest Territories', abbreviation: 'NT' },
  { name: 'Nova Scotia', abbreviation: 'NS' },
  { name: 'Nunavut', abbreviation: 'NU' },
  { name: 'Ontario', abbreviation: 'ON' },
  { name: 'Prince Edward Island', abbreviation: 'PE' },
  { name: 'Quebec', abbreviation: 'QC' },
  { name: 'Saskatchewan', abbreviation: 'SK' },
  { name: 'Yukon', abbreviation: 'YT' },
];

export const provinces = canadianProvincesAndTerritories;

export const getProvinceNameByAbbreviation = (abbreviation) => {
    const province = canadianProvincesAndTerritories.find(p => p.abbreviation === abbreviation);
    return province ? province.name : abbreviation;
};