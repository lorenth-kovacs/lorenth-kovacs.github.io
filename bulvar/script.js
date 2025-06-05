const body = document.getElementById('body');

document.addEventListener('mousemove', (e) => {
  const rect = body.getBoundingClientRect();
  const scrollTop = body.scrollTop;
  const scrollLeft = body.scrollLeft;

  const x = e.clientX - rect.left + scrollLeft;
  const y = e.clientY - rect.top + scrollTop;

  const percentX = (x / body.scrollWidth) * 100;
  const percentY = (y / body.scrollHeight) * 100;

  body.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, black 0%, red 3%, blue 6%, black 15%)`;
});

