/**
 * PARTYPLAN — Interactive Client-Side Engine
 * Features: Confetti physics, dynamic ideas explorer, budget breakdown calculator,
 * persistent LocalStorage checklist, live invitation generator, quiz engine,
 * testimonial carousel, lightbox modal, scroll reveal, and toast notifications.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Sticky Navbar & Active Link Highlighting
     ========================================================================== */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar blur background toggle
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back-to-top visibility
    if (scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // Active Section Link Tracker
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ==========================================================================
     2. Mobile Hamburger Navigation
     ========================================================================== */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  /* ==========================================================================
     3. Confetti Animation Engine (HTML5 Canvas)
     ========================================================================== */
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let confettiParticles = [];
  let confettiAnimationId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Confetto {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height - canvas.height;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 4 + 3;
      this.speedX = Math.random() * 2 - 1;
      this.color = ['#ff3377', '#7928ca', '#00dfd8', '#f5a623', '#0070f3'][Math.floor(Math.random() * 5)];
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 8 - 4;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      ctx.restore();
    }
  }

  function launchConfetti(count = 100) {
    for (let i = 0; i < count; i++) {
      confettiParticles.push(new Confetto());
    }
    if (!confettiAnimationId) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.update();
      p.draw();
      if (p.y > canvas.height) {
        confettiParticles.splice(i, 1);
      }
    }
    if (confettiParticles.length > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      cancelAnimationFrame(confettiAnimationId);
      confettiAnimationId = null;
    }
  }

  const celebrateBtn = document.getElementById('celebrate-btn');
  if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => {
      launchConfetti(140);
      showToast('🎉 Cheers to an unforgettable party!');
    });
  }

  /* ==========================================================================
     4. Number Counter Animation on Scroll
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsTriggered = false;

  const countUpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsTriggered) {
        statsTriggered = true;
        statNumbers.forEach(stat => {
          const target = +stat.getAttribute('data-target');
          const duration = 1600;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              stat.textContent = target.toLocaleString() + (target < 100 ? '%' : '+');
              clearInterval(timer);
            } else {
              stat.textContent = Math.floor(current).toLocaleString();
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.6 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) countUpObserver.observe(heroStats);

  /* ==========================================================================
     5. Dynamic Party Ideas Data & Filter Explorer
     ========================================================================== */
  const partyIdeas = [
    { title: 'Neon Arcade Night', category: 'birthday', desc: 'Glow sticks, retro synthwave arcade booths, and mocktail dispensers.', budget: '$650', guests: '20-50', diff: 'Easy' },
    { title: 'Royal Garden Gala', category: 'wedding', desc: 'Pampas arches, fairy-light canopies, string quartets, and artisanal grazing tables.', budget: '$3,800', guests: '80-250', diff: 'Moderate' },
    { title: 'Sunset Rooftop Mixer', category: 'college', desc: 'DJ turntables, ambient beanbags, live pizza ovens, and polaroid photo walls.', budget: '$900', guests: '40-100', diff: 'Easy' },
    { title: 'Executive Awards Dinner', category: 'corporate', desc: 'Champagne towers, jazz trios, branded backdrops, and keynote staging.', budget: '$2,200', guests: '50-150', diff: 'Professional' },
    { title: 'Pastel Cloud Sanctuary', category: 'baby-shower', desc: 'Cotton candy clouds, floral centerpieces, organic mocktail spritzers.', budget: '$550', guests: '15-40', diff: 'Easy' },
    { title: 'Boho Sunset Beach Soiree', category: 'wedding', desc: 'Low picnic tables, macrame rugs, barefoot acoustic sets, and fire torches.', budget: '$2,800', guests: '30-80', diff: 'Moderate' },
    { title: 'Carnival Inflatables Fest', category: 'birthday', desc: 'Giant bounce obstacles, popcorn wagons, balloon artists, and snow cones.', budget: '$800', guests: '25-70', diff: 'Easy' },
    { title: 'Innovation Showcase Mixer', category: 'corporate', desc: 'Interactive digital demos, craft beer flight bars, and lounge pods.', budget: '$1,800', guests: '40-120', diff: 'Moderate' }
  ];

  const ideasContainer = document.getElementById('ideas-container');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function renderPartyIdeas(category = 'all') {
    ideasContainer.innerHTML = '';
    const filtered = category === 'all' 
      ? partyIdeas 
      : partyIdeas.filter(item => item.category === category);

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'idea-card';
      card.innerHTML = `
        <div>
          <span class="badge" style="margin-bottom: 0.75rem; text-transform: capitalize;">${item.category}</span>
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
        </div>
        <div>
          <div class="idea-specs">
            <span><i class="fa-solid fa-wallet"></i> ${item.budget}</span>
            <span><i class="fa-solid fa-users"></i> ${item.guests}</span>
            <span><i class="fa-solid fa-gauge"></i> ${item.diff}</span>
          </div>
          <button class="btn btn-outline btn-sm w-100 idea-details-btn">View Blueprint</button>
        </div>
      `;
      ideasContainer.appendChild(card);
    });

    // Add Blueprint Toast trigger
    document.querySelectorAll('.idea-details-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        showToast('Blueprint saved to your planning board!');
      });
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPartyIdeas(btn.getAttribute('data-filter'));
    });
  });

  // Link event category cards directly into ideas filters
  document.querySelectorAll('.filter-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const targetCat = trigger.getAttribute('data-filter');
      const targetBtn = document.querySelector(`.filter-btn[data-filter="${targetCat}"]`);
      if (targetBtn) targetBtn.click();
    });
  });

  renderPartyIdeas('all');

  /* ==========================================================================
     6. Lightbox Modal for Theme Gallery
     ========================================================================== */
  const galleryCards = document.querySelectorAll('.gallery-card');
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');

  function openModal(imgSrc, title, desc) {
    modalImg.src = imgSrc;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img').getAttribute('src');
      const title = card.getAttribute('data-title');
      const desc = card.getAttribute('data-desc');
      openModal(img, title, desc);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  /* ==========================================================================
     7. Smart Budget Calculator Engine
     ========================================================================== */
  const budgetInputs = document.querySelectorAll('.cost-input');
  const guestsInput = document.getElementById('calc-guests');
  const totalBudgetEl = document.getElementById('total-budget-amount');
  const perGuestCostEl = document.getElementById('per-guest-cost');
  const resetBudgetBtn = document.getElementById('reset-budget-btn');

  function updateBudgetBreakdown() {
    const venue = +document.getElementById('cost-venue').value || 0;
    const food = +document.getElementById('cost-food').value || 0;
    const decor = +document.getElementById('cost-decor').value || 0;
    const entertain = +document.getElementById('cost-entertainment').value || 0;
    const photo = +document.getElementById('cost-photo').value || 0;
    const misc = +document.getElementById('cost-misc').value || 0;
    const guests = +guestsInput.value || 1;

    const total = venue + food + decor + entertain + photo + misc;
    totalBudgetEl.textContent = `$${total.toLocaleString()}`;
    const perGuest = Math.round(total / guests);
    perGuestCostEl.textContent = `~$${perGuest} / guest`;

    // Calculate Percentages
    const calcPct = (val) => total > 0 ? Math.round((val / total) * 100) : 0;

    const pVenue = calcPct(venue);
    const pFood = calcPct(food);
    const pDecor = calcPct(decor);
    const pEntertain = calcPct(entertain);
    const pOther = calcPct(photo + misc);

    // Update Progress Bars & Labels
    document.getElementById('pct-venue').textContent = `${pVenue}%`;
    document.getElementById('bar-venue').style.width = `${pVenue}%`;

    document.getElementById('pct-food').textContent = `${pFood}%`;
    document.getElementById('bar-food').style.width = `${pFood}%`;

    document.getElementById('pct-decor').textContent = `${pDecor}%`;
    document.getElementById('bar-decor').style.width = `${pDecor}%`;

    document.getElementById('pct-entertainment').textContent = `${pEntertain}%`;
    document.getElementById('bar-entertainment').style.width = `${pEntertain}%`;

    document.getElementById('pct-other').textContent = `${pOther}%`;
    document.getElementById('bar-other').style.width = `${pOther}%`;
  }

  budgetInputs.forEach(input => input.addEventListener('input', updateBudgetBreakdown));
  guestsInput.addEventListener('input', updateBudgetBreakdown);

  resetBudgetBtn.addEventListener('click', () => {
    document.getElementById('cost-venue').value = 1200;
    document.getElementById('cost-food').value = 1500;
    document.getElementById('cost-decor').value = 600;
    document.getElementById('cost-entertainment').value = 700;
    document.getElementById('cost-photo').value = 500;
    document.getElementById('cost-misc').value = 300;
    guestsInput.value = 50;
    updateBudgetBreakdown();
    showToast('Budget parameters reset to default values.');
  });

  updateBudgetBreakdown();

  /* ==========================================================================
     8. Master Checklist with LocalStorage Persistence
     ========================================================================== */
  const defaultTasks = [
    { id: 1, text: 'Confirm event date & booking venue deposit', done: true },
    { id: 2, text: 'Select party theme and color palette', done: true },
    { id: 3, text: 'Compile guest roster & phone list', done: false },
    { id: 4, text: 'Send invitations with RSVP deadline', done: false },
    { id: 5, text: 'Book live music or DJ performance', done: false },
    { id: 6, text: 'Finalize catering menu & drinks list', done: false },
    { id: 7, text: 'Confirm photographer/videographer timing', done: false }
  ];

  const STORAGE_KEY = 'partyplan_master_checklist';
  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultTasks;

  const taskListEl = document.getElementById('task-list');
  const addTaskForm = document.getElementById('add-task-form');
  const taskInput = document.getElementById('task-input');
  const checklistProgressBar = document.getElementById('checklist-progress-bar');
  const checklistStatusText = document.getElementById('checklist-status-text');
  const checklistFraction = document.getElementById('checklist-fraction');

  function saveAndRenderTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    taskListEl.innerHTML = '';

    let completedCount = 0;

    tasks.forEach(task => {
      if (task.done) completedCount++;

      const li = document.createElement('li');
      li.className = `task-item ${task.done ? 'completed' : ''}`;
      li.innerHTML = `
        <label class="task-checkbox-label">
          <input type="checkbox" data-id="${task.id}" ${task.done ? 'checked' : ''} />
          <span>${task.text}</span>
        </label>
        <button class="delete-task-btn" data-id="${task.id}" aria-label="Delete task">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      `;
      taskListEl.appendChild(li);
    });

    const total = tasks.length;
    const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    checklistProgressBar.style.width = `${percentage}%`;
    checklistFraction.textContent = `${completedCount} / ${total} Done`;
    checklistStatusText.textContent = `Your party is ${percentage}% ready!`;

    if (percentage === 100 && total > 0) {
      launchConfetti(50);
    }
  }

  taskListEl.addEventListener('click', (e) => {
    const checkTarget = e.target.closest('input[type="checkbox"]');
    if (checkTarget) {
      const id = +checkTarget.getAttribute('data-id');
      const item = tasks.find(t => t.id === id);
      if (item) {
        item.done = checkTarget.checked;
        saveAndRenderTasks();
      }
      return;
    }

    const deleteBtn = e.target.closest('.delete-task-btn');
    if (deleteBtn) {
      const id = +deleteBtn.getAttribute('data-id');
      tasks = tasks.filter(t => t.id !== id);
      saveAndRenderTasks();
      showToast('Task removed from list.');
    }
  });

  addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = taskInput.value.trim();
    if (!val) return;

    tasks.push({ id: Date.now(), text: val, done: false });
    taskInput.value = '';
    saveAndRenderTasks();
    showToast('New planning task added!');
  });

  saveAndRenderTasks();

  /* ==========================================================================
     9. Live Digital Invitation Generator
     ========================================================================== */
  const inviteForm = document.getElementById('invite-form');
  const inviteCard = document.getElementById('invite-card');
  const copyInviteBtn = document.getElementById('copy-invite-btn');

  // Input bindings
  const invHost = document.getElementById('inv-host');
  const invTitle = document.getElementById('inv-title');
  const invDate = document.getElementById('inv-date');
  const invTime = document.getElementById('inv-time');
  const invVenue = document.getElementById('inv-venue');
  const invMsg = document.getElementById('inv-msg');

  // Preview elements
  const prevHost = document.getElementById('preview-host');
  const prevTitle = document.getElementById('preview-title');
  const prevDate = document.getElementById('preview-date');
  const prevTime = document.getElementById('preview-time');
  const prevVenue = document.getElementById('preview-venue');
  const prevMsg = document.getElementById('preview-msg');

  // Default date: 2 weeks ahead
  const defaultFutureDate = new Date();
  defaultFutureDate.setDate(defaultFutureDate.getDate() + 14);
  invDate.valueAsDate = defaultFutureDate;

  function syncInvitePreview() {
    prevHost.textContent = invHost.value || 'Host Name';
    prevTitle.textContent = invTitle.value || 'Celebration Party';
    
    if (invDate.value) {
      const d = new Date(invDate.value + 'T00:00:00');
      prevDate.textContent = d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    prevTime.textContent = invTime.value || 'Time TBA';
    prevVenue.textContent = invVenue.value || 'Venue TBA';
    prevMsg.textContent = `"${invMsg.value || 'Join us for a wonderful celebration!'}"`;

    // Theme Class
    const selectedTheme = document.querySelector('input[name="inv-theme"]:checked').value;
    inviteCard.className = `invite-card ${selectedTheme}`;
  }

  inviteForm.addEventListener('input', syncInvitePreview);
  inviteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    syncInvitePreview();
    launchConfetti(40);
    showToast('Invitation preview updated!');
  });

  copyInviteBtn.addEventListener('click', () => {
    const textToCopy = `🎉 YOU'RE INVITED!\n${prevHost.textContent} cordially invites you to:\n✨ ${prevTitle.textContent} ✨\n\n📅 Date: ${prevDate.textContent}\n⏰ Time: ${prevTime.textContent}\n📍 Venue: ${prevVenue.textContent}\n\nNote: ${prevMsg.textContent}\n\nRSVP with us soon!`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('📋 Invitation details copied to clipboard!');
    }).catch(() => {
      showToast('Could not copy automatically. Please copy manually.');
    });
  });

  syncInvitePreview();

  /* ==========================================================================
     10. Party Style Quiz Recommendation Engine
     ========================================================================== */
  const quizSteps = document.querySelectorAll('.quiz-step');
  const quizResult = document.getElementById('quiz-result');
  const quizRestartBtn = document.getElementById('quiz-restart-btn');
  let quizAnswers = {};

  const quizDatabase = {
    energetic: {
      theme: 'Electric Neon Rave',
      desc: 'Pumping basslines, immersive laser setups, UV glow wristbands, and artisan street cocktails.',
      decor: 'Blacklights, LED walls, neon signs, fog machine',
      music: 'EDM, High-energy club anthems & Live DJ',
      budget: '$1,500 - $3,500'
    },
    classy: {
      theme: 'Midnight Champagne Gala',
      desc: 'Velvet backdrops, cascading chandeliers, jazz duos, and gourmet canapés.',
      decor: 'Warm Edison lights, gold table runners, glassware towers',
      music: 'Acoustic jazz quartet, French lounge beats',
      budget: '$2,500 - $6,000'
    },
    cozy: {
      theme: 'Boho Sunset Backyard Soiree',
      desc: 'Comfortable floor cushions, fairy light canopies, acoustic guitar, and rustic grazing charcuterie.',
      decor: 'Macrame rugs, potted succulents, warm string bulb strands',
      music: 'Indie acoustic, chill lo-fi melodies',
      budget: '$700 - $1,800'
    }
  };

  document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const field = btn.getAttribute('data-field');
      const val = btn.getAttribute('data-val');
      quizAnswers[field] = val;

      const currentStep = btn.closest('.quiz-step');
      const stepNum = +currentStep.getAttribute('data-step');

      currentStep.classList.remove('active');

      if (stepNum < quizSteps.length) {
        document.querySelector(`.quiz-step[data-step="${stepNum + 1}"]`).classList.add('active');
      } else {
        showQuizResults();
      }
    });
  });

  function showQuizResults() {
    const vibe = quizAnswers.vibe || 'energetic';
    const match = quizDatabase[vibe] || quizDatabase.energetic;

    document.getElementById('recommended-theme').textContent = match.theme;
    document.getElementById('recommended-desc').textContent = match.desc;
    document.getElementById('rec-decor').textContent = match.decor;
    document.getElementById('rec-music').textContent = match.music;
    document.getElementById('rec-budget').textContent = match.budget;

    quizResult.style.display = 'block';
    launchConfetti(80);
    showToast('Tailored celebration concept ready!');
  }

  quizRestartBtn.addEventListener('click', () => {
    quizAnswers = {};
    quizResult.style.display = 'none';
    quizSteps.forEach((s, idx) => {
      s.classList.toggle('active', idx === 0);
    });
  });

  /* ==========================================================================
     11. Testimonials Carousel Slider
     ========================================================================== */
  const track = document.getElementById('testimonial-track');
  const slides = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  const dotsContainer = document.getElementById('slider-dots');
  let currentSlide = 0;
  let autoSlideTimer = null;

  // Generate Dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  function updateSlider() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  }

  function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    resetAutoSlide();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
  }

  prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
  nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(nextSlide, 5000);
  }
  resetAutoSlide();

  /* ==========================================================================
     12. FAQ Accordion
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ==========================================================================
     13. Contact & Newsletter Form Validation (Zero Backend)
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const nameInput = document.getElementById('c-name');
    const emailInput = document.getElementById('c-email');
    const msgInput = document.getElementById('c-message');

    // Simple validation helper
    function validateField(input, condition) {
      const parent = input.closest('.form-group');
      if (!condition) {
        parent.classList.add('has-error');
        isValid = false;
      } else {
        parent.classList.remove('has-error');
      }
    }

    validateField(nameInput, nameInput.value.trim().length > 2);
    validateField(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()));
    validateField(msgInput, msgInput.value.trim().length > 5);

    if (isValid) {
      showToast('Thank you! Your planner inquiry has been dispatched.');
      contactForm.reset();
      launchConfetti(40);
    }
  });

  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Subscribed! Welcome to the VIP party catalog.');
      newsletterForm.reset();
    });
  }

  /* ==========================================================================
     14. Scroll Reveal Animations (IntersectionObserver)
     ========================================================================== */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     15. Toast Notification Utility
     ========================================================================== */
  function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-bell"></i> <span>${message}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.35s ease';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }
});