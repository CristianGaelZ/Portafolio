document.addEventListener('DOMContentLoaded', () => {
    
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times'); 
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars'); 
        }
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                navToggle.querySelector('i').classList.remove('fa-times');
                navToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    const modal = document.getElementById('preview-modal');
    const closeBtn = document.getElementById('close-modal');
    const iframe = document.getElementById('preview-iframe');
    const modalTitle = document.getElementById('modal-title');
    const projectsGrid = document.querySelector('.projects-grid');

    projectsGrid.addEventListener('click', (e) => {
        const primaryBtn = e.target.closest('.btn-primary');
        if (primaryBtn) {
            e.preventDefault();
            
            const projectCard = primaryBtn.closest('.project-card');
            const projectTitle = projectCard.querySelector('h3').textContent;
            const projectUrl = primaryBtn.getAttribute('href');
            
            if (projectUrl && projectUrl !== '#') {
                modalTitle.textContent = "Vista Previa: " + projectTitle;
                iframe.src = projectUrl;
                modal.style.display = 'flex';
            } else {
                 alert("Lo siento, este proyecto no tiene una URL de vista previa funcional.");
            }
        }
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        iframe.src = '';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            iframe.src = '';
        }
    });
});