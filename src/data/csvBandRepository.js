const fs = require('fs');
const Band = require('../domain/Band');

function parseCsv(content) {
  const lines = content.trim().split(/\r?\n/);
  const headers = lines.shift().split(',');
  return lines.map((line) => {
    const values = line.split(',');
    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i];
    });
    return row;
  });
}

function parseAvailability(row) {
  const availability = {};
  Object.keys(row).forEach((key) => {
    const match = key.match(/^d(\d+)_h(\d+)$/);
    if (match) {
      const day = parseInt(match[1], 10);
      const hour = parseInt(match[2], 10);
      if (!availability[day]) availability[day] = {};
      const value = String(row[key]).toLowerCase();
      availability[day][hour] = value === 'yes' || value === '1' || value === 'true';
    }
  });
  return availability;
}

function loadBandsFromCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const records = parseCsv(content);
  return records.map((row) => {
    const name = row.Band || row.band || row.name;
    const duration = parseInt(row.Duration || row.duration, 10);
    const availability = parseAvailability(row);
    return new Band(name, duration, availability);
  });
}

module.exports = { loadBandsFromCsv };
