class Band {
  constructor(name, duration, availability = {}) {
    this.name = name;
    this.duration = duration;
    this.availability = availability;
  }

  totalAvailableSlots() {
    let count = 0;
    for (const day of Object.values(this.availability)) {
      for (const available of Object.values(day)) {
        if (available) count += 1;
      }
    }
    return count;
  }
}

module.exports = Band;
