const fs = require('fs');
const Band = require('../domain/Band');

function parseCsv(content) {
  const lines = content.trim().split(/\r?\n/);
  const headers = lines
    .shift()
    .split(',')
    .map((h) => h.replace(/^\uFEFF/, '').trim());
  return lines
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const values = line.split(',');
      const row = {};
      headers.forEach((h, i) => {
        row[h] = (values[i] || '').trim();
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
  return records
    .map((row) => {
      const values = Object.values(row);
      const name = (row.Band || row.band || row.name || values[0] || '').trim();
      const durationStr = row.Duration || row.duration || values[1] || '0';
      const duration = parseInt(durationStr, 10);
      const availability = parseAvailability(row);
      return new Band(name, isNaN(duration) ? 0 : duration, availability);
    })
    .filter((b) => b.name);
}

module.exports = { loadBandsFromCsv };
