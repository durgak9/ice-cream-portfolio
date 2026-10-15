/**
 * Main Interactive Logic for Durga Khadbade's Portfolio
 * Ice Cream Parlor Theme
 */

(function () {
  // -------------------------------------------------------------
  // 1. Web Audio API Sound Synthesizer (Zero external audio files)
  // -------------------------------------------------------------
  let audioCtx = null;
  let isSoundMuted = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  window.playScoopSound = function () {
    if (isSoundMuted) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      // Pitch drop from 520Hz to 240Hz (sweet bubble pop)
      osc.frequency.setValueAtTime(540, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.13);
    } catch (e) {
      // Audio not permitted yet
    }
  };

  window.playChimeSound = function () {
    if (isSoundMuted) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
      freqs.forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, audioCtx.currentTime + i * 0.05);

        gain.gain.setValueAtTime(0.08, audioCtx.currentTime + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.05 + 0.25);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + i * 0.05);
        osc.stop(audioCtx.currentTime + i * 0.05 + 0.26);
      });
    } catch (e) {}
  };

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      isSoundMuted = !isSoundMuted;
      soundToggleBtn.innerHTML = isSoundMuted
        ? '<i data-lucide="volume-x"></i>'
        : '<i data-lucide="volume-2"></i>';
      if (window.lucide) lucide.createIcons();

      if (!isSoundMuted) {
        window.playChimeSound();
        showToast('🔊 Sound Enabled', 'Pleasant parlor pops & scoops turned on!');
      } else {
        showToast('🔇 Sound Muted', 'Audio effects are silenced.');
      }
    });
  }

  // -------------------------------------------------------------
  // 2. Toast Notification System
  // -------------------------------------------------------------
  const toast = document.getElementById('toast-notification');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');
  let toastTimer = null;

  window.showToast = function (title, desc) {
    if (!toast) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastDesc) toastDesc.textContent = desc;

    toast.classList.add('active');
    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove('active');
    }, 3800);
  };

  // -------------------------------------------------------------
  // 3. Theme & Flavor Switcher
  // -------------------------------------------------------------
  const flavorDots = document.querySelectorAll('.flavor-dot');
  flavorDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      initAudio();
      const flavor = dot.getAttribute('data-flavor');

      flavorDots.forEach((d) => d.classList.remove('active'));
      dot.classList.add('active');

      if (flavor === 'strawberry') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', flavor);
      }

      if (window.updateConeFlavors) {
        window.updateConeFlavors(flavor);
      }

      window.playScoopSound();
      showToast(
        `🍨 Flavor: ${flavor.charAt(0).toUpperCase() + flavor.slice(1)}`,
        'Theme colors updated across the parlor!'
      );
    });
  });

  // -------------------------------------------------------------
  // 4. Interactive Hobby Cards
  // -------------------------------------------------------------
  // Hobby 1: Swatch Mixer
  const swatches = document.querySelectorAll('.mixer-circle');
  swatches.forEach((sw) => {
    sw.addEventListener('click', () => {
      const col = sw.getAttribute('data-color');
      window.playScoopSound();
      showToast('🎨 Palette Selected', `Durga's aesthetic accent: ${col}`);
    });
  });

  // Hobby 2: Useless Software Idea Generator
  const uselessBtn = document.getElementById('btn-useless-generator');
  const uselessDisplay = document.getElementById('useless-display-box');

  const uselessIdeas = [
    '☕ Chai-Driven-Development Tracker: Automatically triggers a Slack alert if Durga goes 90 minutes without tea.',
    '⚡ Git Commit Watt-O-Meter: Computes how many milliwatts of electricity your recursive loop wasted.',
    '🎷 Kafka Partition Jukebox: Streams smooth elevator jazz every time an event gets dead-lettered.',
    '☸️ Kubernetes Pod of Procrastination: An auto-scaling pod that does nothing except respond "Thinking..." with a 200 OK.',
    '🥔 Digital Potato Server: A REST API that accepts image uploads and responds: "Yes, this is potato."',
    '📉 Negative Productivity Stock Market: Trades stocks based on how many unread emails you ignore in a day.',
    '🏓 Ping-Pong Microservice: Two Docker containers bouncing HTTP 418 (I\'m a teapot) back and forth indefinitely.'
  ];

  if (uselessBtn && uselessDisplay) {
    uselessBtn.addEventListener('click', () => {
      initAudio();
      const randomIdea = uselessIdeas[Math.floor(Math.random() * uselessIdeas.length)];
      uselessDisplay.style.display = 'block';
      uselessDisplay.textContent = randomIdea;
      window.playChimeSound();
      if (window.triggerSprinkleShower) window.triggerSprinkleShower();
    });
  }

  // Hobby 3: Reading Shelf Book Clicks
  const bookPills = document.querySelectorAll('.book-pill');
  const bookQuotes = {
    'Designing Data-Intensive Applications': '"Reliability is continuing to work correctly even when things go wrong." — Martin Kleppmann',
    'Building Microservices': '"Make your microservices loose in coupling and high in cohesion." — Sam Newman',
    'Project Hail Mary': '"Humanity will survive because of science, grit, and a little bit of alien friendship." — Andy Weir'
  };

  bookPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const book = pill.getAttribute('data-book');
      const quote = bookQuotes[book] || 'A fascinating read on distributed architecture!';
      window.playScoopSound();
      showToast(`📖 ${book}`, quote);
    });
  });

  // -------------------------------------------------------------
  // 5. Tech Stack Filtering
  // -------------------------------------------------------------
  const techFilters = document.querySelectorAll('.tech-filter-btn');
  const techCards = document.querySelectorAll('.tech-card');

  techFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      techFilters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      window.playScoopSound();

      techCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          if (window.gsap) {
            gsap.fromTo(card, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35 });
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------
  // 6. Projects ("Flavor Menu") Filtering & Modal
  // -------------------------------------------------------------
  const projectFilters = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      projectFilters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      window.playScoopSound();

      projectCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          if (window.gsap) {
            gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Project Architecture Modal
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalFlavor = document.getElementById('modal-flavor');
  const modalDescription = document.getElementById('modal-description');
  const modalStack = document.getElementById('modal-stack');
  const modalDeepDive = document.getElementById('modal-deep-dive');

  const projectDetails = {
    kafka: {
      title: 'KafkaStream Hub (Distributed Event Processing Engine)',
      flavor: 'Double Espresso Crunch ☕',
      desc: 'High-throughput event-driven microservices pipeline processing 50k+ events/sec with fault-tolerant partitioned consumer groups and real-time metric dashboards.',
      stack: ['GoLang 1.22', 'Apache Kafka', 'Docker', 'Prometheus', 'Grafana', 'Redis'],
      deepDive: `
        <h4>Architecture Highlights:</h4>
        <ul style="margin-left: 1.25rem; margin-top: 0.5rem; line-height: 1.8;">
          <li>Configured 12 partitioned Kafka topics with replicated broker clusters to prevent message loss.</li>
          <li>Implemented idempotent consumer groups in Go with manual offset commit protocols.</li>
          <li>Sub-15ms end-to-end processing latency verified with synthetic load generators.</li>
          <li>Integrated Prometheus scrape metrics for lag monitoring and partition health.</li>
        </ul>
      `
    },
    spring: {
      title: 'SpringCloud K8s Mesh (Resilient Microservices Platform)',
      flavor: 'Mint Choco-Cluster 🍃',
      desc: 'Enterprise-grade microservices architecture powered by Java 17 and Spring Boot 3 with Kubernetes ingress routing, distributed tracing, and circuit breakers.',
      stack: ['Java 17', 'Spring Boot 3', 'Kubernetes', 'PostgreSQL', 'Resilience4j', 'Helm'],
      deepDive: `
        <h4>Architecture Highlights:</h4>
        <ul style="margin-left: 1.25rem; margin-top: 0.5rem; line-height: 1.8;">
          <li>Automated service discovery and config-maps deployed seamlessly across Minikube / GKE.</li>
          <li>Resilience4j circuit breakers prevent cascading failures when downstream services degrade.</li>
          <li>OpenTelemetry + Zipkin tracing for end-to-end request correlation IDs across microservice hops.</li>
          <li>Database connection pooling with HikariCP optimized for high concurrent transaction loads.</li>
        </ul>
      `
    },
    aiml: {
      title: 'AI Signal Sense (ENTC + ML Audio & Telemetry Classifier)',
      flavor: 'Blueberry Neural Swirl 🫐',
      desc: 'Bridging ENTC signal processing fundamentals with modern deep learning to filter noise and classify anomalous RF/sensor telemetry waveforms in real-time.',
      stack: ['Python', 'FastAPI', 'PyTorch', 'NumPy', 'Docker', 'Scipy'],
      deepDive: `
        <h4>Architecture Highlights:</h4>
        <ul style="margin-left: 1.25rem; margin-top: 0.5rem; line-height: 1.8;">
          <li>Fast Fourier Transform (FFT) spectrogram preprocessing to extract frequency-domain features.</li>
          <li>1D Convolutional Neural Network (CNN) achieving 94.8% anomaly detection accuracy on noisy signals.</li>
          <li>FastAPI microservice packaged in lightweight alpine Docker image with ONNX runtime inference.</li>
        </ul>
      `
    },
    useless: {
      title: 'The Overengineered Excuse Generator & Chai-O-Meter',
      flavor: 'Rainbow Sprinkle Madness 🌈',
      desc: 'Concurrently computes how many watts of electricity your git commit wasted and generates mathematically sound excuses for failed CI/CD pipelines.',
      stack: ['GoLang', 'WebSockets', 'Canvas API', 'Redis Pub/Sub', 'Tailwind CSS'],
      deepDive: `
        <h4>Architecture Highlights:</h4>
        <ul style="margin-left: 1.25rem; margin-top: 0.5rem; line-height: 1.8;">
          <li>Over-engineered with 10,000 goroutines to simulate non-blocking excuse generation.</li>
          <li>WebSocket channel streaming live tea/chai consumption telemetry.</li>
          <li>100% bugs, 0% enterprise utility, 1000% pure dopamine and laughter.</li>
        </ul>
      `
    },
    gitpulse: {
      title: 'DevOps GitPulse (Automated CI/CD GitOps Pipeline)',
      flavor: 'Vanilla Bean Infrastructure 🍦',
      desc: 'End-to-end GitOps deployment pipeline with automated unit testing, vulnerability scanning (Trivy), multi-stage Docker builds, and zero-downtime rolling updates.',
      stack: ['GitHub Actions', 'Docker', 'ArgoCD', 'Kubernetes', 'Trivy', 'Bash'],
      deepDive: `
        <h4>Architecture Highlights:</h4>
        <ul style="margin-left: 1.25rem; margin-top: 0.5rem; line-height: 1.8;">
          <li>Multi-stage Docker builds reducing image size by 74% (from 450MB down to 115MB).</li>
          <li>Automated vulnerability scanning in CI triggering blockers on critical CVEs.</li>
          <li>ArgoCD synchronizing declarative K8s manifests with zero-downtime rolling deploys.</li>
        </ul>
      `
    }
  };

  document.querySelectorAll('.btn-view-deepdive').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-project');
      const data = projectDetails[key];
      if (!data || !modalOverlay) return;

      modalTitle.textContent = data.title;
      modalFlavor.textContent = data.flavor;
      modalDescription.textContent = data.desc;

      modalStack.innerHTML = data.stack
        .map((s) => `<span class="tech-tag-pill">${s}</span>`)
        .join('');

      modalDeepDive.innerHTML = data.deepDive;

      modalOverlay.classList.add('active');
      window.playChimeSound();
    });
  });

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // -------------------------------------------------------------
  // 7. Contact Parlor Form Handling
  // -------------------------------------------------------------
  const contactForm = document.getElementById('contact-parlor-form');
  const flavorRadios = document.querySelectorAll('.flavor-radio-tag');

  flavorRadios.forEach((tag) => {
    tag.addEventListener('click', () => {
      flavorRadios.forEach((t) => t.classList.remove('selected'));
      tag.classList.add('selected');
      const input = tag.querySelector('input');
      if (input) input.checked = true;
      window.playScoopSound();
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      initAudio();

      const name = document.getElementById('contact-name')?.value || 'Friend';
      const email = document.getElementById('contact-email')?.value || '';

      window.playChimeSound();
      if (window.triggerSprinkleShower) window.triggerSprinkleShower();

      showToast(
        `🍨 Order Placed, ${name}!`,
        `Durga received your note and will reply to ${email} with a fresh scoop!`
      );

      contactForm.reset();
    });
  }

  // Copy Email Button
  const copyEmailBtn = document.getElementById('btn-copy-email');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('durgakhadbade@gmail.com').then(() => {
        window.playScoopSound();
        showToast('📬 Email Copied!', 'durgakhadbade@gmail.com copied to your clipboard.');
        if (window.triggerSprinkleShower) window.triggerSprinkleShower();
      });
    });
  }

  // -------------------------------------------------------------
  // 8. Mobile Navigation Toggle
  // -------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavDrawer.classList.toggle('active');
    });

    mobileNavDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('active');
      });
    });
  }

  // -------------------------------------------------------------
  // 9. GSAP Entry & ScrollTrigger Animations
  // -------------------------------------------------------------
  if (window.gsap) {
    gsap.from('.hero-badge-wrap', { opacity: 0, y: -20, duration: 0.8, delay: 0.2, ease: 'back.out(1.7)' });
    gsap.from('.hero-title', { opacity: 0, y: 30, duration: 0.8, delay: 0.4, ease: 'power3.out' });
    gsap.from('.hero-headline', { opacity: 0, y: 20, duration: 0.7, delay: 0.6, ease: 'power3.out' });
    gsap.from('.hero-description', { opacity: 0, y: 20, duration: 0.7, delay: 0.7, ease: 'power3.out' });
    gsap.from('.hero-actions', { opacity: 0, y: 20, duration: 0.7, delay: 0.85, ease: 'back.out(1.5)' });
    gsap.from('.stat-item', { opacity: 0, y: 20, duration: 0.6, delay: 1.0, stagger: 0.15, ease: 'power2.out' });
  }

  // -------------------------------------------------------------
  // 10. Lucide Icons Setup
  // -------------------------------------------------------------
  if (window.lucide) {
    lucide.createIcons();
  }
})();
