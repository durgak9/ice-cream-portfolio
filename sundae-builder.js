/**
 * Interactive "Build Your Own Architectural Sundae"
 * Playful micro-app allowing visitors to stack scoops of Durga's tech stack,
 * add architectural drizzles, and generate an uptime-guaranteed recipe card!
 */

(function () {
  const stackContainer = document.getElementById('visual-scoop-stack');
  const recipeTitle = document.getElementById('sundae-recipe-title');
  const recipeDesc = document.getElementById('sundae-recipe-desc');
  const copyRecipeBtn = document.getElementById('btn-copy-recipe');
  const randomSundaeBtn = document.getElementById('btn-random-sundae');

  if (!stackContainer) return;

  const sundaeState = {
    base: 'Java Spring Boot',
    middle: 'Apache Kafka',
    top: 'Kubernetes Cluster',
    drizzle: 'Zero-Downtime CI/CD'
  };

  const flavorMeta = {
    'Java Spring Boot': { color: '#FF85A1', label: '☕ Spring Boot Scoop', desc: 'Enterprise stability with low garbage-collection latency.' },
    'GoLang 1.22': { color: '#70E4D5', label: '⚡ GoLang Scoop', desc: 'Ultra-concurrent goroutines serving 100k requests/sec.' },
    'Apache Kafka': { color: '#A29BFE', label: '📨 Kafka Stream Scoop', desc: 'Fault-tolerant partitioned distributed log architecture.' },
    'Postgres + Redis': { color: '#FFEAA7', label: '🗄️ Cache & DB Scoop', desc: 'ACID compliance backed by sub-millisecond in-memory cache.' },
    'Kubernetes Cluster': { color: '#55EFC4', label: '☸️ K8s Cloud Scoop', desc: 'Self-healing, auto-scaling containerized mesh.' },
    'AI / ML Sense': { color: '#FF7675', label: '🧠 Neural Audio Scoop', desc: 'ENTC signal telemetry classification with PyTorch.' }
  };

  function updateSundaeVisuals() {
    stackContainer.innerHTML = '';

    // Render Scoops from base to top
    const scoops = [sundaeState.base, sundaeState.middle, sundaeState.top];

    scoops.forEach((flavor, index) => {
      const meta = flavorMeta[flavor] || { color: '#FF85A1', label: flavor };
      const scoopEl = document.createElement('div');
      scoopEl.className = 'sundae-scoop-item';
      scoopEl.style.backgroundColor = meta.color;
      scoopEl.style.zIndex = index + 2;
      scoopEl.innerHTML = `<span>${meta.label}</span>`;
      stackContainer.appendChild(scoopEl);
    });

    // Update Recipe Title & Description
    if (recipeTitle && recipeDesc) {
      recipeTitle.textContent = `${sundaeState.base} & ${sundaeState.top} Sundae`;
      recipeDesc.textContent = `A delicious high-concurrency architecture layered with ${sundaeState.middle} and drizzled with ${sundaeState.drizzle}. 99.99% sweet uptime guaranteed!`;
    }

    if (window.playScoopSound) window.playScoopSound();
  }

  // Setup Button Click Handlers
  const optionButtons = document.querySelectorAll('.sundae-opt-btn');
  optionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const step = btn.getAttribute('data-step');
      const val = btn.getAttribute('data-val');

      // Update active state in this group
      const parent = btn.parentElement;
      parent.querySelectorAll('.sundae-opt-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      if (step === 'base') sundaeState.base = val;
      if (step === 'middle') sundaeState.middle = val;
      if (step === 'top') sundaeState.top = val;
      if (step === 'drizzle') sundaeState.drizzle = val;

      updateSundaeVisuals();
    });
  });

  // Randomize Chef's Special
  if (randomSundaeBtn) {
    randomSundaeBtn.addEventListener('click', () => {
      const bases = ['Java Spring Boot', 'GoLang 1.22'];
      const middles = ['Apache Kafka', 'Postgres + Redis'];
      const tops = ['Kubernetes Cluster', 'AI / ML Sense'];
      const drizzles = ['Zero-Downtime CI/CD', 'Prometheus Metrics', 'Kafka Topic Partitioning'];

      sundaeState.base = bases[Math.floor(Math.random() * bases.length)];
      sundaeState.middle = middles[Math.floor(Math.random() * middles.length)];
      sundaeState.top = tops[Math.floor(Math.random() * tops.length)];
      sundaeState.drizzle = drizzles[Math.floor(Math.random() * drizzles.length)];

      // Sync button active classes
      optionButtons.forEach((btn) => {
        const step = btn.getAttribute('data-step');
        const val = btn.getAttribute('data-val');
        if (sundaeState[step] === val) {
          btn.classList.add('active');
        } else if (step) {
          btn.classList.remove('active');
        }
      });

      updateSundaeVisuals();
      if (window.triggerSprinkleShower) window.triggerSprinkleShower();
      if (window.showToast) {
        window.showToast('🍨 Special Recipe Whipped Up!', 'Durga concocted a fresh architectural masterpiece.');
      }
    });
  }

  // Copy Recipe Card
  if (copyRecipeBtn) {
    copyRecipeBtn.addEventListener('click', () => {
      const summary = `🍦 Durga's Architectural Sundae:\n• Base: ${sundaeState.base}\n• Stream: ${sundaeState.middle}\n• Cloud: ${sundaeState.top}\n• Sauce: ${sundaeState.drizzle}\n\nBuilt by Durga Khadbade (Backend & Cloud Engineer) | 99.99% Uptime!`;
      navigator.clipboard.writeText(summary).then(() => {
        if (window.showToast) {
          window.showToast('📋 Recipe Copied!', 'Architecture specs copied to your clipboard.');
        }
        if (window.triggerSprinkleShower) window.triggerSprinkleShower();
      });
    });
  }

  // Initial render
  updateSundaeVisuals();
})();
