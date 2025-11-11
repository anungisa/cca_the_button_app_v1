export function getSeasonInfo(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11 (Jan-Dec)

  let seasonStartYear;
  // If it's September (month 8) or later, the season started this year.
  if (month >= 8) {
    seasonStartYear = year;
  } else {
    // Otherwise, the season started last year.
    seasonStartYear = year - 1;
  }

  const seasonEndYear = seasonStartYear + 1;

  return {
    seasonName: `${seasonStartYear}-${seasonEndYear}`,
    startDate: new Date(seasonStartYear, 8, 1), // September 1st
    endDate: new Date(seasonEndYear, 4, 31), // May 31st
  };
}

export function getFiscalYearInfo(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11 (Jan-Dec)

  let fiscalStartYear;
  // If it's June (month 5) or later, the fiscal year started this year.
  if (month >= 5) {
    fiscalStartYear = year;
  } else {
    // Otherwise, the fiscal year started last year.
    fiscalStartYear = year - 1;
  }

  const fiscalEndYear = fiscalStartYear + 1;

  return {
    fiscalYear: `FY${fiscalEndYear}`, // e.g., "FY2025" for June 2024 - May 2025
    fullName: `${fiscalStartYear}-${fiscalEndYear}`,
    startDate: new Date(fiscalStartYear, 5, 1), // June 1st
    endDate: new Date(fiscalEndYear, 4, 31), // May 31st
  };
}

export function getCurrentPeriods() {
  const currentDate = new Date();
  return {
    season: getSeasonInfo(currentDate),
    fiscalYear: getFiscalYearInfo(currentDate)
  };
}