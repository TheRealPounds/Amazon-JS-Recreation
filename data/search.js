export function addSearchEvents(bar, button) {
  bar.addEventListener('keypress', (event) => {
    if (event.key == 'Enter') {
      window.location.href = `amazon.html${bar.value ? `?search=${bar.value}` : ''}`;
    }
  });

  button.addEventListener('click', () => {
    window.location.href = `amazon.html${bar.value ? `?search=${bar.value}` : ''}`;
  });
}