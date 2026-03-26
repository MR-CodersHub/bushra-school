document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('i') : null;
    
    if (mobileMenuBtn && mobileNavOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            const isMenuOpen = mobileNavOverlay.classList.contains('active');
            
            if (isMenuOpen) {
                mobileNavOverlay.classList.remove('active');
                if(mobileIcon) {
                    mobileIcon.classList.remove('fa-xmark');
                    mobileIcon.classList.add('fa-bars');
                }
                document.body.style.overflow = '';
            } else {
                mobileNavOverlay.classList.add('active');
                if(mobileIcon) {
                    mobileIcon.classList.remove('fa-bars');
                    mobileIcon.classList.add('fa-xmark');
                }
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Contact Form Switcher
    const switchBtns = document.querySelectorAll('.switch-btn');
    if (switchBtns.length > 0) {
        switchBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                switchBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const targetFormId = btn.getAttribute('data-form');
                
                document.querySelectorAll('.contact-form').forEach(form => {
                    form.classList.remove('active');
                    form.style.display = 'none'; // Ensure display none is strictly applied if classes fail
                });

                const targetForm = document.getElementById(targetFormId + 'Form');
                if (targetForm) {
                    targetForm.classList.add('active');
                    targetForm.style.display = 'block'; // Ensure block display
                }
            });
        });

        // Initialize display rules based on class on load
        document.querySelectorAll('.contact-form').forEach(form => {
            if(!form.classList.contains('active')) {
                form.style.display = 'none';
            } else {
                form.style.display = 'block';
            }
        });
    }

    // Sticky Header Scroll Effect
    const header = document.getElementById('main-header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        });
        
        // Initial check
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        }
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once animated if we only want it strictly one-way
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // Animated Statistics Counters
    const counterElements = document.querySelectorAll('.stat-counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = parseInt(target.getAttribute('data-target'));
                const duration = 2000; // ms
                const increment = targetValue / (duration / 16); // 60fps approx
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < targetValue) {
                        target.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.innerText = targetValue + (target.getAttribute('data-suffix') || '');
                    }
                };
                updateCounter();
                observer.unobserve(target); // Run once!
            }
        });
    }, observerOptions);

    counterElements.forEach(el => counterObserver.observe(el));

    // Testimonial Carousel (Basic implementation for simple fade transitions)
    const testimonials = document.querySelectorAll('.testimonial-slide');
    if (testimonials.length > 0) {
        let currentSlide = 0;
        
        const showSlide = (index) => {
            testimonials.forEach((slide, i) => {
                // adding smooth transition logic
                slide.style.transition = "opacity 0.6s ease, transform 0.6s ease";
                
                if (i === index) {
                    slide.style.opacity = '1';
                    slide.style.transform = 'translateY(0)';
                    slide.style.position = 'relative';
                    slide.style.zIndex = '1';
                    slide.style.pointerEvents = 'auto';
                } else {
                    slide.style.opacity = '0';
                    slide.style.transform = 'translateY(20px)';
                    slide.style.position = 'absolute';
                    slide.style.zIndex = '0';
                    slide.style.pointerEvents = 'none';
                }
            });
        };
        
        // Auto rotate every 5 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonials.length;
            showSlide(currentSlide);
        }, 5000);
        
        // Show first slide initially
        showSlide(0);
    }
    
    // Advanced Lightbox for Gallery
    const galleryItems = Array.from(document.querySelectorAll('.masonry-item'));
    if (galleryItems.length > 0) {
        let currentIndex = 0;
        let visibleItems = [...galleryItems]; // Tracks items currently matching filter

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <div class="lightbox-nav prev" aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></div>
            <div class="lightbox-content">
                <button class="lightbox-close"><i class="fa-solid fa-xmark"></i></button>
                <img src="" alt="Gallery Image" class="lightbox-img">
                <div class="lightbox-caption"></div>
            </div>
            <div class="lightbox-nav next" aria-label="Next"><i class="fa-solid fa-chevron-right"></i></div>
        `;
        document.body.appendChild(lightbox);
        
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.prev');
        const nextBtn = lightbox.querySelector('.next');
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        
        Object.assign(lightbox.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100vh',
            backgroundColor: 'rgba(10, 17, 40, 0.98)', backdropFilter: 'blur(10px)',
            display: 'none', justifyContent: 'center', alignItems: 'center',
            zIndex: '9999', padding: '20px', opacity: '0', transition: 'opacity 0.3s ease'
        });
        
        Object.assign(closeBtn.style, {
            position: 'absolute', top: '-40px', right: '0', background: 'none', border: 'none',
            color: '#fff', fontSize: '30px', cursor: 'pointer', transition: 'transform 0.3s ease'
        });

        const navStyle = {
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none',
            width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%', cursor: 'pointer', fontSize: '20px', transition: 'background 0.3s ease, transform 0.3s ease',
            zIndex: '10'
        };
        Object.assign(prevBtn.style, navStyle);
        Object.assign(nextBtn.style, navStyle);
        prevBtn.style.left = '30px';
        nextBtn.style.right = '30px';
        
        prevBtn.addEventListener('mouseenter', () => { prevBtn.style.background = 'rgba(30,142,90,0.8)'; prevBtn.style.transform = 'translateY(-50%) scale(1.1)'; });
        prevBtn.addEventListener('mouseleave', () => { prevBtn.style.background = 'rgba(255,255,255,0.1)'; prevBtn.style.transform = 'translateY(-50%) scale(1)'; });
        nextBtn.addEventListener('mouseenter', () => { nextBtn.style.background = 'rgba(30,142,90,0.8)'; nextBtn.style.transform = 'translateY(-50%) scale(1.1)'; });
        nextBtn.addEventListener('mouseleave', () => { nextBtn.style.background = 'rgba(255,255,255,0.1)'; nextBtn.style.transform = 'translateY(-50%) scale(1)'; });

        Object.assign(lightboxContent.style, {
            position: 'relative', maxWidth: '900px', width: '100%',
            transform: 'scale(0.95)', transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
        });

        Object.assign(lightboxImg.style, {
            maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', 
            borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        });

        Object.assign(lightboxCaption.style, {
            color: '#fff', marginTop: '15px', fontSize: '18px', fontWeight: '500', 
            textAlign: 'center', letterSpacing: '0.5px'
        });

        const updateLightbox = () => {
            const item = visibleItems[currentIndex];
            const imgSrc = item.querySelector('img').src;
            const captionText = item.querySelector('h5') ? item.querySelector('h5').innerText : '';
            lightboxImg.src = imgSrc;
            lightboxCaption.innerText = captionText;
            
            lightboxContent.style.transform = 'scale(0.98)';
            setTimeout(() => { lightboxContent.style.transform = 'scale(1)'; }, 50);
        };

        const showLightbox = (index) => {
            currentIndex = index;
            updateLightbox();
            lightbox.style.display = 'flex';
            setTimeout(() => {
                lightbox.style.opacity = '1';
                lightboxContent.style.transform = 'scale(1)';
            }, 10);
            document.body.style.overflow = 'hidden';
        };

        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                currentIndex = visibleItems.indexOf(item);
                if(currentIndex !== -1) showLightbox(currentIndex);
            });
        });
        
        const closeLightbox = () => {
            lightbox.style.opacity = '0';
            lightboxContent.style.transform = 'scale(0.95)';
            setTimeout(() => {
                lightbox.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        };

        const showNext = (e) => { e.stopPropagation(); currentIndex = (currentIndex + 1) % visibleItems.length; updateLightbox(); };
        const showPrev = (e) => { e.stopPropagation(); currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; updateLightbox(); };

        closeBtn.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNext(e);
                if (e.key === 'ArrowLeft') showPrev(e);
            }
        });

        // Interactive Filter System
        const filterBtns = document.querySelectorAll('.filter-btn');
        if(filterBtns.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const filterValue = btn.getAttribute('data-filter');
                    
                    visibleItems = [];
                    galleryItems.forEach(item => {
                        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                            item.style.display = 'block';
                            item.style.animation = 'none';
                            item.offsetHeight; // trigger reflow
                            item.style.animation = 'fadeUp 0.5s ease forwards';
                            visibleItems.push(item);
                        } else {
                            item.style.display = 'none';
                        }
                    });
                });
            });
        }
    }
});
