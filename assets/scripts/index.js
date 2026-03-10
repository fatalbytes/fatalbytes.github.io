    const YEARS = [

    ];
    const TOPICS = [

    ];

    const POSTS = [

    ];
    const TOPIC_MAP = Object.fromEntries(TOPICS.map(t => [t.value, t.label]));

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

    function glitchReveal(element, finalText, delay = 0) {
      setTimeout(() => {
        let iter = 0;
        const iv = setInterval(() => {
          element.textContent = finalText
            .split('')
            .map((ch, i) => {
              if (i < iter) return finalText[i];
              if (ch === ' ') return ' ';
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
          if (iter >= finalText.length) {
            clearInterval(iv);
            element.textContent = finalText;
          }
          iter += 0.5;
        }, 25);
      }, delay);
    }


    function makeBtn(value, type, label, isAll = false) {
      const btn = document.createElement('button');
      btn.className      = 'filter-btn' + (isAll ? ' active' : '');
      btn.dataset.filter = value;
      btn.dataset.type   = type;
      btn.textContent    = label;
      return btn;
    }

    function buildFilters() {
      const yearContainer  = document.getElementById('year-filters');
      const topicContainer = document.getElementById('topic-filters');

      yearContainer.appendChild(makeBtn('all', 'year', 'All Years', true));
      YEARS.forEach(y => yearContainer.appendChild(makeBtn(y.value, 'year', y.label)));

      topicContainer.appendChild(makeBtn('all', 'topic', 'All Topics', true));
      TOPICS.forEach(t => topicContainer.appendChild(makeBtn(t.value, 'topic', t.label)));
    }


    function renderPosts() {
      const grid = document.getElementById('posts-grid');
      grid.innerHTML = '';

      POSTS.forEach((post, idx) => {
        const topics = Array.isArray(post.topics) ? post.topics : [post.topics];

        const a = document.createElement('a');
        a.href              = post.href;
        a.className         = 'post-card';
        a.dataset.year      = post.year;
        a.dataset.topics    = JSON.stringify(topics);
        const topicTags = topics
          .map(t => `<span class="post-tag topic">${TOPIC_MAP[t] ?? t}</span>`)
          .join('');

        a.innerHTML = `
          <div class="post-meta">
            <span class="post-tag year">${post.year}</span>
            ${topicTags}
          </div>
          <h2 class="post-title">${post.title}</h2>
          <p class="post-excerpt">${post.excerpt}</p>
          <time class="post-date">${post.date}</time>
        `;

        grid.appendChild(a);
        glitchReveal(a.querySelector('.post-title'), post.title, idx * 80);
      });
    }
    
    let activeFilters = { year: 'all', topic: 'all' };

    function applyFilters() {
      const cards = document.querySelectorAll('.post-card');
      let visible = 0;

      cards.forEach(card => {
        const cardTopics = JSON.parse(card.dataset.topics || '[]');
        const yearOk  = activeFilters.year  === 'all' || card.dataset.year === activeFilters.year;
        const topicOk = activeFilters.topic === 'all' || cardTopics.includes(activeFilters.topic);

        if (yearOk && topicOk) {
          card.classList.remove('hidden');
          visible++;
        } else {
          card.classList.add('hidden');
        }
      });

      document.getElementById('empty-state').classList.toggle('visible', visible === 0);

      const total = POSTS.length;
      const countEl = document.getElementById('posts-count');
      countEl.innerHTML = visible === total
        ? `Showing <span>all ${total}</span> posts`
        : `Showing <span>${visible}</span> of ${total} posts`;
    }

    function setupFilterListeners() {
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          this.closest('.filter-buttons')
              .querySelectorAll('.filter-btn')
              .forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          activeFilters[this.dataset.type] = this.dataset.filter;
          applyFilters();
        });
      });
    }


    function animateHero() {
      const el = document.getElementById('hero-title');
      if (!el) return;
      let iter = 0;
      const finalText = 'Fatal Bytes';
      const iv = setInterval(() => {
        el.textContent = finalText
          .split('')
          .map((ch, i) => {
            if (i < iter) return finalText[i];
            if (ch === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        if (iter >= finalText.length) {
          clearInterval(iv);
          el.textContent = finalText;
          el.setAttribute('data-text', finalText);
          el.classList.add('active');
          setTimeout(() => el.classList.remove('active'), 1500);
        }
        iter += 1/3;
      }, 30);
    }

 
    document.addEventListener('DOMContentLoaded', () => {
      animateHero();
      buildFilters();
      renderPosts();
      setupFilterListeners();
      applyFilters();
    });
