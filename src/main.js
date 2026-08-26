import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      mobileMenuBtn.classList.toggle('open');
    });

    // Cierra el menú móvil al hacer clic en un enlace
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.classList.remove('open');
          mobileMenuBtn.classList.remove('open');
        }
      });
    });
  }

  // Header scroll transparente a solido
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Animaciones de scroll elegantes
  const animateElements = document.querySelectorAll('.section-title, .benefits-intro, .benefit-item, .service-card, .step, .d-card, .criteria-content, .industry-item, .cta-box');

  animateElements.forEach(el => {
    el.classList.add('scroll-hidden');
  });

  const lineElement = document.querySelector('.step-line');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if(entry.target.classList.contains('step-line')) {
          entry.target.classList.add('draw-line');
        } else {
          entry.target.classList.add('scroll-visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animateElements.forEach(el => observer.observe(el));
  if(lineElement) observer.observe(lineElement);

  const processSteps = document.querySelector('.process-steps');
  const stepsNodes = document.querySelectorAll('.step-number');

  window.addEventListener('scroll', () => {
    if (!processSteps || !lineElement) return;
    
    const rect = processSteps.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    let progress;
    if (window.innerWidth <= 768) {
      progress = (windowHeight / 2 - rect.top) / rect.height;
    } else {
      progress = (windowHeight / 1.3 - rect.top) / rect.height;
    }
    
    progress = Math.max(0, Math.min(1, progress));
    lineElement.style.setProperty('--progress', `${progress * 100}%`);
    
    stepsNodes.forEach((stepNode) => {
       const stepIcon = stepNode.closest('.step').querySelector('.step-icon');
       const stepRect = stepNode.getBoundingClientRect();
       const lineRect = lineElement.getBoundingClientRect();
       
       let isTouched = false;
       if (window.innerWidth <= 768) {
         const lineBottom = lineRect.top + lineRect.height * progress;
         if (lineBottom >= (stepRect.top + stepRect.height/2)) {
            isTouched = true;
         }
       } else {
         const lineRight = lineRect.left + lineRect.width * progress;
         if (lineRight >= (stepRect.left + stepRect.width/2)) {
            isTouched = true;
         }
       }
       
       if (isTouched) {
          stepNode.classList.add('active');
          if (stepIcon) stepIcon.classList.add('active');
       } else {
          stepNode.classList.remove('active');
          if (stepIcon) stepIcon.classList.remove('active');
       }
    });
  });

  // Resaltar enlaces del nav según el scroll
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a:not(.btn)');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 150;
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(a => {
      a.classList.remove('active');
      const href = a.getAttribute('href');
      if (current && (href === '/#' + current || href === '#' + current)) {
        a.classList.add('active');
      }
    });
  });

  // Manejo de formulario con Web3Forms (AJAX)
  const form = document.querySelector('.inspection-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const btn = form.querySelector('.btn-submit');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Enviando...';
      btn.disabled = true;

      const formData = new FormData(form);
      
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
          btn.innerHTML = '¡Enviado con éxito! ✓';
          btn.style.backgroundColor = '#10B981'; // Color verde de éxito
          btn.style.borderColor = '#10B981';
          form.reset();
          
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
            btn.style.borderColor = '';
            btn.disabled = false;
          }, 4000);
        } else {
          console.log(response);
          btn.innerHTML = 'Error al enviar ✕';
          btn.style.backgroundColor = '#EF4444'; // Color rojo de error
          btn.style.borderColor = '#EF4444';
          
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
            btn.style.borderColor = '';
            btn.disabled = false;
          }, 4000);
        }
      })
      .catch(error => {
        console.log(error);
        btn.innerHTML = 'Error de conexión ✕';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 4000);
      });
    });
  }
});
