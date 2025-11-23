// Toggle hamburger menu
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Add scroll effect to navbar
window.addEventListener('scroll', function () {
  const nav = document.querySelector('nav');
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all sections for animation
document.addEventListener('DOMContentLoaded', function () {
  // Add initial styles for animation
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
  });

  // Animate cards on hover
  const cards = document.querySelectorAll('.details-container');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-10px)';
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
    });
  });

  // Typing effect for title (optional - can be enabled)
  // const title = document.querySelector('#profile .title');
  // if (title) {
  //   const text = title.textContent;
  //   title.textContent = '';
  //   let i = 0;
  //   const typeWriter = () => {
  //     if (i < text.length) {
  //       title.textContent += text.charAt(i);
  //       i++;
  //       setTimeout(typeWriter, 100);
  //     }
  //   };
  //   setTimeout(typeWriter, 500);
  // }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      // Close mobile menu if open
      const menu = document.querySelector(".menu-links");
      const icon = document.querySelector(".hamburger-icon");
      if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        icon.classList.remove('open');
      }
    }
  });
});

// Add parallax effect to profile picture (subtle)
window.addEventListener('scroll', function () {
  const profilePic = document.querySelector('.section__pic-container');
  if (profilePic) {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;
    profilePic.style.transform = `translateY(${rate}px)`;
  }
});

// Add cursor glow effect (optional - lightweight)
document.addEventListener('mousemove', function (e) {
  const glow = document.createElement('div');
  glow.style.position = 'fixed';
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
  glow.style.width = '10px';
  glow.style.height = '10px';
  glow.style.borderRadius = '50%';
  glow.style.background = 'rgba(102, 126, 234, 0.3)';
  glow.style.pointerEvents = 'none';
  glow.style.filter = 'blur(10px)';
  glow.style.zIndex = '9999';
  glow.style.transition = 'opacity 0.5s ease';

  document.body.appendChild(glow);

  setTimeout(() => {
    glow.style.opacity = '0';
    setTimeout(() => glow.remove(), 500);
  }, 100);
});

// ========== NEW FEATURES ==========

// Animated Counter Statistics
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  updateCounter();
}

// Observe stats section for counter animation
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.stat-number');
      counters.forEach(counter => {
        if (counter.textContent === '0') {
          animateCounter(counter);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }
});

// Contact Form Handling
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const submitBtn = form.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
          formStatus.className = 'form-status success';
          form.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        formStatus.textContent = '✗ Oops! Something went wrong. Please try again or email me directly.';
        formStatus.className = 'form-status error';
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Hide status message after 5 seconds
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 5000);
      }
    });
  }
});

// Back to Top Button
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});