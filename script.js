document.addEventListener('DOMContentLoaded', function () {
  // 1. MENU MOBILE
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');

      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Buka menu');
      });
    });
  }

  // 2. EFEK HEADER SAAT SCROLL
  const header = document.querySelector('.site-header');

  function updateHeader() {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }
  }

  window.addEventListener('scroll', updateHeader);
  updateHeader();

  // 3. NAVIGASI AKTIF
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
              link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
            });
          }
        });
      },
      {
        rootMargin: '-25% 0px -65% 0px',
      },
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // 4. ANIMASI KEMUNCULAN KONTEN
  const animatedElements = document.querySelectorAll(
    '.intro-grid, .news-card, .org-list > div, .doc-row, .contact > div, .history-intro, .ideology-card',
    '.intro-grid, .news-card, .org-list > div, .doc-row, .contact > div, .history-intro, .ideology-card, .agenda-card',
  );

  if ('IntersectionObserver' in window) {
    animatedElements.forEach(function (element) {
      element.classList.add('reveal');
    });

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      },
    );

    animatedElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  }

  // 5. TOMBOL KEMBALI KE ATAS
  const backToTop = document.createElement('button');

  backToTop.className = 'back-to-top';
  backToTop.innerHTML = '↑';
  backToTop.setAttribute('aria-label', 'Kembali ke atas');

  document.body.appendChild(backToTop);

  window.addEventListener('scroll', function () {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });

  backToTop.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // 6. PENCARIAN DAN FILTER BERITA

  const newsSearch = document.getElementById('newsSearch');
  const newsFilters = document.querySelectorAll('.news-filter');
  const newsCards = document.querySelectorAll('.news-card-premium');
  const newsEmpty = document.getElementById('newsEmpty');

  let selectedCategory = 'semua';

  function filterNews() {
    const keyword = newsSearch.value.toLowerCase().trim();
    let visibleCount = 0;

    newsCards.forEach(function (card) {
      const category = card.dataset.category;
      const title = card.dataset.title.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();

      const matchesCategory = selectedCategory === 'semua' || category === selectedCategory;

      const matchesKeyword = title.includes(keyword) || description.includes(keyword);

      const visible = matchesCategory && matchesKeyword;

      card.hidden = !visible;

      if (visible) visibleCount++;
    });

    newsEmpty.hidden = visibleCount !== 0;
  }

  if (newsSearch) {
    newsSearch.addEventListener('input', filterNews);
  }

  newsFilters.forEach(function (button) {
    button.addEventListener('click', function () {
      selectedCategory = button.dataset.category;

      newsFilters.forEach(function (item) {
        item.classList.toggle('active', item === button);
      });

      filterNews();
    });
  });

  // 7. DETAIL ARTIKEL

  const articles = {
    konfercab: {
      category: 'ORGANISASI',
      title: 'Konferensi Cabang GMNI Seram Bagian Barat',
      body: `
        <p>
          Konferensi Cabang merupakan forum organisasi untuk
          mengevaluasi perjalanan kepengurusan, membahas arah
          perjuangan, serta menjalankan mekanisme regenerasi
          kepemimpinan organisasi.
        </p>
        <p>
          Halaman publikasi ini disiapkan sebagai ruang dokumentasi
          kegiatan dan informasi resmi DPC GMNI Seram Bagian Barat.
        </p>
        <p><strong>Catatan:</strong> Naskah ini merupakan contoh
        tampilan dan perlu dilengkapi informasi kegiatan yang
        telah diverifikasi.</p>
      `,
    },

    kaderisasi: {
      category: 'KADERISASI',
      title: 'Kaderisasi dan pembentukan karakter kader',
      body: `
        <p>
          Kaderisasi merupakan bagian penting dalam proses
          pembelajaran organisasi. Di dalamnya, kader mengembangkan
          pengetahuan, tanggung jawab, dan kemampuan kepemimpinan.
        </p>
        <p>
          Materi dan dokumentasi kegiatan kaderisasi DPC GMNI
          Seram Bagian Barat akan dipublikasikan setelah
          mendapatkan verifikasi organisasi.
        </p>
      `,
    },

    pergerakan: {
      category: 'PERGERAKAN',
      title: 'Mahasiswa dan tanggung jawab sosial',
      body: `
        <p>
          Mahasiswa memiliki ruang untuk mempelajari persoalan
          masyarakat, mengembangkan pemikiran kritis, dan
          berpartisipasi dalam kehidupan sosial.
        </p>
        <p>
          Artikel ini merupakan contoh tampilan publikasi.
          Gagasan resmi organisasi perlu melalui proses
          penyuntingan dan persetujuan yang sesuai.
        </p>
      `,
    },
  };

  const articleModal = document.getElementById('articleModal');

  document.querySelectorAll('.read-article').forEach(function (button) {
    button.addEventListener('click', function () {
      const article = articles[button.dataset.article];

      if (!article || !articleModal) return;

      document.getElementById('articleCategory').textContent = article.category;

      document.getElementById('articleTitle').textContent = article.title;

      document.getElementById('articleBody').innerHTML = article.body;

      articleModal.classList.add('open');
      articleModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeArticle() {
    if (!articleModal) return;

    articleModal.classList.remove('open');
    articleModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-close-modal]').forEach(function (button) {
    button.addEventListener('click', closeArticle);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeArticle();
  });
});
