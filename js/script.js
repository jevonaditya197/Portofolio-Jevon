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
       6. PROJECT DETAIL MODAL (DINAMIS)
       ========================================================================== */
    const projectDetailButtons = document.querySelectorAll('.btn-project-detail');
    const projectModal = document.getElementById('project-modal');
    const projectModalClose = document.getElementById('project-modal-close-btn');
    const projectModalImg = document.getElementById('project-modal-main-img');
    const projectModalTag = document.getElementById('project-modal-tag');
    const projectModalTitle = document.getElementById('project-modal-title');
    const projectModalDesc = document.getElementById('project-modal-desc');
    const projectModalTech = document.getElementById('project-modal-tech');

    // Data Proyek Terperinci
    const projectData = {
        sia: {
            title: "Sistem Informasi Akademik (SIA)",
            tag: "Akademik",
            image: "assets/project1.png",
            desc: "Sistem Informasi Akademik ini dirancang khusus untuk mengotomatisasi proses bisnis di institusi pendidikan. Memiliki fitur manajemen data mahasiswa, input nilai oleh dosen, kartu hasil studi (KHS), penjadwalan kelas, serta rekapitulasi data laporan untuk administrator. Dikembangkan dengan memisahkan level otorisasi pengguna secara aman menggunakan autentikasi terenkripsi.",
            tech: ["HTML5", "CSS3", "JavaScript", "PHP", "MySQL", "Admin Dashboard"]
        },
        db: {
            title: "Perancangan Basis Data Toko Online",
            tag: "Basis Data",
            image: "assets/project2.png",
            desc: "Proyek ini mencakup analisis kebutuhan data bisnis, pembuatan skema konseptual menggunakan ERD (Entity Relationship Diagram) di MySQL Workbench, normalisasi tabel hingga tingkat 3NF untuk menghindari anomali data, dan implementasi kueri SQL transaksional yang kompleks. Berhasil mengoptimalkan kecepatan respons data pencarian produk dengan indexing taktis.",
            tech: ["MySQL Workbench", "Database Normalization", "ERD Modeling", "Indexing & Optimization"]
        },
        portfolio: {
            title: "Website Portofolio Pribadi Premium",
            tag: "Web Design",
            image: "assets/project3.png",
            desc: "Pengembangan website portofolio pribadi modern berestetika premium untuk Jevon Aditya. Menampilkan animasi partikel interaktif menggunakan HTML5 Canvas, tata letak glassmorphism responsif murni dengan CSS Grid & Flexbox, serta transisi scroll dinamis yang halus tanpa library eksternal. Dioptimalkan untuk performa Google Lighthouse yang cepat.",
            tech: ["HTML5 Semantics", "CSS Custom Variables", "Vanilla JavaScript", "HTML5 Canvas", "Responsive Web Design"]
        },
        group: {
            title: "Kolaborasi Aplikasi Pemesanan Tiket",
            tag: "Kolaborasi",
            image: "assets/project4.png",
            desc: "Proyek pengembangan kelompok berskala perkuliahan untuk mensimulasikan lingkungan kerja industri. Fokus utama pada pembagian tugas terstruktur menggunakan Git branching, pengajuan Pull Request, kode review, dan resolusi konflik merge. Menerapkan metodologi Agile Scrum sederhana untuk mengontrol siklus pembuatan purwarupa aplikasi tiket.",
            tech: ["Git & GitHub", "Agile Scrum Method", "Wireframing & Figma", "Teamwork Coordination"]
        }
    };

    if (projectDetailButtons && projectModal && projectModalClose) {
        projectDetailButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const projectId = btn.getAttribute('data-project');
                const data = projectData[projectId];

                if (data) {
                    // Isi data modal
                    projectModalImg.src = data.image;
                    projectModalImg.alt = data.title;
                    projectModalTag.textContent = data.tag;
                    projectModalTitle.textContent = data.title;
                    projectModalDesc.textContent = data.desc;

                    // Buat tech tags
                    projectModalTech.innerHTML = '';
                    data.tech.forEach(techName => {
                        const tagSpan = document.createElement('span');
                        tagSpan.textContent = techName;
                        projectModalTech.appendChild(tagSpan);
                    });

                    // Buka modal
                    projectModal.classList.add('active');
                    projectModal.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden'; // Kunci scroll halaman
                }
            });
        });

        const closeProjectModal = () => {
            projectModal.classList.remove('active');
            projectModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Aktifkan kembali scroll
        };

        projectModalClose.addEventListener('click', closeProjectModal);
        
        // Tutup jika mengklik latar belakang hitam di luar kartu modal
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeProjectModal();
            }
        });

        // Tutup dengan tombol Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectModal.classList.contains('active')) {
                closeProjectModal();
            }
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
