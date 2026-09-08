/* ======================================================
   DESK MATE — JavaScript
   Strategy. Marketing. Growth.
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===== PRELOADER =====
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 2000);
  });
  // Fallback if load event already fired
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 3000);

  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Load saved theme
  const savedTheme = localStorage.getItem('deskmate-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('deskmate-theme', next);
  });

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // ===== ACTIVE NAV LINK HIGHLIGHTING =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPos = target.offsetTop - navHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }

      // Close mobile menu if open
      const navLinksEl = document.getElementById('navLinks');
      const hamburger = document.getElementById('navHamburger');
      navLinksEl.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  // ===== MOBILE HAMBURGER MENU =====
  const hamburger = document.getElementById('navHamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksEl.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navLinksEl.contains(e.target) && !hamburger.contains(e.target)) {
      navLinksEl.classList.remove('open');
      hamburger.classList.remove('active');
    }
  });

  // ===== SCROLL ANIMATIONS (Intersection Observer) =====
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  // ===== TEAM CARD RISE-UP ANIMATION =====
  const teamCards = document.querySelectorAll('.team-card-rise');
  
  const teamObserverOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  };

  const teamObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        teamObserver.unobserve(entry.target);
      }
    });
  }, teamObserverOptions);

  teamCards.forEach(card => teamObserver.observe(card));

  // ===== COUNTER ANIMATION =====
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    let current = 0;

    function step() {
      current += increment;
      if (current >= target) {
        element.textContent = target.toLocaleString();
        return;
      }
      element.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(step);
    }

    step();
  }

  // Observe stat numbers
  const statNumbers = document.querySelectorAll('.stat-number');
  const aboutCardNumbers = document.querySelectorAll('.about-card-number');
  const allCounters = [...statNumbers, ...aboutCardNumbers];

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        if (target) {
          animateCounter(entry.target, target);
        }
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  allCounters.forEach(counter => counterObserver.observe(counter));

  // ===== TESTIMONIAL CAROUSEL =====
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    const totalCards = cards.length;

    // Create dots
    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    function goToSlide(index) {
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update dots
      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function nextSlide() {
      goToSlide((currentIndex + 1) % totalCards);
    }

    function prevSlide() {
      goToSlide((currentIndex - 1 + totalCards) % totalCards);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto-rotate
    let autoPlay = setInterval(nextSlide, 5000);

    // Pause on hover
    const carousel = track.closest('.testimonial-carousel');
    carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
    carousel.addEventListener('mouseleave', () => {
      autoPlay = setInterval(nextSlide, 5000);
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    }, { passive: true });
  }

  // ===== BACK TO TOP =====
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== EMAILJS INITIALIZATION =====
  // TODO: Replace these with your real EmailJS credentials
  // 1. Go to https://www.emailjs.com and create a free account
  // 2. Add Gmail service (daskmate2025@gmail.com) and get your Service ID
  // 3. Create a template with variables: {{name}}, {{email}}, {{phone}}, {{company}}, {{service}}, {{message}}
  // 4. Replace the values below with your real IDs
  const EMAILJS_PUBLIC_KEY = 'OnJ3pb5riCGO_ISji';   // Replace with your EmailJS public key
  const EMAILJS_SERVICE_ID = 'service_gtmec9m';   // Replace with your EmailJS service ID
  const EMAILJS_TEMPLATE_ID = 'template_jbv37hf'; // Replace with your EmailJS template ID

  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  // ===== CONTACT FORM WITH EMAILJS =====
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      // Simple validation
      if (!data.name || !data.email) {
        return;
      }

      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalContent = submitBtn.innerHTML;

      // Show loading state
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      try {
        // Send via EmailJS
        if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            name: data.name,
            email: data.email,
            phone: data.phone || 'Not provided',
            company: data.company || 'Not provided',
            service: data.service || 'Not specified',
            message: data.message || 'No message',
            to_email: 'daskmate2025@gmail.com'
          });
        }

        // Show success message
        submitBtn.style.display = 'none';
        formSuccess.classList.add('show');
        formError.classList.remove('show');

        // Reset after 5 seconds
        setTimeout(() => {
          contactForm.reset();
          submitBtn.style.display = 'flex';
          submitBtn.innerHTML = originalContent;
          submitBtn.disabled = false;
          formSuccess.classList.remove('show');
        }, 5000);

      } catch (error) {
        console.error('EmailJS Error:', error);
        // Show error message
        formError.classList.add('show');
        formSuccess.classList.remove('show');
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;

        // Hide error after 5 seconds
        setTimeout(() => {
          formError.classList.remove('show');
        }, 5000);
      }
    });
  }

  // ===== PRICING BILLING TOGGLE =====
  const billingToggle = document.getElementById('billingToggle');
  const monthlyLabel = document.getElementById('toggleMonthly');
  const annualLabel = document.getElementById('toggleAnnual');
  const priceAmounts = document.querySelectorAll('.price-amount[data-monthly]');

  // Set initial active state
  if (monthlyLabel) monthlyLabel.classList.add('active');

  if (billingToggle) {
    billingToggle.addEventListener('change', () => {
      const isAnnual = billingToggle.checked;

      // Toggle label active states
      monthlyLabel.classList.toggle('active', !isAnnual);
      annualLabel.classList.toggle('active', isAnnual);

      // Animate price change
      priceAmounts.forEach(el => {
        el.classList.add('changing');
        setTimeout(() => {
          el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
          el.classList.remove('changing');
        }, 200);
      });
    });
  }

  // ===== HERO PARTICLES (Canvas) =====
  const canvas = document.getElementById('heroParticles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
      const hero = document.getElementById('hero');
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005
      };
    }

    function initParticles() {
      particles = [];
      const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
      for (let i = 0; i < count; i++) {
        particles.push(createParticle());
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += p.pulseSpeed;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Pulsing opacity
        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${currentOpacity})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(96, 165, 250, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    initParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    // Pause particles when not visible
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animationId) drawParticles();
        } else {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      });
    }, { threshold: 0.1 });

    heroObserver.observe(document.getElementById('hero'));
  }

  // ===== TILT EFFECT ON SERVICE CARDS =====
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `translateY(-8px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // ===== MAGNETIC EFFECT ON WHATSAPP BUTTON =====
  const whatsappBtn = document.getElementById('whatsappFloat');

  if (whatsappBtn) {
    whatsappBtn.addEventListener('mousemove', (e) => {
      const rect = whatsappBtn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      whatsappBtn.style.transform = `scale(1.1) translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    whatsappBtn.addEventListener('mouseleave', () => {
      whatsappBtn.style.transform = 'scale(1)';
    });
  }

  // ===== TYPING EFFECT FOR HERO SUBTITLE =====
  // (Already handled by CSS animation, but adding a subtle effect)

  // ===== PARALLAX ON ABOUT CARDS =====
  const aboutVisual = document.querySelector('.about-card-stack');

  if (aboutVisual) {
    window.addEventListener('scroll', () => {
      const rect = aboutVisual.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const cards = aboutVisual.querySelectorAll('.about-stat-card');
        cards.forEach((card, i) => {
          const offset = (scrollPercent - 0.5) * (15 + i * 8);
          card.style.transform = `translateY(${-offset}px)`;
        });
      }
    });
  }

});
