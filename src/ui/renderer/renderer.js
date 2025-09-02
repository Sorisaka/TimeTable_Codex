window.electronAPI.onBandsLoaded((bands) => {
  const container = document.getElementById('bands');
  container.innerHTML = '';
  bands.sort((a, b) => a.totalAvailableSlots - b.totalAvailableSlots);
  bands.forEach((b) => {
    const div = document.createElement('div');
    div.className = 'band-block';
    div.textContent = `${b.name} (${b.duration}min)`;
    container.appendChild(div);
  });
});
