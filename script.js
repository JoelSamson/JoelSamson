// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize GSAP (with error handling)
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Initialize Three.js Scene for Hero (with error handling)
    if (typeof THREE !== 'undefined') {
        initThreeJSScene();
    }
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth Scrolling for Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar Background on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.backdropFilter = 'blur(30px)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    });

    // Active Navigation Link Highlighting
    const sections = document.querySelectorAll('section');
    const navLinksArray = Array.from(navLinks);

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinksArray.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger skill bar animations
                if (entry.target.classList.contains('skills')) {
                    animateSkillBars();
                }
                
                // Trigger counter animations
                if (entry.target.classList.contains('hero')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe sections for animations
    sections.forEach(section => {
        observer.observe(section);
    });

    // Skill Bar Animation
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            }, index * 100);
        });
    }

    // Counter Animation for Hero Stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = counter.textContent;
            const numericValue = parseInt(target.replace(/[^\d]/g, ''));
            const suffix = target.replace(/[\d]/g, '');
            let current = 0;
            const increment = numericValue / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current) + suffix;
            }, 30);
        });
    }

    // Parallax Effect for Hero Section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroShape = document.querySelector('.hero-shape');
        const floatingCards = document.querySelectorAll('.floating-card');
        
        if (heroShape) {
            heroShape.style.transform = `translate(-50%, -50%) rotate(${scrolled * 0.1}deg)`;
        }
        
        floatingCards.forEach((card, index) => {
            const speed = 0.5 + (index * 0.1);
            card.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        });
    }

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification System
    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #f44336, #da190b)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 350px;
        `;
        
        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            margin-left: auto;
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    // Typing Animation for Hero Subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typing animation after a delay
        setTimeout(typeWriter, 1500);
    }

    // Particle Effect for Hero Section
    function createParticles() {
        const hero = document.querySelector('.hero');
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(102, 126, 234, 0.5);
                border-radius: 50%;
                pointer-events: none;
                animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 2}s;
            `;
            hero.appendChild(particle);
        }
    }
    
    createParticles();

    // Smooth Button Hover Effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${e.offsetX}px;
                top: ${e.offsetY}px;
                width: 20px;
                height: 20px;
                margin-left: -10px;
                margin-top: -10px;
            `;
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        section {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
        }
        
        .nav-link.active {
            color: #667eea !important;
        }
        
        .nav-link.active::after {
            width: 100% !important;
        }
        
        .particle {
            animation: particleFloat 4s ease-in-out infinite !important;
        }
        
        @keyframes particleFloat {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0.5;
            }
            50% {
                transform: translateY(-20px) rotate(180deg);
                opacity: 1;
            }
        }
        
        .hamburger.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active .bar:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        
        .hamburger.active .bar:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    `;
    document.head.appendChild(style);

    // Initialize animations for elements already in view
    setTimeout(() => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                section.classList.add('animate-in');
                if (section.classList.contains('hero')) {
                    animateCounters();
                }
            }
        });
    }, 500);

    // Scroll to top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 18px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add hover effect to scroll to top button
    scrollToTopBtn.addEventListener('mouseenter', () => {
        scrollToTopBtn.style.transform = 'translateY(-3px) scale(1.1)';
        scrollToTopBtn.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.4)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', () => {
        scrollToTopBtn.style.transform = 'translateY(0) scale(1)';
        scrollToTopBtn.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.3)';
    });

    // Portfolio Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category').includes(filter)) {
                    item.classList.remove('hidden');
                    // Use GSAP if available, otherwise use CSS transitions
                    if (typeof gsap !== 'undefined') {
                        gsap.to(item, {duration: 0.5, opacity: 1, scale: 1, ease: "back.out(1.7)"});
                    } else {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }
                } else {
                    item.classList.add('hidden');
                    // Use GSAP if available, otherwise use CSS transitions
                    if (typeof gsap !== 'undefined') {
                        gsap.to(item, {duration: 0.3, opacity: 0, scale: 0.8});
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                    }
                }
            });
        });
    });

    // GSAP Animations (with fallbacks)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Hero animations
        gsap.timeline()
            .from('.hero-title', {duration: 1, y: 100, opacity: 0, ease: "power3.out"})
            .from('.hero-subtitle', {duration: 1, y: 50, opacity: 0, ease: "power3.out"}, "-=0.5")
            .from('.hero-description', {duration: 1, y: 30, opacity: 0, ease: "power3.out"}, "-=0.3")
            .from('.hero-stats .stat', {duration: 0.8, y: 30, opacity: 0, stagger: 0.2, ease: "power3.out"}, "-=0.5")
            .from('.hero-buttons .btn', {duration: 0.8, y: 30, opacity: 0, stagger: 0.1, ease: "power3.out"}, "-=0.3");

        // Portfolio cards animation
        gsap.from('.portfolio-card', {
            duration: 1,
            y: 100,
            opacity: 0,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.portfolio-grid',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });

        // Story chapters animation
        gsap.utils.toArray('.story-chapter').forEach((chapter, index) => {
            gsap.from(chapter, {
                duration: 1,
                x: index % 2 === 0 ? -100 : 100,
                opacity: 0,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: chapter,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Stats animation
        gsap.from('.stat-card', {
            duration: 1,
            y: 50,
            opacity: 0,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: '.story-stats',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        // Enhanced scroll animations
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                duration: 1,
                y: 50,
                opacity: 0,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Parallax effect for background elements
        gsap.utils.toArray('.portfolio::before, .story::before').forEach(bg => {
            gsap.to(bg, {
                yPercent: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: bg,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    } else {
        // Fallback animations using CSS and Intersection Observer
        initFallbackAnimations();
    }

    // Debug: Check if sections exist
    console.log('Portfolio section found:', !!document.getElementById('portfolio'));
    console.log('Story section found:', !!document.getElementById('story'));
    console.log('Portfolio cards found:', document.querySelectorAll('.portfolio-card').length);
    console.log('Story chapters found:', document.querySelectorAll('.story-chapter').length);
    console.log('Filter buttons found:', document.querySelectorAll('.filter-btn').length);
    
    // Force show sections after a delay (fallback)
    setTimeout(() => {
        document.querySelectorAll('.portfolio-card, .story-chapter, .stat-card, .section-title').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 1000);
    
    console.log('🚀 Joel Samson Portfolio - Loaded Successfully!');
});

// Fallback animations for when GSAP is not available
function initFallbackAnimations() {
    // Simple CSS-based animations using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger specific animations
                if (entry.target.classList.contains('portfolio-grid')) {
                    const cards = entry.target.querySelectorAll('.portfolio-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
                
                if (entry.target.classList.contains('story-chapter')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                
                if (entry.target.classList.contains('story-stats')) {
                    const cards = entry.target.querySelectorAll('.stat-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.portfolio-grid, .story-chapter, .story-stats, .section-title').forEach(el => {
        observer.observe(el);
    });
}

// Three.js Scene for Hero Section
function initThreeJSScene() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') {
        console.log('Three.js not available or canvas not found');
        return;
    }

    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true});
    
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setClearColor(0x000000, 0);

    // Create floating geometric shapes
    const geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.ConeGeometry(0.5, 1, 32),
        new THREE.TorusGeometry(0.5, 0.2, 16, 100)
    ];

    const materials = [
        new THREE.MeshBasicMaterial({ 
            color: 0x667eea, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.6 
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0x764ba2, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.4 
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0xf093fb, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.3 
        })
    ];

    const meshes = [];
    
    // Create multiple floating objects
    for (let i = 0; i < 15; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.x = (Math.random() - 0.5) * 20;
        mesh.position.y = (Math.random() - 0.5) * 20;
        mesh.position.z = (Math.random() - 0.5) * 20;
        
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        // Store initial position and random speeds
        mesh.userData = {
            initialY: mesh.position.y,
            floatSpeed: 0.01 + Math.random() * 0.02,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        };
        
        scene.add(mesh);
        meshes.push(mesh);
    }

    camera.position.z = 15;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Animate each mesh
        meshes.forEach((mesh, index) => {
            // Floating animation
            mesh.position.y = mesh.userData.initialY + Math.sin(Date.now() * mesh.userData.floatSpeed + index) * 2;
            
            // Rotation animation
            mesh.rotation.x += mesh.userData.rotationSpeed.x;
            mesh.rotation.y += mesh.userData.rotationSpeed.y;
            mesh.rotation.z += mesh.userData.rotationSpeed.z;
        });

        // Rotate entire scene slowly
        scene.rotation.y += 0.001;

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
            camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        }
    });

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        
        // Move camera slightly based on mouse position
        camera.position.x = mouseX * 0.5;
        camera.position.y = mouseY * 0.5;
        camera.lookAt(scene.position);
    });
    
    } catch (error) {
        console.log('Three.js initialization failed:', error);
    }
}