// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.querySelector('i').classList.toggle('fa-bars');
  hamburger.querySelector('i').classList.toggle('fa-times');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.querySelector('i').classList.add('fa-bars');
    hamburger.querySelector('i').classList.remove('fa-times');
  });
});

// Navbar scroll effect + back to top button
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (window.pageYOffset > 300) {
    document.querySelector('.back-to-top').classList.add('show');
  } else {
    document.querySelector('.back-to-top').classList.remove('show');
  }
});

// Project Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      card.style.display =
        filter === 'all' || card.getAttribute('data-category') === filter
          ? 'block'
          : 'none';
    });
  });
});

// Contact Form with Flask API
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const loadingSpinner = document.querySelector('.loading-spinner');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  loadingSpinner.style.display = 'block';

  fetch("/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, subject, message })
  })
    .then(res => res.json())
    .then(data => {
      loadingSpinner.style.display = 'none';
      formMessage.textContent = data.message || "Message sent!";
      formMessage.classList.remove('error');
      formMessage.classList.add('success');
      formMessage.style.display = 'block';
      contactForm.reset();

      setTimeout(() => {
        formMessage.style.display = 'none';
      }, 5000);
    })
    .catch(err => {
      loadingSpinner.style.display = 'none';
      formMessage.textContent = "Error sending message.";
      formMessage.classList.add('error');
      formMessage.style.display = 'block';
    });
});

// Animate Skill Bars
window.addEventListener('load', () => {
  document.querySelectorAll('.skill-level').forEach(bar => {
    bar.style.transition = 'width 1.5s ease-in-out';
    setTimeout(() => {
      bar.style.width = bar.getAttribute('data-width') || bar.style.width;
    }, 500);
  });
});
