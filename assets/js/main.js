/*===== MENU SHOW =====*/
const setupMenu = (toggleId, navId, overlayId) => {
    const toggle = document.getElementById(toggleId)
    const nav = document.getElementById(navId)
    const overlay = document.getElementById(overlayId)

    if (!toggle || !nav || !overlay) {
        return
    }

    const setMenuState = (isOpen) => {
        nav.classList.toggle('show', isOpen)
        overlay.classList.toggle('show', isOpen)
        document.body.classList.toggle('nav-open', isOpen)
        toggle.setAttribute('aria-expanded', String(isOpen))
    }

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.contains('show')
        setMenuState(!isOpen)
    })

    toggle.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            const isOpen = nav.classList.contains('show')
            setMenuState(!isOpen)
        }
    })

    overlay.addEventListener('click', () => {
        setMenuState(false)
    })

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setMenuState(false)
        }
    })

    return setMenuState
}

const setMenuState = setupMenu('nav-toggle', 'nav-menu', 'nav-overlay')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link, .nav__admin-button')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    const navOverlay = document.getElementById('nav-overlay')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
    if (navOverlay) {
        navOverlay.classList.remove('show')
    }
    document.body.classList.remove('nav-open')
    const navToggle = document.getElementById('nav-toggle')
    if (navToggle) {
        navToggle.setAttribute('aria-expanded', 'false')
    }
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollDown = window.scrollY

  sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if (!sectionsClass) {
            return
        }
        
        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
        }else{
            sectionsClass.classList.remove('active-link')
        }                                                    
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{}); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 
sr.reveal('.skills__data, .work__img, .contact__input',{interval: 200}); 

/*==================== PROBLEM LOG PAGE ====================*/
const logForm = document.getElementById('log-form')
const logList = document.getElementById('log-list')
const logEmpty = document.getElementById('log-empty')
const logClear = document.getElementById('log-clear')

if (logForm && logList && logEmpty) {
    const storageKey = 'rafay.problemLog.entries'

    const loadEntries = () => {
        try {
            return JSON.parse(localStorage.getItem(storageKey)) || []
        } catch (error) {
            return []
        }
    }

    const saveEntries = (entries) => {
        localStorage.setItem(storageKey, JSON.stringify(entries))
    }

    const formatDate = (value) => {
        const date = new Date(value)
        return Number.isNaN(date.getTime()) ? '' : date.toLocaleString()
    }

    const renderEntries = () => {
        const entries = loadEntries().sort((left, right) => right.createdAt - left.createdAt)

        logList.innerHTML = ''
        logEmpty.hidden = entries.length > 0

        entries.forEach((entry) => {
            const article = document.createElement('article')
            article.className = 'log-card'
            article.innerHTML = `
                <div class="log-card__header">
                    <div>
                        <span class="log-card__meta">${entry.type}</span>
                        <h3 class="log-card__title">${entry.problem}</h3>
                    </div>
                    <button type="button" class="log-card__delete" data-id="${entry.id}" aria-label="Delete entry">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
                <p class="log-card__text">${entry.details}</p>
                ${entry.solution ? `<div class="log-card__solution"><strong>Solution:</strong> ${entry.solution}</div>` : ''}
                <div class="log-card__footer">
                    <span>${formatDate(entry.createdAt)}</span>
                    ${entry.tags ? `<span>${entry.tags}</span>` : ''}
                </div>
            `
            logList.appendChild(article)
        })
    }

    logForm.addEventListener('submit', (event) => {
        event.preventDefault()

        const formData = new FormData(logForm)
        const entries = loadEntries()

        entries.push({
            id: Date.now().toString(),
            problem: String(formData.get('problem') || '').trim(),
            details: String(formData.get('details') || '').trim(),
            solution: String(formData.get('solution') || '').trim(),
            tags: String(formData.get('tags') || '').trim(),
            type: String(formData.get('type') || 'Problem'),
            createdAt: Date.now(),
        })

        saveEntries(entries)
        logForm.reset()
        renderEntries()
    })

    logList.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.log-card__delete')

        if (!deleteButton) {
            return
        }

        const entryId = deleteButton.getAttribute('data-id')
        const filteredEntries = loadEntries().filter((entry) => entry.id !== entryId)

        saveEntries(filteredEntries)
        renderEntries()
    })

    if (logClear) {
        logClear.addEventListener('click', () => {
            localStorage.removeItem(storageKey)
            renderEntries()
        })
    }

    renderEntries()
}

/*==================== ADMIN AUTH PAGE ====================*/
const adminAuthForm = document.getElementById('admin-auth-form')
const adminAuthMessage = document.getElementById('admin-auth-message')

if (adminAuthForm && adminAuthMessage) {
    const ADMIN_USERNAME = 'admin'
    const ADMIN_PASSWORD = 'rafay123'

    adminAuthForm.addEventListener('submit', (event) => {
        event.preventDefault()

        const formData = new FormData(adminAuthForm)
        const username = String(formData.get('username') || '').trim()
        const password = String(formData.get('password') || '').trim()

        adminAuthMessage.classList.remove('admin-message--ok', 'admin-message--error')

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            localStorage.setItem('rafay.admin.authenticated', 'true')
            adminAuthMessage.textContent = 'Authentication successful. Admin mode is enabled in this browser.'
            adminAuthMessage.classList.add('admin-message--ok')
            adminAuthForm.reset()
            return
        }

        adminAuthMessage.textContent = 'Invalid credentials. Please try again.'
        adminAuthMessage.classList.add('admin-message--error')
    })
}
