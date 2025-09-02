function sortBandsByAvailability(bands) {
  return [...bands].sort((a, b) => a.totalAvailableSlots() - b.totalAvailableSlots());
}

module.exports = { sortBandsByAvailability };
