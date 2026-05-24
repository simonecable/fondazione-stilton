/* ==========================================================================
   LOGICA APPLICATIVA - FONDAZIONE GERONIMO STILTON
   Gestione: Navigazione SPA, Login Admin, Compressione Immagini e LocalStorage
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- STATO DELL'APPLICAZIONE ---
    let events = [];
    let compressedImageBase64 = ""; // Memorizza la foto compressa pronta per il salvataggio
    let currentLang = localStorage.getItem('fondazione_lang') || 'it';
    let isEventsExpanded = false; // Stato espansione griglia eventi
    
    let donations = {}; // Memorizza le credenziali di donazione attive
    const DEFAULT_DONATIONS = {
        beneficiario: "Fondazione Geronimo Stilton",
        iban: "IT99C1234512345123456789012",
        banca: "Banca dei Formaggi S.p.A.",
        swift: "BAFOIT2MXXX",
        paypalEmail: "donazioni@fondazionegeronimostilton.it",
        paypalLink: "https://www.paypal.me/fondazionestilton",
        stripeLink: "https://donate.stripe.com/demo"
    };

    const TRANSLATIONS = {
        it: {
            nav_home: "Home",
            nav_about: "Chi siamo",
            nav_events: "Attività",
            nav_donations: "Sostienici",
            nav_contact: "Contatti",
            
            hero_title: "BENVENUTI NEL NOSTRO MONDO",
            hero_subtitle: "Insieme, tutto diventa possibile!",
            hero_description: "La Fondazione Geronimo Stilton sostiene progetti di solidarietà, salute e istruzione per l'infanzia, trasmettendo i valori positivi dell'amicizia, del rispetto e dell'amore per la lettura.",
            
            about_title: "CHI SIAMO",
            about_subtitle: "di Elisabetta Dami",
            about_letter_html: `
                <p>Tanti anni fa ho scoperto che non avrei potuto avere figli. Per esprimere in un modo diverso il mio senso materno, ho cominciato a fare volontariato in un ospedale pediatrico, con il desiderio di donare un sorriso ai bambini malati.</p>
                <p>Così sono nate le storie di Geronimo Stilton: un roditore buffo, timido e tenero, un giornalista che vive nell’Isola dei Topi, ma viaggia in tutto il mondo, sempre pronto a incontrare nuovi amici, esplorare nuove realtà e tendere la zampa a chi ha bisogno.</p>
                <p>Storie avventurose create per donare un sorriso, ma anche coraggio e speranza ai ragazzi in ospedale. Storie tutte a lieto fine, perché Geronimo è un topo ottimista, capace di vedere sempre il lato bello e buono della vita, anche nei momenti difficili.</p>
                <p>Storie nate dal cuore… oggi tradotte in più di 50 lingue, perché sanno arrivare al cuore di milioni di lettori nel mondo.</p>
                <p>Ancora oggi, dedico tutto il mio tempo libero al volontariato: incontro i ragazzi negli ospedali e nelle scuole, sono al fianco delle Istituzioni italiane, mi impegno in progetti solidali e nella difesa della natura.</p>
                <p>Per questo, nel 2019, ho dato vita alla Fondazione Geronimo Stilton.</p>
                <p>Perché quando si riceve tanto, nasce il desiderio di restituire. Perché solo insieme, ognuno secondo le proprie possibilità, possiamo costruire un mondo più gentile, più giusto e più felice.</p>
                <p>Grazie per essere qui oggi. Grazie per condividere con me, con Geronimo e con la nostra Fondazione valori importanti come amicizia, gentilezza, solidarietà, impegno e rispetto.</p>
                <p>Continuiamo a volare insieme sulle ali della fantasia, è bello sognare insieme!</p>
                <div class="letter-signature">
                    <p>Con amicizia e affetto,</p>
                    <img src="elisabetta.png" alt="Elisabetta Dami" class="signature-img">
                    <strong>Elisabetta Dami</strong>
                    <span>Presidente della Fondazione Geronimo Stilton</span>
                </div>
            `,
            
            events_title: "ATTIVITÀ",
            events_description_html: `
                <p>La Fondazione Geronimo Stilton collabora con le Istituzioni italiane, le scuole, gli ospedali e varie associazioni benefiche.</p>
                <p>Incontriamo ragazze e ragazzi per promuovere l’amore per la lettura e accompagnarli alla scoperta dei valori universali come lealtà, onestà, sincerità, generosità e solidarietà, amicizia, gentilezza, amore per la natura, rispetto per se stessi e gli altri, per la famiglia e la scuola, per le istituzioni e la legalità.</p>
            `,
            events_empty: "Nessun incontro pubblicato al momento. Torna presto a trovarci!",
            
            donations_title: "SOSTIENICI",
            donations_tagline: "Sostieni i nostri progetti, insieme tutto è possibile.",
            donations_iban_title: "Bonifico Bancario",
            donations_iban_desc: "Fai un bonifico diretto sul conto corrente della Fondazione.",
            donations_beneficiary: "Beneficiario",
            donations_bank: "Banca",
            donations_copy_btn: "📋 Copia IBAN",
            donations_paypal_desc: "Sostienici in modo rapido e sicuro utilizzando il tuo saldo PayPal o carta.",
            donations_paypal_btn: "Dona con PayPal",
            donations_wallets_title: "Digital Wallets",
            donations_wallets_desc: "Usa Apple Pay o Google Pay per una donazione ultra-rapida e sicura.",
            
            contact_title: "CONTATTI",
            contact_name_label: "Nome",
            contact_name_placeholder: "Il tuo nome",
            contact_email_label: "Email",
            contact_email_placeholder: "La tua email",
            contact_message_label: "Messaggio",
            contact_message_placeholder: "Scrivi qui il tuo messaggio...",
            contact_send_btn: "Invia Messaggio",
            contact_success: "Grazie per averci contattato! Ti risponderemo prestissimo.",
            
            footer_text: "Creato per la scrittrice Elisabetta Dami.",
            footer_reserved: "Area Riservata",
            
            toast_copied: "IBAN copiato con successo!",
            toast_saved: "Configurazione donazioni salvata!",
            toast_sim_pay: "Simulazione: Apertura di {platform} in corso...",
            toast_sim_pay_alert: "[SIMULAZIONE DI PAGAMENTO]\nGrazie per aver scelto di donare con {platform}!\n\nIn produzione, l'utente viene indirizzato al link Stripe configurato nell'Admin Panel:\n{link}"
        },
        en: {
            nav_home: "Home",
            nav_about: "About Us",
            nav_events: "Activities",
            nav_donations: "Support Us",
            nav_contact: "Contact",
            
            hero_title: "WELCOME TO OUR WORLD",
            hero_subtitle: "Together, everything becomes possible!",
            hero_description: "The Geronimo Stilton Foundation supports solidarity, health, and education projects for children, transmitting the positive values of friendship, respect, and love for reading.",
            
            about_title: "ABOUT US",
            about_subtitle: "by Elisabetta Dami",
            about_letter_html: `
                <p>Many years ago, I discovered that I could not have children. To express my maternal feelings in a different way, I began volunteering in a pediatric hospital, with the desire to bring a smile to sick children.</p>
                <p>This is how the stories of Geronimo Stilton were born: a funny, shy, and tender rodent, a journalist who lives on Mouse Island but travels all over the world, always ready to meet new friends, explore new realities, and lend a helping paw to those in need.</p>
                <p>Adventurous stories created to bring a smile, but also courage and hope to children in the hospital. Stories that all have a happy ending, because Geronimo is an optimistic mouse, capable of always seeing the beautiful and good side of life, even in difficult moments.</p>
                <p>Stories born from the heart... today translated into more than 50 languages, because they know how to touch the hearts of millions of readers worldwide.</p>
                <p>Even today, I dedicate all my free time to volunteering: I meet children in hospitals and schools, I stand alongside Italian institutions, and I commit myself to solidarity projects and the defense of nature.</p>
                <p>For this reason, in 2019, I founded the Geronimo Stilton Foundation.</p>
                <p>Because when you receive so much, you feel the desire to give back. Because only together, each according to their own possibilities, can we build a kinder, fairer, and happier world.</p>
                <p>Thank you for being here today. Thank you for sharing with me, with Geronimo, and with our Foundation important values such as friendship, kindness, solidarity, commitment, and respect.</p>
                <p>Let's continue to fly together on the wings of imagination, it's beautiful to dream together!</p>
                <div class="letter-signature">
                    <p>With friendship and affection,</p>
                    <img src="elisabetta.png" alt="Elisabetta Dami" class="signature-img">
                    <strong>Elisabetta Dami</strong>
                    <span>President of the Geronimo Stilton Foundation</span>
                </div>
            `,
            
            events_title: "ACTIVITIES",
            events_description_html: `
                <p>The Geronimo Stilton Foundation collaborates with Italian Institutions, schools, hospitals, and various charitable associations.</p>
                <p>We meet young boys and girls to promote the love of reading and guide them to discover universal values such as loyalty, honesty, sincerity, generosity and solidarity, friendship, kindness, love for nature, respect for oneself and others, for family and school, for institutions and legality.</p>
            `,
            events_empty: "No events published at the moment. Please come back soon!",
            
            donations_title: "SUPPORT US",
            donations_tagline: "Support our projects, together everything is possible.",
            donations_iban_title: "Bank Transfer",
            donations_iban_desc: "Make a direct bank transfer to the Foundation's account.",
            donations_beneficiary: "Beneficiary",
            donations_bank: "Bank",
            donations_copy_btn: "📋 Copy IBAN",
            donations_paypal_desc: "Support us quickly and securely using your PayPal balance or card.",
            donations_paypal_btn: "Donate with PayPal",
            donations_wallets_title: "Digital Wallets",
            donations_wallets_desc: "Use Apple Pay or Google Pay for an ultra-fast and secure donation.",
            
            contact_title: "CONTACT",
            contact_name_label: "Name",
            contact_name_placeholder: "Your name",
            contact_email_label: "Email",
            contact_email_placeholder: "Your email",
            contact_message_label: "Message",
            contact_message_placeholder: "Write your message here...",
            contact_send_btn: "Send Message",
            contact_success: "Thank you for contacting us! We will reply very soon.",
            
            footer_text: "Created for the writer Elisabetta Dami.",
            footer_reserved: "Reserved Area",
            
            toast_copied: "IBAN successfully copied!",
            toast_saved: "Donation configuration saved!",
            toast_sim_pay: "Simulation: Opening {platform}...",
            toast_sim_pay_alert: "[PAYMENT SIMULATION]\nThank you for choosing to donate with {platform}!\n\nIn production, the user is redirected to the Stripe link configured in the Admin Panel:\n{link}"
        }
    };
    
    // Credenziali predefinite dell'amministratore
    const ADMIN_CREDENTIALS = {
        username: 'admin',
        password: 'Kiccostilton2026'
    };

    // --- EVENTI PRE-CARICATI DI DEFAULT ---
    const DEFAULT_EVENTS = [
        {
            id: 1,
            title_it: "Letture animate e sorrisi nei reparti pediatrici",
            title_en: "Animated readings and smiles in pediatric wards",
            date: "2026-04-15",
            desc_it: "In linea con l'ispirazione originaria di Elisabetta Dami, abbiamo portato le avventure di Geronimo Stilton nei reparti pediatrici degli ospedali. Ore di sorrisi, letture condivise e donazione di libri per regalare momenti di spensieratezza e coraggio ai piccoli lettori.",
            desc_en: "In line with Elisabetta Dami's original inspiration, we brought the adventures of Geronimo Stilton to pediatric hospital wards. Hours of smiles, shared readings, and book donations to give moments of lightheartedness and courage to young readers.",
            img: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 2,
            title_it: "Giornata della lettura e del rispetto al Festival dei Ragazzi",
            title_en: "Reading and Respect Day at the Children's Festival",
            date: "2026-03-22",
            desc_it: "Un incontro straordinario all'aperto dedicato alla scoperta del piacere della lettura. Insieme a centinaia di bambini delle scuole elementari, abbiamo esplorato i valori dell'amicizia e del rispetto reciproco attraverso giochi letterari e racconti avvincenti.",
            desc_en: "An extraordinary outdoor meeting dedicated to discovering the pleasure of reading. Together with hundreds of elementary school children, we explored the values of friendship and mutual respect through literary games and engaging stories.",
            img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80"
        },
        {
            id: 3,
            title_it: "Laboratorio Ecologico: Esploratori della Natura",
            title_en: "Ecological Workshop: Nature Explorers",
            date: "2026-02-10",
            desc_it: "Ispirandoci alle storie di Lupo Blu scritte da Elisabetta, abbiamo organizzato un laboratorio pratico per educare i ragazzi alla tutela della natura, dell'ambiente e degli animali selvatici, piantando piccoli semi di speranza per il futuro del pianeta.",
            desc_en: "Inspired by the stories of Lupo Blu written by Elisabetta, we organized a practical workshop to educate children on the protection of nature, the environment, and wild animals, planting small seeds of hope for the planet's future.",
            img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80"
        }
    ];

    // --- ELEMENTI DOM ---
    const publicView = document.getElementById('public-view');
    const adminView = document.getElementById('admin-view');
    const adminLoginView = document.getElementById('admin-login-view');
    const adminDashboardView = document.getElementById('admin-dashboard-view');
    
    // Navigazione
    const navItems = document.querySelectorAll('.nav-item');
    const logoHome = document.getElementById('logo-home');
    const footerAdminBtn = document.getElementById('footer-admin-btn');
    
    // Form Login
    const loginForm = document.getElementById('login-form');
    const loginUsernameInput = document.getElementById('login-username');
    const loginPasswordInput = document.getElementById('login-password');
    const loginErrorMsg = document.getElementById('login-error-msg');
    const btnLogout = document.getElementById('btn-logout');

    // Form Eventi
    const addEventForm = document.getElementById('add-event-form');
    const eventTitleItInput = document.getElementById('event-title-it');
    const eventTitleEnInput = document.getElementById('event-title-en');
    const eventDateInput = document.getElementById('event-date');
    const eventDescItInput = document.getElementById('event-desc-it');
    const eventDescEnInput = document.getElementById('event-desc-en');
    const eventImageInput = document.getElementById('event-image');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreviewImg = document.getElementById('image-preview-img');
    const btnClearImg = document.getElementById('btn-clear-img');
    
    // Griglie ed elenchi
    const eventsDisplayGrid = document.getElementById('events-display-grid');
    const adminEventsList = document.getElementById('admin-events-list');

    // --- GESTIONE BILINGUE (INTERNAZIONALIZZAZIONE) ---
    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('fondazione_lang', lang);

        // Aggiorna bottoni switcher
        document.querySelectorAll('.btn-lang').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Traduci elementi con data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
                if (key.endsWith('_html')) {
                    el.innerHTML = TRANSLATIONS[lang][key];
                } else {
                    el.textContent = TRANSLATIONS[lang][key];
                }
            }
        });

        // Traduci placeholder con data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
                el.placeholder = TRANSLATIONS[lang][key];
            }
        });

        // Ricarica componenti dinamici
        renderEvents();
        renderDonations();
    }

    // Listener pulsanti lingua
    document.querySelectorAll('.btn-lang').forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLang = btn.getAttribute('data-lang');
            setLanguage(selectedLang);
        });
    });

    // --- GESTIONE ROUTING SPA (NAVIGAZIONE FLUIDA) ---
    function handleRouting() {
        const hash = window.location.hash || '#home';
        
        // Disattiva tutte le classi attive nel menu
        navItems.forEach(item => item.classList.remove('active'));

        if (hash === '#admin') {
            // Mostra Vista Riservata
            publicView.classList.add('hidden');
            adminView.classList.remove('hidden');
            
            // Controlla se l'utente è già loggato
            const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
            if (isLoggedIn) {
                adminLoginView.classList.add('hidden');
                adminDashboardView.classList.remove('hidden');
            } else {
                adminLoginView.classList.remove('hidden');
                adminDashboardView.classList.add('hidden');
                loginForm.reset();
                loginErrorMsg.classList.add('hidden');
            }
        } else {
            // Mostra Vista Pubblica
            publicView.classList.remove('hidden');
            adminView.classList.add('hidden');

            // Attiva la voce di menu corrispondente
            if (hash === '#home') {
                document.getElementById('nav-home')?.classList.add('active');
            } else if (hash === '#chi-siamo') {
                document.getElementById('nav-about')?.classList.add('active');
            } else if (hash === '#attivita') {
                document.getElementById('nav-events')?.classList.add('active');
                isEventsExpanded = false;
                renderEvents();
            } else if (hash === '#sostienici') {
                document.getElementById('nav-donations')?.classList.add('active');
            } else if (hash === '#contatti') {
                document.getElementById('nav-contact')?.classList.add('active');
            }
        }
    }

    // Ascolto dei cambi di hash e del caricamento iniziale
    window.addEventListener('hashchange', handleRouting);
    handleRouting();
    setLanguage(currentLang); // Applica lingua salvata o default

    // Gestione clic sulle voci menu per lo scorrimento
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            if (href.startsWith('#') && window.location.hash === href) {
                // Forza lo scorrimento se l'hash è già lo stesso
                e.preventDefault();
                const targetEl = document.querySelector(href);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // --- GESTIONE DATI EVENTI (LOCAL STORAGE) ---
    function loadEvents() {
        const stored = localStorage.getItem('fondazione_events');
        if (stored) {
            events = JSON.parse(stored);
        } else {
            // Se vuoto, carica gli incontri predefiniti e salvali
            events = [...DEFAULT_EVENTS];
            localStorage.setItem('fondazione_events', JSON.stringify(events));
        }
        renderEvents();
    }

    function renderEvents() {
        // Ordina gli incontri per data decrescente (i più recenti per primi)
        const sortedEvents = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));

        // 1. Renderizza sulla Homepage Pubblica
        if (sortedEvents.length === 0) {
            const emptyText = TRANSLATIONS[currentLang].events_empty;
            eventsDisplayGrid.innerHTML = `
                <div class="empty-events" style="grid-column: 1 / -1; text-align: center; padding: 40px var(--padding-md);">
                    <p style="color: var(--text-muted); font-size: 1.1rem; font-family: var(--font-main); font-weight: 500;">${emptyText}</p>
                </div>
            `;
        } else {
            // Se non espanso e ci sono più di 2 eventi, mostra solo i primi 2 + la card fumetto "Ancora..."
            const showCollapsed = !isEventsExpanded && sortedEvents.length > 2;
            const eventsToRender = showCollapsed ? sortedEvents.slice(0, 2) : sortedEvents;

            let htmlContent = eventsToRender.map(ev => {
                // Formatta la data bilingue
                const dateObj = new Date(ev.date);
                const locale = currentLang === 'it' ? 'it-IT' : 'en-US';
                const formattedDate = isNaN(dateObj.getTime()) ? ev.date : dateObj.toLocaleDateString(locale, {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                });

                const title = currentLang === 'it' ? (ev.title_it || ev.title) : (ev.title_en || ev.title || ev.title_it);
                const desc = currentLang === 'it' ? (ev.desc_it || ev.desc) : (ev.desc_en || ev.desc || ev.desc_it);

                return `
                    <article class="event-card">
                        <div class="event-img-wrapper">
                            <img src="${ev.img}" alt="${title}" class="event-card-img" onerror="this.src='https://placehold.co/600x400/f39c12/ffffff?text=Incontro+Fondazione';">
                        </div>
                        <div class="event-info">
                            <time datetime="${ev.date}" class="event-date">${formattedDate}</time>
                            <h3 class="event-card-title">${title}</h3>
                            <p class="event-card-desc">${desc}</p>
                        </div>
                    </article>
                `;
            }).join('');

            if (showCollapsed) {
                const bubbleTitle = currentLang === 'it'
                    ? "Insieme a Geronimo, facciamo tante cose belle!"
                    : "Together with Geronimo, we do so many beautiful things!";
                const bubbleText = currentLang === 'it'
                    ? "Clicca qui per scoprire gli altri incontri della Fondazione nei reparti pediatrici e nelle scuole."
                    : "Click here to discover other Foundation meetings in pediatric wards and schools.";
                const labelText = currentLang === 'it' ? "Ancora..." : "More...";

                htmlContent += `
                    <div class="speech-bubble-wrapper" id="btn-expand-events">
                        <div class="speech-bubble-card">
                            <h3 class="event-card-title" style="margin-bottom: 12px; font-size: 1.25rem;">${bubbleTitle}</h3>
                            <p class="event-card-desc">${bubbleText}</p>
                        </div>
                        <div class="speech-bubble-label">${labelText}</div>
                    </div>
                `;
            }

            eventsDisplayGrid.innerHTML = htmlContent;

            // Aggiungi click listener per espandere gli eventi
            const expandBtn = document.getElementById('btn-expand-events');
            if (expandBtn) {
                expandBtn.addEventListener('click', () => {
                    isEventsExpanded = true;
                    renderEvents();
                });
            }
        }

        // 2. Renderizza nel Pannello di Gestione Amministratore
        if (sortedEvents.length === 0) {
            const noEventsText = currentLang === 'it' ? "Non ci sono incontri registrati." : "No registered events.";
            adminEventsList.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 20px;">${noEventsText}</p>`;
        } else {
            adminEventsList.innerHTML = sortedEvents.map(ev => {
                const title = currentLang === 'it' ? (ev.title_it || ev.title) : (ev.title_en || ev.title || ev.title_it);
                return `
                    <div class="admin-event-item">
                        <img src="${ev.img}" alt="" class="admin-event-thumb" onerror="this.src='https://placehold.co/100/f39c12/ffffff?text=Foto';">
                        <div class="admin-event-details">
                            <h4 class="admin-event-title-text" title="${title}">${title}</h4>
                            <span class="admin-event-date-text">${ev.date}</span>
                        </div>
                        <button class="btn-delete-event" data-id="${ev.id}" title="${currentLang === 'it' ? 'Elimina questo incontro' : 'Delete this event'}" aria-label="Elimina incontro">🗑️</button>
                    </div>
                `;
            }).join('');

            // Aggiungi event listener ai pulsanti di eliminazione
            const deleteButtons = adminEventsList.querySelectorAll('.btn-delete-event');
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const idToDelete = parseInt(btn.getAttribute('data-id'));
                    deleteEvent(idToDelete);
                });
            });
        }
    }

    function deleteEvent(id) {
        const confirmMsg = currentLang === 'it' ? "Sei sicuro di voler eliminare definitivamente questo incontro?" : "Are you sure you want to permanently delete this event?";
        if (confirm(confirmMsg)) {
            events = events.filter(ev => ev.id !== id);
            localStorage.setItem('fondazione_events', JSON.stringify(events));
            renderEvents();
        }
    }

    // --- CARICAMENTO E COMPRESSIONE IMMAGINE (BULLETPROOF CLIENT-SIDE) ---
    eventImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                // Compressione tramite Canvas per limitare la dimensione dell'immagine (max 600px larghezza/altezza)
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const max_size = 600;

                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width;
                        width = max_size;
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height;
                        height = max_size;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Converti in JPEG compresso (qualità 0.6) - produce un file leggerissimo di 20-40KB
                compressedImageBase64 = canvas.toDataURL('image/jpeg', 0.6);
                
                // Mostra anteprima
                imagePreviewImg.src = compressedImageBase64;
                imagePreviewContainer.classList.remove('hidden');
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Rimuovi anteprima foto
    function resetImageUpload() {
        eventImageInput.value = "";
        compressedImageBase64 = "";
        imagePreviewImg.src = "";
        imagePreviewContainer.classList.add('hidden');
    }
    
    btnClearImg.addEventListener('click', resetImageUpload);

    // --- FORM INSERIMENTO NUOVO INCONTRO (BILINGUE) ---
    addEventForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const titleIt = eventTitleItInput.value.trim();
        const titleEn = eventTitleEnInput.value.trim();
        const date = eventDateInput.value;
        const descIt = eventDescItInput.value.trim();
        const descEn = eventDescEnInput.value.trim();

        if (!titleIt || !titleEn || !date || !descIt || !descEn || !compressedImageBase64) {
            const alertMsg = currentLang === 'it' ? "Per favore, compila tutti i campi (sia IT che EN) e carica una foto." : "Please fill in all fields (both IT and EN) and upload a photo.";
            alert(alertMsg);
            return;
        }

        // Crea il nuovo oggetto bilingue
        const newEvent = {
            id: Date.now(),
            title_it: titleIt,
            title_en: titleEn,
            date: date,
            desc_it: descIt,
            desc_en: descEn,
            img: compressedImageBase64
        };

        events.push(newEvent);
        localStorage.setItem('fondazione_events', JSON.stringify(events));
        
        addEventForm.reset();
        resetImageUpload();
        renderEvents();
        
        const successMsg = currentLang === 'it' ? "Incontro salvato e pubblicato con successo!" : "Event saved and published successfully!";
        alert(successMsg);
    });

    // --- FORM CONTATTI PUBBLICO (BILINGUE) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert(TRANSLATIONS[currentLang].contact_success);
            contactForm.reset();
        });
    }

    // --- GESTIONE LOGIN / AUTENTICAZIONE ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = loginUsernameInput.value.trim();
        const password = loginPasswordInput.value;

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            // Successo
            sessionStorage.setItem('adminLoggedIn', 'true');
            loginErrorMsg.classList.add('hidden');
            
            // Passa al pannello dashboard
            adminLoginView.classList.add('hidden');
            adminDashboardView.classList.remove('hidden');
        } else {
            // Fallimento
            loginErrorMsg.classList.remove('hidden');
            loginPasswordInput.value = "";
        }
    });

    // Logout
    btnLogout.addEventListener('click', () => {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.hash = '#home'; // Riporta alla home
    });

    // --- GESTIONE DATI DONAZIONI (LOCAL STORAGE) ---
    function loadDonations() {
        const stored = localStorage.getItem('fondazione_donations');
        if (stored) {
            donations = JSON.parse(stored);
        } else {
            donations = { ...DEFAULT_DONATIONS };
            localStorage.setItem('fondazione_donations', JSON.stringify(donations));
        }
        renderDonations();
        populateAdminDonationsForm();
    }

    function renderDonations() {
        // Popola i campi della pagina pubblica
        const pubBenef = document.getElementById('pub-don-beneficiario');
        const pubIban = document.getElementById('pub-don-iban');
        const pubBanca = document.getElementById('pub-don-banca');
        const pubSwift = document.getElementById('pub-don-swift');

        if (pubBenef) pubBenef.textContent = donations.beneficiario || "-";
        if (pubIban) pubIban.textContent = donations.iban || "-";
        if (pubBanca) pubBanca.textContent = donations.banca || "-";
        if (pubSwift) pubSwift.textContent = donations.swift || "-";

        // PayPal href
        const paypalBtn = document.getElementById('pub-don-paypal-btn');
        if (paypalBtn) {
            if (donations.paypalLink) {
                paypalBtn.href = donations.paypalLink;
            } else if (donations.paypalEmail) {
                paypalBtn.href = `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=${encodeURIComponent(donations.paypalEmail)}&currency_code=EUR`;
            } else {
                paypalBtn.href = "#";
            }
        }
    }

    function populateAdminDonationsForm() {
        // Popola i campi del form admin
        const benefInput = document.getElementById('admin-don-beneficiario');
        const ibanInput = document.getElementById('admin-don-iban');
        const bancaInput = document.getElementById('admin-don-banca');
        const swiftInput = document.getElementById('admin-don-swift');
        const paypalEmailInput = document.getElementById('admin-don-paypal-email');
        const paypalLinkInput = document.getElementById('admin-don-paypal-link');
        const stripeLinkInput = document.getElementById('admin-don-stripe-link');

        if (benefInput) benefInput.value = donations.beneficiario || "";
        if (ibanInput) ibanInput.value = donations.iban || "";
        if (bancaInput) bancaInput.value = donations.banca || "";
        if (swiftInput) swiftInput.value = donations.swift || "";
        if (paypalEmailInput) paypalEmailInput.value = donations.paypalEmail || "";
        if (paypalLinkInput) paypalLinkInput.value = donations.paypalLink || "";
        if (stripeLinkInput) stripeLinkInput.value = donations.stripeLink || "";
    }

    // --- UTILI: TOAST NOTIFICATION ---
    function showToast(message) {
        let toast = document.querySelector('.toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.innerHTML = `<span class="toast-icon">✨</span><span class="toast-message"></span>`;
            document.body.appendChild(toast);
        }
        toast.querySelector('.toast-message').textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // --- INTERATTIVITÀ PUBBLICA DONAZIONI ---
    const btnCopyIban = document.getElementById('btn-copy-iban');
    if (btnCopyIban) {
        btnCopyIban.addEventListener('click', () => {
            const ibanText = donations.iban;
            navigator.clipboard.writeText(ibanText).then(() => {
                showToast(TRANSLATIONS[currentLang].toast_copied);
            }).catch(err => {
                console.error("Errore nella copia:", err);
                // Fallback manuale se necessario
                const tempInput = document.createElement('input');
                tempInput.value = ibanText;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showToast(TRANSLATIONS[currentLang].toast_copied);
            });
        });
    }

    // Gestione click Apple Pay e Google Pay
    const btnApple = document.getElementById('pub-don-apple-btn');
    const btnGoogle = document.getElementById('pub-don-google-btn');

    const handleMobilePayClick = (platform) => {
        if (donations.stripeLink && donations.stripeLink !== "https://donate.stripe.com/demo") {
            window.open(donations.stripeLink, '_blank');
        } else {
            const simToast = TRANSLATIONS[currentLang].toast_sim_pay.replace('{platform}', platform);
            showToast(simToast);
            setTimeout(() => {
                const stripeLinkText = donations.stripeLink || (currentLang === 'it' ? "Nessun link configurato" : "No link configured");
                const simAlert = TRANSLATIONS[currentLang].toast_sim_pay_alert
                    .replace('{platform}', platform)
                    .replace('{link}', stripeLinkText);
                alert(simAlert);
            }, 500);
        }
    };

    if (btnApple) {
        btnApple.addEventListener('click', () => handleMobilePayClick('Apple Pay'));
    }
    if (btnGoogle) {
        btnGoogle.addEventListener('click', () => handleMobilePayClick('Google Pay'));
    }

    // --- FORM DI CONFIGURAZIONE DONAZIONI (ADMIN) ---
    const adminDonationsForm = document.getElementById('admin-donations-form');
    if (adminDonationsForm) {
        adminDonationsForm.addEventListener('submit', (e) => {
            e.preventDefault();

            donations.beneficiario = document.getElementById('admin-don-beneficiario').value.trim();
            donations.iban = document.getElementById('admin-don-iban').value.trim();
            donations.banca = document.getElementById('admin-don-banca').value.trim();
            donations.swift = document.getElementById('admin-don-swift').value.trim();
            donations.paypalEmail = document.getElementById('admin-don-paypal-email').value.trim();
            donations.paypalLink = document.getElementById('admin-don-paypal-link').value.trim();
            donations.stripeLink = document.getElementById('admin-don-stripe-link').value.trim();

            localStorage.setItem('fondazione_donations', JSON.stringify(donations));
            renderDonations();
            
            showToast(TRANSLATIONS[currentLang].toast_saved);
            const successMsg = currentLang === 'it' ? "Credenziali e link di donazione aggiornati con successo!" : "Donation credentials and links successfully updated!";
            alert(successMsg);
        });
    }

    // Controlla il login per popolare correttamente il form donazioni admin se l'utente accede direttamente
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '#admin' && sessionStorage.getItem('adminLoggedIn') === 'true') {
            populateAdminDonationsForm();
        }
    });

    // --- INIZIALIZZAZIONE ---
    loadEvents();
    loadDonations();
});
