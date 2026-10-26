/**
 * Jevon Aditya - Personal Portfolio JS
 * Modern, high-performance, and feature-rich interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. PRELOADER & LOADING BAR
       ========================================================================== */
    const preloader = document.getElementById('preloader');
    
    // Matikan preloader setelah halaman sepenuhnya dimuat
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('fade-out');
                // Hapus dari DOM setelah transisi selesai agar tidak mengganggu interaksi
                setTimeout(() => preloader.remove(), 800);
            }
        }, 1500); // Memberikan efek transisi yang menyenangkan
    });

    // Fallback jika window load terlalu lama atau terhambat
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.remove(), 800);
        }
    }, 4000);

    /* ==========================================================================
       2. INTERACTIVE CANVAS PARTICLE SYSTEM
       ========================================================================== */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        let mouse = {
            x: null,
            y: null,
            radius: 120 // Radius interaksi mouse
        };

        // Resize Canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Track Mouse
        window.addEventListener('mousemove', (event) => {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Particle Blueprint
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            // Draw Particle
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            // Update Particle Position and Boundaries
            update() {
                // Check boundaries and reverse direction if needed
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                // Move Particle
                this.x += this.directionX;
                this.y += this.directionY;

                // Mouse interactive movement (push effect)
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius + this.size) {
                        if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                            this.x += 1.5;
                        }
                        if (mouse.x > this.x && this.x > this.size * 10) {
                            this.x -= 1.5;
                        }
                        if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                            this.y += 1.5;
                        }
                        if (mouse.y > this.y && this.y > this.size * 10) {
                            this.y -= 1.5;
                        }
                    }
                }

                this.draw();
            }
        }

        // Initialize Particle Group
        function initParticles() {
            particlesArray = [];
            let numberOfParticles = Math.floor((canvas.width * canvas.height) / 13000); // Kepadatan dinamis
            if (numberOfParticles > 90) numberOfParticles = 90; // Batas atas demi performa

            for (let i = 0; i < numberOfParticles; i++) {
                let size = Math.random() * 2 + 1; // 1px - 3px
                let x = Math.random() * (canvas.width - size * 2) + size;
                let y = Math.random() * (canvas.height - size * 2) + size;
                
                // Kecepatan yang pelan dan halus
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                
                // Warna partikel semi-transparan
                let color = 'rgba(59, 130, 246, 0.25)'; // Biru pudar
                if (Math.random() > 0.5) color = 'rgba(34, 211, 238, 0.25)'; // Cyan pudar
                
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Connect Particles with Lines
        function connectParticles() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let dx = particlesArray[a].x - particlesArray[b].x;
                    let dy = particlesArray[a].y - particlesArray[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    // Batas jarak koneksi antar partikel (90px)
                    if (distance < 90) {
                        opacityValue = 1 - (distance / 90);
                        ctx.strokeStyle = `rgba(59, 130, 246, ${opacityValue * 0.12})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation Loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connectParticles();
            requestAnimationFrame(animate);
        }

        initParticles();
        animate();

        // Re-initialize on screen resize
        window.addEventListener('resize', () => {
            initParticles();
        });
    }

    /* ==========================================================================
       3. FLOATING NAVBAR, MOB NAV, & SCROLL INDICATOR
       ========================================================================== */
    const header = document.getElementById('main-header');
    const scrollProgress = document.getElementById('scroll-progress');
    const menuToggle = document.getElementById('menu-toggle-btn');
    const mobileNav = document.getElementById('mobile-nav-menu');
    const backToTopBtn = document.getElementById('back-to-top-btn');

    // Scroll Events
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Update Scroll Progress Bar
        if (docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        }

        // Scrolled Header Effect
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Show/Hide Back to Top Button
        if (scrollTop > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Mobile Menu Toggle
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        // Close Mobile Menu on Link Click
        const mobileLinks = mobileNav.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
    }

    // Scroll Smooth Back to Top
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       4. SCROLL REVEAL ANIMATION & SCROLL SPY
       ========================================================================== */
    const reveals = document.querySelectorAll('.reveal');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    const sections = document.querySelectorAll('section');

    // Reveal elements on scroll using Intersection Observer
    const revealObserverOptions = {
        root: null,
        threshold: 0.1, // memicu animasi ketika 10% elemen masuk viewport
        rootMargin: '0px 0px -50px 0px' // pemicu sedikit sebelum elemen sejajar viewport
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                // Hentikan pengamatan setelah teranimasi sekali
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    // Scroll Spy: Sorot navigasi aktif saat menscroll halaman
    const spyObserverOptions = {
        root: null,
        threshold: 0.35, // memicu bila 35% section berada di tengah screen
        rootMargin: '-10% 0px -40% 0px'
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, spyObserverOptions);

    sections.forEach(section => {
        spyObserver.observe(section);
    });

    /* ==========================================================================
       5. CERTIFICATE LIGHTBOX MODAL
       ========================================================================== */
    const certCards = document.querySelectorAll('.certificate-card');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxClose = document.getElementById('lightbox-close-btn');
    const lightboxImg = document.getElementById('lightbox-main-img');
    const lightboxCaption = document.getElementById('lightbox-caption-text');

    if (certCards && lightboxModal && lightboxClose && lightboxImg) {
        certCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('.cert-thumbnail');
                const title = card.querySelector('.cert-title').textContent;
                const issuer = card.querySelector('.cert-issuer').textContent;
                
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    lightboxCaption.textContent = `${title} — ${issuer}`;
                    
                    lightboxModal.classList.add('active');
                    lightboxModal.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden'; // Kunci scroll halaman
                }
            });
        });

        const closeLightbox = () => {
            lightboxModal.classList.remove('active');
            lightboxModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Aktifkan kembali scroll
        };

        lightboxClose.addEventListener('click', closeLightbox);
        
        // Tutup jika mengklik latar belakang hitam
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });

        // Tutup dengan tombol Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    /* ==========================================================================
       6. PROJECT DETAIL MODAL — CAROUSEL / SLIDESHOW
       ========================================================================== */
    const projectModal      = document.getElementById('project-modal');
    const projectModalClose = document.getElementById('project-modal-close-btn');
    const projectModalTag   = document.getElementById('project-modal-tag');
    const projectModalTitle = document.getElementById('project-modal-title');
    const projectModalDesc  = document.getElementById('project-modal-desc');
    const projectModalTech  = document.getElementById('project-modal-tech');
    const carouselTrack     = document.getElementById('carousel-track');
    const carouselDots      = document.getElementById('carousel-dots');
    const carouselThumbs    = document.getElementById('carousel-thumbs');
    const carouselPrev      = document.getElementById('carousel-prev');
    const carouselNext      = document.getElementById('carousel-next');
    const carouselCounter   = document.getElementById('carousel-counter');
    const carouselCaption   = document.getElementById('carousel-caption-badge');

    let currentSlide  = 0;
    let totalSlides   = 0;
    let currentLabels = [];
    let touchStartX   = 0;
    let touchEndX     = 0;

    // ---------- helpers ----------
    function goToSlide(idx) {
        if (totalSlides === 0) return;
        currentSlide = (idx + totalSlides) % totalSlides;

        // Geser track
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update dots
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });

        // Update thumbnails
        document.querySelectorAll('.carousel-thumb').forEach((th, i) => {
            const isActive = i === currentSlide;
            th.classList.toggle('active', isActive);
            if (isActive) {
                th.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });

        // Counter murni angka (contoh: 1 / 5)
        if (carouselCounter) {
            carouselCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
        }

        // Caption badge fitur / role (Admin Web vs Penyewa Mobile)
        if (carouselCaption) {
            const currentLabel = (currentLabels && currentLabels[currentSlide]) ? currentLabels[currentSlide] : '';
            if (currentLabel.includes('Admin (Web)')) {
                const cleanText = currentLabel.replace(/Admin\s*\(Web\)\s*[-:]?\s*/i, '').trim();
                carouselCaption.innerHTML = `<span class="badge-role-tag badge-admin">Admin (Web)</span> <span>${cleanText}</span>`;
            } else if (currentLabel.includes('Penyewa (Mobile)')) {
                const cleanText = currentLabel.replace(/Penyewa\s*\(Mobile\)\s*[-:]?\s*/i, '').trim();
                carouselCaption.innerHTML = `<span class="badge-role-tag badge-mobile">Penyewa (Mobile)</span> <span>${cleanText}</span>`;
            } else {
                carouselCaption.textContent = currentLabel;
            }
            carouselCaption.style.display = currentLabel ? 'inline-flex' : 'none';
        }

        // Sembunyikan prev/next jika hanya 1 gambar
        const showNav = totalSlides > 1;
        if (carouselPrev) carouselPrev.style.display = showNav ? '' : 'none';
        if (carouselNext) carouselNext.style.display = showNav ? '' : 'none';
        if (carouselCounter) carouselCounter.style.display = showNav ? '' : 'none';
    }
1
    function buildCarousel(images, altText = 'Foto Fitur', labels = []) {
        if (!carouselTrack || !carouselDots || !carouselThumbs) return;

        currentSlide  = 0;
        totalSlides   = images.length;
        currentLabels = Array.isArray(labels) ? labels : [];

        // --- Track slides (murni foto, tanpa overlay teks) ---
        carouselTrack.innerHTML = '';
        carouselTrack.style.transform = 'translateX(0)';
        images.forEach((src, i) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';

            const img = document.createElement('img');
            img.src = src;
            const lbl = (currentLabels && currentLabels[i]) ? currentLabels[i] : `${altText} — foto ${i + 1}`;
            img.alt = lbl;
            img.loading = i === 0 ? 'eager' : 'lazy';

            // Cek apakah gambar merupakan tampilan single mobile (portrait)
            const isPortraitMobile = ((lbl && lbl.includes('Mobile')) || src.includes('mobile')) && !src.includes('pembayaran');
            if (isPortraitMobile) {
                img.classList.add('is-mobile-frame');
            }

            img.addEventListener('load', () => {
                if (img.naturalHeight > img.naturalWidth * 1.1) {
                    img.classList.add('is-mobile-frame');
                } else if (img.naturalWidth > img.naturalHeight * 1.2) {
                    img.classList.remove('is-mobile-frame');
                }
            });

            slide.appendChild(img);
            carouselTrack.appendChild(slide);
        });

        // --- Dots ---
        carouselDots.innerHTML = '';
        images.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Foto ${i + 1}`);
            dot.title = (currentLabels && currentLabels[i]) ? currentLabels[i] : `Foto ${i + 1}`;
            dot.addEventListener('click', () => goToSlide(i));
            carouselDots.appendChild(dot);
        });

        // --- Thumbnails (murni foto fitur) ---
        carouselThumbs.innerHTML = '';
        if (images.length > 1) {
            images.forEach((src, i) => {
                const th = document.createElement('img');
                th.src = src;
                const lbl = (currentLabels && currentLabels[i]) ? currentLabels[i] : `Thumbnail ${i + 1}`;
                th.alt = lbl;
                th.title = lbl;
                th.className = 'carousel-thumb' + (i === 0 ? ' active' : '');
                
                // Border halus pembeda role pada thumbnail
                if (lbl.includes('Mobile') || src.includes('mobile')) {
                    th.style.borderColor = 'rgba(16, 185, 129, 0.45)';
                } else if (lbl.includes('Admin') || src.includes('admin')) {
                    th.style.borderColor = 'rgba(59, 130, 246, 0.45)';
                }

                th.loading = 'lazy';
                th.addEventListener('click', () => goToSlide(i));
                carouselThumbs.appendChild(th);
            });
        }

        goToSlide(0);
    }

    // ---------- open modal from any project card ----------
    const projectCards = document.querySelectorAll('.project-card');

    function openProjectModal(card) {
        // Baca data dari attributes HTML card
        const images  = JSON.parse(card.dataset.images  || '[]');
        const labels  = JSON.parse(card.dataset.labels  || '[]');
        const tag     = card.dataset.tag   || '';
        const title   = card.dataset.title || '';
        const desc    = card.dataset.desc  || '';
        const tech    = JSON.parse(card.dataset.tech || '[]');

        // Fallback: jika tidak ada data-images, ambil gambar dari card
        if (images.length === 0) {
            const cardImg = card.querySelector('.project-image');
            if (cardImg) images.push(cardImg.src);
        }

        // Isi info panel
        if (projectModalTag)   projectModalTag.textContent   = tag;
        if (projectModalTitle) projectModalTitle.textContent = title;
        if (projectModalDesc)  projectModalDesc.textContent  = desc;

        if (projectModalTech) {
            projectModalTech.innerHTML = '';
            tech.forEach(t => {
                const span = document.createElement('span');
                span.textContent = t;
                projectModalTech.appendChild(span);
            });
        }

        // Setup Role Filter Tabs (Admin Web vs Penyewa Mobile)
        const roleFilterBar  = document.getElementById('carousel-role-filter');
        const filterAllBtn   = document.getElementById('filter-all-btn');
        const filterAdminBtn = document.getElementById('filter-admin-btn');
        const filterMobileBtn= document.getElementById('filter-mobile-btn');
        const countAll       = document.getElementById('count-all');
        const countAdmin     = document.getElementById('count-admin');
        const countMobile    = document.getElementById('count-mobile');

        const adminIndices = [];
        const mobileIndices = [];

        labels.forEach((lbl, idx) => {
            const isMob = (lbl && lbl.includes('Mobile')) || (images[idx] && images[idx].includes('mobile'));
            if (isMob) {
                mobileIndices.push(idx);
            } else {
                adminIndices.push(idx);
            }
        });

        if (roleFilterBar && adminIndices.length > 0 && mobileIndices.length > 0) {
            roleFilterBar.style.display = 'flex';
            if (countAll)    countAll.textContent    = images.length;
            if (countAdmin)  countAdmin.textContent  = adminIndices.length;
            if (countMobile) countMobile.textContent = mobileIndices.length;

            // Reset tab aktif ke 'Semua Foto'
            roleFilterBar.querySelectorAll('.role-filter-btn').forEach(b => b.classList.remove('active'));
            if (filterAllBtn) filterAllBtn.classList.add('active');

            const applyFilter = (filterType, activeBtn) => {
                roleFilterBar.querySelectorAll('.role-filter-btn').forEach(b => b.classList.remove('active'));
                activeBtn.classList.add('active');

                let filteredImages = [];
                let filteredLabels = [];

                if (filterType === 'admin') {
                    filteredImages = adminIndices.map(i => images[i]);
                    filteredLabels = adminIndices.map(i => labels[i]);
                } else if (filterType === 'mobile') {
                    filteredImages = mobileIndices.map(i => images[i]);
                    filteredLabels = mobileIndices.map(i => labels[i]);
                } else {
                    filteredImages = images;
                    filteredLabels = labels;
                }

                buildCarousel(filteredImages, title, filteredLabels);
            };

            if (filterAllBtn)    filterAllBtn.onclick    = () => applyFilter('all', filterAllBtn);
            if (filterAdminBtn)  filterAdminBtn.onclick  = () => applyFilter('admin', filterAdminBtn);
            if (filterMobileBtn) filterMobileBtn.onclick = () => applyFilter('mobile', filterMobileBtn);
        } else if (roleFilterBar) {
            roleFilterBar.style.display = 'none';
        }

        // Bangun carousel awal dengan semua foto
        buildCarousel(images, title, labels);

        // Buka modal dengan animasi zoom-in
        projectModal.classList.add('active');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    if (projectModal && projectModalClose) {
        // Buka dari tombol "Detail Proyek"
        document.querySelectorAll('.btn-project-detail').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.project-card');
                if (card) openProjectModal(card);
            });
        });

        // Buka dari klik thumbnail gambar project card
        projectCards.forEach(card => {
            const imgWrapper = card.querySelector('.project-image-wrapper');
            if (imgWrapper) {
                imgWrapper.addEventListener('click', () => openProjectModal(card));
                imgWrapper.style.cursor = 'pointer';
            }
        });

        // Prev / Next buttons
        if (carouselPrev) carouselPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
        if (carouselNext) carouselNext.addEventListener('click', () => goToSlide(currentSlide + 1));

        // Touch / Swipe support
        if (carouselTrack) {
            carouselTrack.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
            carouselTrack.addEventListener('touchend',   e => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 40) goToSlide(currentSlide + (diff > 0 ? 1 : -1));
            }, { passive: true });
        }

        // Close modal
        const closeProjectModal = () => {
            projectModal.classList.remove('active');
            projectModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        projectModalClose.addEventListener('click', closeProjectModal);
        projectModal.addEventListener('click', (e) => { if (e.target === projectModal) closeProjectModal(); });

        document.addEventListener('keydown', (e) => {
            if (!projectModal.classList.contains('active')) return;
            if (e.key === 'Escape')      closeProjectModal();
            if (e.key === 'ArrowLeft')   goToSlide(currentSlide - 1);
            if (e.key === 'ArrowRight')  goToSlide(currentSlide + 1);
        });
    }


    /* ==========================================================================
       7. CONTACT FORM SUBMISSION & NOTIFICATION TOAST
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const toastContainer = document.getElementById('toast-container');

    // Toast Generator Function
    function showToast(message, type = 'success') {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type === 'error' ? 'error' : 'success'} glass-card`;
        
        // SVG Checkmark (Success) or Cross (Error)
        let iconSvg = '';
        if (type === 'success') {
            iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
        } else {
            iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
        }

        toast.innerHTML = `
            ${iconSvg}
            <span class="toast-message">${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Hapus toast setelah 4 detik
        setTimeout(() => {
            toast.style.animation = 'none'; // reset animasi
            toast.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(15px)';
            
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 4000);
    }

    // Submit Form Event
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Mencegah submit default (pemuatan ulang halaman)
            
            const submitBtn = document.getElementById('btn-submit-contact');
            const originalBtnText = submitBtn.innerHTML;
            
            // Validasi Input Sederhana
            const nameInput = document.getElementById('form-name').value.trim();
            const emailInput = document.getElementById('form-email').value.trim();
            const subjectInput = document.getElementById('form-subject').value.trim();
            const messageInput = document.getElementById('form-message').value.trim();

            if (!nameInput || !emailInput || !subjectInput || !messageInput) {
                showToast('Harap isi semua kolom formulir!', 'error');
                return;
            }

            const whatsappNumber = '6285173432505';
            const whatsappMessage = `Halo Jevon, saya ingin menghubungi Anda.%0A%0ANama: ${encodeURIComponent(nameInput)}%0AEmail: ${encodeURIComponent(emailInput)}%0ASubjek: ${encodeURIComponent(subjectInput)}%0APesan: ${encodeURIComponent(messageInput)}`;
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

            // Buka WhatsApp dengan pesan yang sudah terisi otomatis
            const whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            if (!whatsappWindow) {
                window.location.href = whatsappUrl;
            }

            showToast('Membuka WhatsApp dengan pesan yang sudah diisi.');
            contactForm.reset();
        });
    }

    // Tambahkan keyframes untuk animasi spin tombol loading di CSS secara dinamis
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .animate-spin {
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(styleSheet);
});
