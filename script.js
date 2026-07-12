/* ----------------------------------------------------
   DUBAI CONTRACTING - MAIN SCRIPT
   Bilingual toggles, 3D wireframe canvas, scroll reveals,
   gallery filters, lightbox, and modal player.
   ---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------
       1. BILINGUAL LANGUAGE SWITCHER
       ------------------------------------ */
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const htmlElem = document.documentElement;

    // Check saved language or default to English
    let currentLang = localStorage.getItem('site-lang') || 'en';
    setLanguage(currentLang);

    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ar' : 'en';
        setLanguage(currentLang);
    });

    function setLanguage(lang) {
        localStorage.setItem('site-lang', lang);
        htmlElem.setAttribute('lang', lang);
        
        // Update layout direction
        if (lang === 'ar') {
            htmlElem.setAttribute('dir', 'rtl');
        } else {
            htmlElem.setAttribute('dir', 'ltr');
        }

        // Initialize/refresh Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }


    /* ------------------------------------
       2. MOBILE NAVIGATION DRAWER
       ------------------------------------ */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-item');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = navToggle.querySelector('i, svg');
            if (icon) {
                if (navMenu.classList.contains('open')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        });
    }

    // Close menu when clicking navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('open');
            if (navToggle) {
                const icon = navToggle.querySelector('i, svg');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }
        });
    });


    /* ------------------------------------
       3. 3D BLUEPRINT CANVAS ENGINE
       ------------------------------------ */
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        });

        // 3D Point projection math
        class Point3D {
            constructor(x, y, z) {
                this.x = x;
                this.y = y;
                this.z = z;
            }

            rotateY(angle) {
                const rad = angle * Math.PI / 180;
                const cos = Math.cos(rad);
                const sin = Math.sin(rad);
                const x = this.x * cos - this.z * sin;
                const z = this.x * sin + this.z * cos;
                return new Point3D(x, this.y, z);
            }

            rotateX(angle) {
                const rad = angle * Math.PI / 180;
                const cos = Math.cos(rad);
                const sin = Math.sin(rad);
                const y = this.y * cos - this.z * sin;
                const z = this.y * sin + this.z * cos;
                return new Point3D(this.x, y, z);
            }

            project(fov, centerX, centerY, scrollOffset) {
                // Adjust vertical translation on scroll
                const projectedY = this.y + scrollOffset;
                const scale = fov / (fov + this.z);
                return {
                    x: centerX + this.x * scale,
                    y: centerY + projectedY * scale,
                    visible: this.z > -fov
                };
            }
        }

        // Generate 3D Building Geometry (Floors and columns)
        const buildingPoints = [];
        const buildingLines = [];

        const floors = 6;
        const floorHeight = 70;
        const sizeX = 140;
        const sizeZ = 140;

        // Generate vertices
        for (let f = 0; f < floors; f++) {
            const y = -f * floorHeight + 120; // building starts offset downwards
            // Core corners
            const p1 = new Point3D(-sizeX/2, y, -sizeZ/2);
            const p2 = new Point3D(sizeX/2, y, -sizeZ/2);
            const p3 = new Point3D(sizeX/2, y, sizeZ/2);
            const p4 = new Point3D(-sizeX/2, y, sizeZ/2);
            
            // Subgrid points (for truss bracings / engineering grid)
            const pCenter = new Point3D(0, y, 0);

            buildingPoints.push(p1, p2, p3, p4);

            const floorStartIndex = f * 4;

            // Connect floor square borders
            buildingLines.push([floorStartIndex, floorStartIndex + 1]);
            buildingLines.push([floorStartIndex + 1, floorStartIndex + 2]);
            buildingLines.push([floorStartIndex + 2, floorStartIndex + 3]);
            buildingLines.push([floorStartIndex + 3, floorStartIndex]);

            // Connect vertical columns to floor below
            if (f > 0) {
                const prevFloorStart = (f - 1) * 4;
                buildingLines.push([floorStartIndex, prevFloorStart]);
                buildingLines.push([floorStartIndex + 1, prevFloorStart + 1]);
                buildingLines.push([floorStartIndex + 2, prevFloorStart + 2]);
                buildingLines.push([floorStartIndex + 3, prevFloorStart + 3]);

                // Diagonal bracing patterns (trusses)
                buildingLines.push([floorStartIndex, prevFloorStart + 1]);
                buildingLines.push([floorStartIndex + 1, prevFloorStart + 2]);
                buildingLines.push([floorStartIndex + 2, prevFloorStart + 3]);
                buildingLines.push([floorStartIndex + 3, prevFloorStart]);
            }
        }

        // Particle System for floating dust/sparks
        const particles = [];
        const maxParticles = 60;
        for (let i = 0; i < maxParticles; i++) {
            particles.push({
                x: (Math.random() - 0.5) * 600,
                y: Math.random() * -600 + 300,
                z: (Math.random() - 0.5) * 600,
                speedY: -0.6 - Math.random() * 0.8,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.4 + 0.1
            });
        }

        // Animation state variables
        let rotationAngleY = 45;
        let rotationAngleX = -12;
        let scrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
        });

        // Drawing loops
        function animate() {
            ctx.clearRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2 + 50; // offset centering slightly
            const fov = 450;

            // Adjust angle and position based on scroll (dynamic scroll reactivity)
            const activeAngleY = rotationAngleY + scrollY * 0.04;
            const activeAngleX = rotationAngleX + scrollY * 0.005;
            const scrollTranslationY = scrollY * 0.35; // moves building smoothly upward

            // Draw technical blueprint background grids (3 horizontal grid references)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
            ctx.lineWidth = 1;
            for (let lineX = 0; lineX < width; lineX += 80) {
                ctx.beginPath();
                ctx.moveTo(lineX, 0);
                ctx.lineTo(lineX, height);
                ctx.stroke();
            }
            for (let lineY = 0; lineY < height; lineY += 80) {
                ctx.beginPath();
                ctx.moveTo(0, lineY);
                ctx.lineTo(width, lineY);
                ctx.stroke();
            }

            // Draw Floating Particles
            particles.forEach(p => {
                p.y += p.speedY;
                if (p.y < -350) {
                    p.y = 350;
                    p.x = (Math.random() - 0.5) * 600;
                }

                // Project particle coordinates
                const scale = fov / (fov + p.z);
                const screenX = centerX + p.x * scale;
                const screenY = centerY + (p.y + scrollTranslationY * 0.5) * scale;

                if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, p.size * scale, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 140, 0, ${p.opacity})`;
                    ctx.fill();
                }
            });

            // Project building vertices
            const projectedPoints = buildingPoints.map(pt => {
                // Apply rotation & project
                const rotated = pt.rotateY(activeAngleY).rotateX(activeAngleX);
                return rotated.project(fov, centerX, centerY, scrollTranslationY);
            });

            // Draw projected structural lines
            buildingLines.forEach(([start, end]) => {
                const pt1 = projectedPoints[start];
                const pt2 = projectedPoints[end];

                if (pt1.visible && pt2.visible) {
                    ctx.beginPath();
                    ctx.moveTo(pt1.x, pt1.y);
                    ctx.lineTo(pt2.x, pt2.y);

                    // Determine structure type for color hierarchy
                    const isDiagonal = (start % 4 !== end % 4) && Math.abs(start - end) > 3;
                    if (isDiagonal) {
                        ctx.strokeStyle = 'rgba(255, 140, 0, 0.08)'; // Light truss bracing
                        ctx.lineWidth = 1;
                    } else {
                        ctx.strokeStyle = 'rgba(255, 140, 0, 0.28)'; // Main columns/beams
                        ctx.lineWidth = 1.2;
                    }
                    ctx.stroke();
                }
            });

            // Slowly spin continuously
            rotationAngleY += 0.04;

            requestAnimationFrame(animate);
        }

        animate();
    }


    /* ------------------------------------
       4. SCROLL REVEAL & METRIC COUNTERS
       ------------------------------------ */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const counterElements = document.querySelectorAll('.stat-number');

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it is a statistic card, animate counters
                if (entry.target.classList.contains('blueprint-stats')) {
                    animateCounters();
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(elem => {
        scrollObserver.observe(elem);
    });

    // Also observe the stats footer container specifically
    const statsContainer = document.querySelector('.blueprint-stats');
    if (statsContainer) {
        scrollObserver.observe(statsContainer);
    }

    let countersAnimated = false;
    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        counterElements.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            let current = 0;
            const isEstYear = target === 2019;
            const startVal = isEstYear ? 1980 : 0;
            current = startVal;
            
            const duration = 1500; // ms
            const interval = 20;
            const steps = duration / interval;
            const increment = (target - startVal) / steps;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.innerText = target + (isEstYear ? '' : '+');
                    clearInterval(timer);
                } else {
                    counter.innerText = Math.floor(current);
                }
            }, interval);
        });
    }


    /* ------------------------------------
       5. PORTFOLIO GALLERY FILTERS
       ------------------------------------ */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterVal = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filterVal === 'all' || category === filterVal) {
                    item.style.display = 'flex';
                    // Trigger reflow for transition
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400); // match CSS transitions duration
                }
            });
        });
    });


    /* ------------------------------------
       5.5. CARD GALLERY CAROUSELS
       ------------------------------------ */
    const carousels = document.querySelectorAll('.gallery-item');
    
    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        if (slides.length <= 1) return; // No carousel logic needed for single-image cards
        
        const dots = carousel.querySelectorAll('.carousel-dot');
        const prevControlBtn = carousel.querySelector('.prev-btn');
        const nextControlBtn = carousel.querySelector('.next-btn');
        let slideIndex = 0;
        let autoplayTimer = null;
        
        function showSlide(index) {
            // Bounds check
            if (index >= slides.length) slideIndex = 0;
            else if (index < 0) slideIndex = slides.length - 1;
            else slideIndex = index;
            
            // Toggle active classes on slides
            slides.forEach((slide, idx) => {
                if (idx === slideIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            
            // Toggle active classes on dots
            dots.forEach((dot, idx) => {
                if (idx === slideIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        function nextSlide() {
            showSlide(slideIndex + 1);
        }
        
        function prevSlide() {
            showSlide(slideIndex - 1);
        }
        
        function startAutoplay() {
            if (autoplayTimer) clearInterval(autoplayTimer);
            autoplayTimer = setInterval(nextSlide, 4000);
        }
        
        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }
        
        // Control buttons
        if (prevControlBtn) {
            prevControlBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent opening lightbox
                prevSlide();
                startAutoplay(); // Reset autoplay timer
            });
        }
        
        if (nextControlBtn) {
            nextControlBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent opening lightbox
                nextSlide();
                startAutoplay(); // Reset autoplay timer
            });
        }
        
        // Dots navigation
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent opening lightbox
                showSlide(idx);
                startAutoplay(); // Reset autoplay timer
            });
        });
        
        // Pause on hover
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        
        // Start playing immediately
        startAutoplay();
    });


    /* ------------------------------------
       6. LIGHTBOX PHOTO GALLERY MODAL
       ------------------------------------ */
    const lightboxModal = document.getElementById('photo-lightbox');
    const lightboxImg = document.getElementById('lightbox-main-img');
    const lightboxVideo = document.getElementById('lightbox-main-video');
    const lightboxCaption = document.getElementById('lightbox-caption-text');
    const closeBtn = document.getElementById('lightbox-close-btn');
    const prevBtn = document.getElementById('lightbox-prev-btn');
    const nextBtn = document.getElementById('lightbox-next-btn');

    let activeGalleryArray = [];
    let currentPhotoIndex = 0;

    // Attach click events to gallery cards
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Rebuild active list of visible items
            activeGalleryArray = Array.from(galleryItems).filter(el => el.style.display !== 'none');
            currentPhotoIndex = activeGalleryArray.indexOf(item);

            openLightbox(item);
        });
    });

    function openLightbox(item) {
        const media = item.querySelector('.carousel-slide.active') || item.querySelector('.gallery-img');
        const titleEN = item.querySelector('.gallery-item-title .lang-en').innerText;
        const titleAR = item.querySelector('.gallery-item-title .lang-ar').innerText;
        const descEN = item.querySelector('.gallery-item-desc .lang-en').innerText;
        const descAR = item.querySelector('.gallery-item-desc .lang-ar').innerText;

        const isVideo = media && media.tagName.toLowerCase() === 'video';

        if (isVideo) {
            if (lightboxImg) lightboxImg.style.display = 'none';
            if (lightboxVideo) {
                lightboxVideo.src = media.src;
                lightboxVideo.style.display = 'block';
                lightboxVideo.play().catch(e => console.log('Autoplay blocked in lightbox:', e));
            }
        } else {
            if (lightboxVideo) {
                lightboxVideo.pause();
                lightboxVideo.src = '';
                lightboxVideo.style.display = 'none';
            }
            if (lightboxImg) {
                lightboxImg.src = media ? media.src : '';
                lightboxImg.style.display = 'block';
            }
        }
        
        // Inject bilingual caption structures
        lightboxCaption.innerHTML = `
            <div class="caption-title lang-en">${titleEN}</div>
            <div class="caption-title lang-ar">${titleAR}</div>
            <div class="caption-desc lang-en">${descEN}</div>
            <div class="caption-desc lang-ar">${descAR}</div>
        `;

        lightboxModal.classList.add('show');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock scrolling
    }

    function closeLightbox() {
        lightboxModal.classList.remove('show');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Unlock scrolling
        if (lightboxVideo) {
            lightboxVideo.pause();
            lightboxVideo.src = '';
        }
    }

    function showNextPhoto() {
        if (activeGalleryArray.length <= 1) return;
        currentPhotoIndex = (currentPhotoIndex + 1) % activeGalleryArray.length;
        openLightbox(activeGalleryArray[currentPhotoIndex]);
    }

    function showPrevPhoto() {
        if (activeGalleryArray.length <= 1) return;
        currentPhotoIndex = (currentPhotoIndex - 1 + activeGalleryArray.length) % activeGalleryArray.length;
        openLightbox(activeGalleryArray[currentPhotoIndex]);
    }

    // Lightbox triggers
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNextPhoto);
    prevBtn.addEventListener('click', showPrevPhoto);

    // Close lightbox clicking outside the content
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Keyboard bindings for convenience
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('show')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') {
            if (htmlElem.getAttribute('dir') === 'rtl') showPrevPhoto();
            else showNextPhoto();
        }
        if (e.key === 'ArrowLeft') {
            if (htmlElem.getAttribute('dir') === 'rtl') showNextPhoto();
            else showPrevPhoto();
        }
    });


    /* ------------------------------------
       7. VIDEO SHOWCASE MODAL
       ------------------------------------ */
    const playVideoBtn = document.getElementById('play-video-btn');
    const videoPlayerModal = document.getElementById('video-player-modal');
    const videoCloseBtn = document.getElementById('video-close-btn');
    const modalVideo = document.getElementById('modal-video-element');

    if (playVideoBtn && videoPlayerModal) {
        playVideoBtn.addEventListener('click', () => {
            videoPlayerModal.classList.add('show');
            videoPlayerModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Auto play high resolution video inside modal
            modalVideo.currentTime = 0;
            modalVideo.play().catch(e => console.log("Autoplay blocked: " + e.message));
        });

        function closeVideoPlayer() {
            videoPlayerModal.classList.remove('show');
            videoPlayerModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            modalVideo.pause(); // Stop playing audio
        }

        videoCloseBtn.addEventListener('click', closeVideoPlayer);

        videoPlayerModal.addEventListener('click', (e) => {
            if (e.target === videoPlayerModal) {
                closeVideoPlayer();
            }
        });
    }



    /* ------------------------------------
       9. SMOOTH NAV ITEM HIGHLIGHTS
       ------------------------------------ */
    const navItems = document.querySelectorAll('.nav-item');
    const pageSections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let activeSecId = 'hero';
        const scrollPos = window.scrollY + 100; // offsets offset height of nav bar

        pageSections.forEach(sec => {
            const secTop = sec.offsetTop;
            const secHeight = sec.offsetHeight;
            if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
                activeSecId = sec.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href').substring(1);
            if (href === activeSecId) {
                item.classList.add('active');
            }
        });
    });

});
