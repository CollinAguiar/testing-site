document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('expanded');
  });
});

let lastScrollTop = 0;
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', function () {
  let scrollTop = window.scrollY || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop) {
    navbar.style.top = '-80px';
  } else {
    navbar.style.top = '0';
  }
  lastScrollTop = scrollTop;
});
