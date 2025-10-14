// ========================================
// CONFIGURATION ET CONSTANTES
// ========================================
const CONFIG = {
    animationDuration: 300,
    scrollBehavior: 'smooth',
    dateLocale: 'fr-FR',
    dateOptions: {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
};

// ========================================
// GESTION DE LA NAVIGATION
// ========================================
function showSection(sectionId) {
    // Récupérer toutes les sections et boutons
    const sections = document.querySelectorAll('.section');
    const buttons = document.querySelectorAll('.nav-btn');
    
    // Masquer toutes les sections avec animation
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Désactiver tous les boutons
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Afficher la section demandée
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        setTimeout(() => {
            targetSection.classList.add('active');
        }, 50);
    }
    
    // Activer le bouton correspondant (si event existe)
    if (window.event && window.event.target) {
        window.event.target.classList.add('active');
    }
    
    // Scroll fluide vers le haut
    window.scrollTo({ 
        top: 0, 
        behavior: CONFIG.scrollBehavior 
    });
    
    // Sauvegarder la section active dans le localStorage
    saveActiveSection(sectionId);
}

// ========================================
// GESTION DE LA DATE
// ========================================
function updateLastModifiedDate() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    
    if (lastUpdateElement) {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString(
            CONFIG.dateLocale, 
            CONFIG.dateOptions
        );
        
        lastUpdateElement.textContent = formattedDate;
    }
}

// ========================================
// SAUVEGARDE ET RESTAURATION DE L'ÉTAT
// ========================================
function saveActiveSection(sectionId) {
    try {
        // Note: localStorage n'est pas disponible dans les artifacts Claude
        // Cette fonction est préparée pour une utilisation en environnement réel
        if (typeof Storage !== 'undefined') {
            // localStorage.setItem('activeSection', sectionId);
        }
    } catch (e) {
        console.warn('Impossible de sauvegarder la section active:', e);
    }
}

function restoreActiveSection() {
    try {
        if (typeof Storage !== 'undefined') {
            // const savedSection = localStorage.getItem('activeSection');
            // if (savedSection) {
            //     showSection(savedSection);
            // }
        }
    } catch (e) {
        console.warn('Impossible de restaurer la section active:', e);
    }
}

// ========================================
// GESTION DES FICHIERS (UPLOAD)
// ========================================
function initUploadZones() {
    const uploadZones = document.querySelectorAll('.upload-zone');
    
    uploadZones.forEach(zone => {
        // Empêcher le comportement par défaut du drag & drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, preventDefaults, false);
        });
        
        // Ajouter effet visuel au survol
        ['dragenter', 'dragover'].forEach(eventName => {
            zone.addEventListener(eventName, () => {
                zone.style.borderColor = '#764ba2';
                zone.style.backgroundColor = '#ffffff';
            });
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, () => {
                zone.style.borderColor = '#667eea';
                zone.style.backgroundColor = '#f8f9fa';
            });
        });
        
        // Gérer le drop de fichiers
        zone.addEventListener('drop', handleDrop, false);
        
        // Gérer le clic pour sélection de fichiers
        zone.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.onchange = (e) => handleFiles(e.target.files, zone);
            input.click();
        });
    });
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files, e.currentTarget);
}

function handleFiles(files, zone) {
    // Afficher les fichiers sélectionnés
    const fileArray = Array.from(files);
    
    if (fileArray.length > 0) {
        let fileInfo = `<p style="color: #667eea; font-weight: bold;">✓ ${fileArray.length} fichier(s) sélectionné(s) :</p>`;
        fileArray.forEach(file => {
            fileInfo += `<p style="font-size: 0.9rem; color: #555;">📄 ${file.name} (${formatFileSize(file.size)})</p>`;
        });
        
        const infoDiv = document.createElement('div');
        infoDiv.innerHTML = fileInfo;
        infoDiv.style.marginTop = '1rem';
        infoDiv.style.padding = '1rem';
        infoDiv.style.backgroundColor = 'white';
        infoDiv.style.borderRadius = '8px';
        
        // Retirer l'ancienne info si elle existe
        const existingInfo = zone.querySelector('.file-info');
        if (existingInfo) {
            existingInfo.remove();
        }
        
        infoDiv.classList.add('file-info');
        zone.appendChild(infoDiv);
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ========================================
// GESTION DU SCROLL
// ========================================
function initScrollEffects() {
    let lastScroll = 0;
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Ajouter une ombre au header lors du scroll
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
            nav.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            nav.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        }
        
        lastScroll = currentScroll;
    });
}

// ========================================
// ANIMATIONS AU SCROLL
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer toutes les cartes
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// ========================================
// GESTION DU CLAVIER
// ========================================
function initKeyboardNavigation() {
    const sections = ['accueil', 'travaux', 'notes', 'documents', 'certifications', 'projet', 'soutenance', 'ressources'];
    let currentIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        // Navigation avec les flèches gauche/droite
        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % sections.length;
            showSection(sections[currentIndex]);
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + sections.length) % sections.length;
            showSection(sections[currentIndex]);
        }
    });
}

// ========================================
// GESTION DES LIENS
// ========================================
function initExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    
    links.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}

// ========================================
// INITIALISATION AU CHARGEMENT
// ========================================
function init() {
    console.log('🚀 Initialisation du portfolio...');
    
    // Mettre à jour la date
    updateLastModifiedDate();
    
    // Initialiser les zones d'upload
    initUploadZones();
    
    // Initialiser les effets de scroll
    initScrollEffects();
    
    // Initialiser les animations
    initScrollAnimations();
    
    // Initialiser la navigation clavier
    initKeyboardNavigation();
    
    // Initialiser les liens externes
    initExternalLinks();
    
    // Restaurer la section active si sauvegardée
    restoreActiveSection();
    
    console.log('✅ Portfolio initialisé avec succès !');
}

// ========================================
// DÉMARRAGE DE L'APPLICATION
// ========================================
document.addEventListener('DOMContentLoaded', init);

// Export des fonctions principales (pour utilisation externe si nécessaire)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showSection,
        updateLastModifiedDate
    };
}