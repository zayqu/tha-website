// Auto-updated impact statistics
// Update these numbers regularly to reflect current impact
export const impactStats = {
  peopleReached: 5000,
  partnerships: 12,
  regions: 8,
  yearsActive: 1,
  volunteers: 25,
  projects: 15,
  
  // Auto-calculate years if needed
  getYearsActive: () => {
    const foundedYear = 2025;
    const currentYear = new Date().getFullYear();
    return Math.max(1, currentYear - foundedYear + 1);
  }
};
