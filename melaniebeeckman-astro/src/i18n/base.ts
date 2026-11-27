/* Page copy in NL and EN. Copy changes happen here, not in Strapi. No em dashes. */
const base = {
  nl: {
    ui: { menu: "Hoofdmenu", footerMenu: "Voettekstmenu", language: "Taal", pages: "Pagina’s" },
    nav: { home: "Start", about: "Over mij", services: "Aanbod", sessions: "Sessies", orgs: "Organisaties", faq: "Vragen", contact: "Contact", book: "Afspraak" },
    shared: { bookGroup: "Boek een groepssessie", bookTalk: "Boek een lezing" },
    home: {
      eyebrow: "Klinisch psycholoog (PhD) in Gent en Lokeren",
      h1a: "Therapie voor als je ", h1b: "even vastzit.",
      intro: "Ik ben Melanie, klinisch psycholoog. Je kan bij mij terecht met stress, angst, somberheid of vragen waar je zelf niet uit raakt. We bekijken samen wat er speelt en wat jou kan helpen.",
      cta1: "Maak een afspraak", cta2: "Meer over mij",
      elpA: "Via de ", elpLink: "ELP-conventie", elpB: " betaal je €11 per sessie, of €4 met verhoogde tegemoetkoming. Tot en met 23 jaar is het gratis.",
      helpTitle: "Waarvoor kan je bij mij terecht?",
      therapyTitle: "Individuele therapie",
      therapyText: "Voor volwassenen en jongvolwassenen. Bijvoorbeeld bij stress, burn-out, angst, somberheid, rouw, een laag zelfbeeld of grote levensvragen.",
      readMore: "Meer lezen",
      mindEyebrow: "Mindfulness & yoga", mindA: "Praten helpt. ", mindB: "Bewegen soms ook.",
      mindText: "In mijn groepssessies combineer ik mindfulness met rustige yoga. Je leert spanning in je lichaam opmerken en er anders mee omgaan. Ervaring is niet nodig.",
      mindCta: "Bekijk de sessies", breatheIn: "adem in", breatheOut: "adem uit",
      quote: "“Geen standaardaanpak. We vertrekken van jouw verhaal.”",
      groupsEyebrow: "Voor organisaties", groupsTitle: "Ook voor teams, scholen en verenigingen.",
      groupsText: "Ik geef mindfulnesstrainingen en mindful yoga in groep, en lezingen over ouderenzorg, mindfulness, ACT, veerkracht en chronische pijn.",
      faqTitle: "Veelgestelde vragen", faqAll: "Alle vragen"
    },
    about: {
      eyebrow: "Over mij", title: "Hallo, ik ben Melanie.",
      bio: "Ik ben klinisch psycholoog en werk al meer dan 10 jaar met volwassenen en jongvolwassenen. Ik gebruik methodes die wetenschappelijk onderbouwd zijn, maar pas ze aan aan wie er tegenover me zit. Mijn stijl is warm en zonder oordeel.",
      quote: "“Ik geloof in een aanpak op maat. We vertrekken van jouw verhaal.”",
      specTitle: "Specialisaties", specIntro: "Hier heb ik me extra in verdiept.",
      eduTitle: "Opleiding & erkenning", riziv: "RIZIV",
      pubTitle: "Onderzoek & publicaties", pubText: "Naast mijn werk als psycholoog deed ik wetenschappelijk onderzoek. Mijn publicaties vind je op ResearchGate.", pubLink: "Bekijk mijn publicaties",
      cta: "Maak een afspraak"
    },
    specialties: [
      { title: "Ouderenzorg", text: "Begeleiding van ouderen en hun familie, bijvoorbeeld bij ouder worden, verlies of eenzaamheid." },
      { title: "Mindfulness", text: "Leren opmerken wat er in je hoofd en lichaam gebeurt, zonder er meteen in mee te gaan." },
      { title: "Acceptance & Commitment Therapy", text: "Minder vechten tegen lastige gedachten en gevoelens, en meer doen van wat je belangrijk vindt." },
      { title: "Chronische pijn & ziekte", text: "Leren omgaan met pijn of ziekte die niet weggaat, zodat er weer plaats is voor de rest van je leven." }
    ],
    edu: [
      { year: "2010-2015", text: "Master of Science in de Klinische Psychologie, met grote onderscheiding, UGent" },
      { year: "2015-2020", text: "Doctor of Philosophy (PhD), Klinische psychologie, UGent" },
      { year: "2021", text: "Postuniversitaire vorming Psychogerontologie, KU Leuven" }
    ],
    services: {
      eyebrow: "Aanbod", title: "Mijn aanbod", intro: "Individuele therapie, groepssessies mindfulness en yoga, en trainingen of lezingen voor organisaties.",
      therapyFor: "Voor wie", therapyForText: "Volwassenen en jongvolwassenen.", therapyWhat: "Waarvoor",
      therapyHow: "Hoe ik werk",
      therapyHowText: "Ik werk wetenschappelijk onderbouwd, onder andere met ACT en mindfulness. We starten met een kennismaking. Daarna bepalen we samen waar we aan werken en hoe vaak we afspreken.",
      practical: "Praktisch",
      practicalItems: ["In Gent of Lokeren", "Een sessie duurt 55 minuten", "Annuleren kan tot 24 uur op voorhand"],
      rates: {
        title: "Tarieven",
        rows: [
          ["Via ELP", "€11"],
          ["Via ELP, met verhoogde tegemoetkoming", "€4"],
          ["Via ELP, tot en met 23 jaar", "Gratis"],
          ["Zonder ELP", "€70"]
        ],
        note: "Per sessie van 55 minuten. Alle info over de ELP-tarieven vind je op ",
        linkLabel: "psy-ovl.be"
      },
      bookRosa: "Afspraak via Rosa",
      mindTitle: "Mindfulness & yoga",
      mindText: "Stress zit niet alleen in je hoofd. Ook in je schouders, je buik of je slaap. In deze sessies combineer ik korte mindfulnessoefeningen met rustige yoga. Je leert spanning opmerken en loslaten.",
      mindItems: ["Kleine groepen, op vaste data", "Geen yoga-ervaring nodig", "Inschrijven doe je hier op de website"],
      mindCta: "Bekijk de data en schrijf je in",
      groupsEyebrow: "Voor organisaties", groupsTitle: "Groepssessies, trainingen en lezingen",
      groupA: "Groepssessies & trainingen", groupAText: "Een mindfulnesstraining of mindful yoga voor je team, school of vereniging.",
      groupB: "Lezingen", groupBText: "Een lezing over een van mijn vakgebieden, aangepast aan je publiek.",
      topicsLabel: "Onderwerpen"
    },
    complaints: ["Stress", "Burn-out", "Angst", "Somberheid", "Laag zelfbeeld", "Rouw", "Levensvragen"],
    groupTopics: ["Mindfulnesstraining", "Mindful yoga"],
    talkTopics: ["Ouderenzorg", "Mindfulness", "Acceptance & Commitment Therapy", "Veerkracht", "Chronische pijn"],
    sessions: {
      eyebrow: "Sessies", titleA: "Mindfulness & yoga ", titleB: "in groep.",
      intro: "Ik organiseer regelmatig sessies in kleine groepen. Kies een datum en reserveer je plaats.",
      openLabel: "Inschrijvingen open",
      chooseTitle: "Kies een sessie",
      types: { mindful_yoga: "Mindful yoga", mindfulness: "Mindfulnesstraining" },
      left1: "Nog 1 plaats", leftN: "Nog {n} plaatsen", full: "Volzet",
      reserve: "Reserveer", selected: "Gekozen",
      pick: "Kies hierboven een sessie om je plaats te reserveren.",
      formTitle: "Je reservatie", places: "Aantal plaatsen", note: "Opmerking (optioneel)",
      confirm: "Bevestig reservatie", cancel: "Andere sessie kiezen",
      doneTitle: "Je plaats is gereserveerd.", doneText: "Je krijgt zo meteen een bevestiging per mail.",
      again: "Nog een sessie boeken", placeWord: "plaats", placesWord: "plaatsen",
      closedTitle: "Er zijn op dit moment geen sessies gepland.",
      closedText: "Laat je e-mailadres achter. Ik stuur je een berichtje zodra er nieuwe data zijn.",
      notifyBtn: "Hou me op de hoogte", notifyDone: "Bedankt. Je krijgt een mail zodra er nieuwe sessies zijn.",
      infoTitle: "Goed om te weten",
      info: ["Geen ervaring nodig", "Je betaalt ter plaatse. De prijs staat bij elke sessie.", "Kan je toch niet komen? Laat het minstens 48 uur op voorhand weten, dan kan iemand anders je plaats krijgen.", "Draag makkelijke kleren"]
    },
    orgs: {
      eyebrow: "Organisaties", title: "Groepssessie of lezing voor je organisatie",
      intro: "Voor je team, school of vereniging: een mindfulnesstraining, mindful yoga of een lezing. Vul het formulier in, dan neem ik contact met je op."
    },
    faq: {
      eyebrow: "Vragen", title: "Veelgestelde vragen",
      intro: "Staat je vraag er niet bij? Stuur me gerust een bericht.", contactCta: "Contacteer me",
      groups: [
        { title: "ELP", items: [
          { q: "Wat is het verschil tussen ELP en gewone therapie?", a: "Binnen de ELP-conventie (eerstelijnspsychologische zorg) betaal je een verlaagd tarief: €11 per sessie, €4 met verhoogde tegemoetkoming en gratis tot en met 23 jaar. Hoeveel sessies je krijgt, hangt af van je situatie. Alle info staat op psy-ovl.be." },
          { q: "Wat kost een sessie zonder ELP?", a: "Valt je begeleiding niet onder de ELP-conventie, dan betaal je €70 per sessie van 55 minuten." } ] },
        { title: "Therapie", items: [
          { q: "Hoe weet ik of therapie iets voor mij is?", a: "Twijfelen is heel normaal. In een eerste gesprek kijken we samen wat je nodig hebt." },
          { q: "Hoe lang duurt een therapietraject?", a: "Dat verschilt per persoon. We spreken samen af hoe vaak we elkaar zien en kijken onderweg of het nog klopt." } ] },
        { title: "Praktisch", items: [
          { q: "Hoe maak ik een afspraak voor therapie?", a: "Online via Rosa, of telefonisch of per mail. Alle gegevens staan op de contactpagina." },
          { q: "Kan ik een afspraak annuleren?", a: "Ja, tot 24 uur op voorhand. Voor de groepssessies mindfulness en yoga vraag ik je om minstens 48 uur op voorhand te laten weten dat je niet kan komen." },
          { q: "Hoe schrijf ik me in voor mindfulness of yoga?", a: "Via de pagina Sessies. Daar zie je de geplande data en hoeveel plaatsen er nog vrij zijn. Je reserveert er meteen." },
          { q: "Geef je ook sessies of lezingen voor organisaties?", a: "Ja. Mindfulnesstrainingen, mindful yoga en lezingen over ouderenzorg, mindfulness, ACT, veerkracht en chronische pijn. Je vraagt ze aan via de pagina Organisaties." } ] }
      ]
    },
    contact: {
      eyebrow: "Contact", title: "Neem contact op",
      intro: "Voor therapie maak je het snelst online een afspraak via Rosa. Liever eerst even bellen of mailen? Dat mag altijd.",
      crisisTitle: "Niet voor noodgevallen",
      crisisText: "In crisis? Neem meteen contact op met je huisarts of de spoeddienst (112), of bel gratis de Zelfmoordlijn op 1813.",
      phone: "Telefoon", email: "E-mail", online: "Therapie online boeken", locations: "Locaties", route: "Routebeschrijving",
      sessionsLine: "Inschrijven voor mindfulness of yoga", orgsLine: "Groepssessie of lezing aanvragen"
    },
    req: {
      formTitle: "Aanvraag",
      typeLabel: "Wat wil je boeken?",
      typeGroup: "Groepssessie of training", typeGroupSub: "Mindfulnesstraining of mindful yoga",
      typeTalk: "Lezing", typeTalkSub: "Ouderenzorg, mindfulness, ACT, veerkracht, chronische pijn",
      topic: "Onderwerp", org: "Organisatie", name: "Naam", email: "E-mail", phone: "Telefoon (optioneel)",
      date: "Gewenste datum of periode", people: "Aantal deelnemers (ongeveer)", msg: "Bericht",
      submit: "Verstuur aanvraag", sentTitle: "Bedankt!",
      sentText: "Je aanvraag is verstuurd. Ik neem zo snel mogelijk contact met je op.", again: "Nog een aanvraag"
    },
    footer: {
      title: "Vragen, of klaar om te starten?", cta: "Afspraak via Rosa", contact: "Contact",
      crisis: "In crisis? Bel je huisarts, 112 of de Zelfmoordlijn op 1813."
    },
    cities: { ghent: "Gent", lokeren: "Lokeren" }
  },

  en: {
    ui: { menu: "Main menu", footerMenu: "Footer menu", language: "Language", pages: "Pages" },
    nav: { home: "Home", about: "About", services: "Services", sessions: "Sessions", orgs: "Organisations", faq: "FAQ", contact: "Contact", book: "Book" },
    shared: { bookGroup: "Book a group session", bookTalk: "Book a talk" },
    home: {
      eyebrow: "Clinical psychologist (PhD) in Ghent and Lokeren",
      h1a: "Therapy for when ", h1b: "you feel stuck.",
      intro: "I’m Melanie, a clinical psychologist. You can come to me with stress, anxiety, low mood or questions you can’t figure out on your own. Together we look at what’s going on and what could help.",
      cta1: "Book an appointment", cta2: "About me",
      elpA: "Through the ", elpLink: "ELP agreement", elpB: " you pay €11 per session, or €4 with increased reimbursement. Up to and including age 23 it’s free.",
      helpTitle: "What can I help with?",
      therapyTitle: "Individual therapy",
      therapyText: "For adults and young adults. For example with stress, burn-out, anxiety, low mood, grief, low self-esteem or big life questions.",
      readMore: "Read more",
      mindEyebrow: "Mindfulness & yoga", mindA: "Talking helps. ", mindB: "Moving can too.",
      mindText: "In my group sessions I combine mindfulness with gentle yoga. You learn to notice tension in your body and handle it differently. No experience needed.",
      mindCta: "See the sessions", breatheIn: "breathe in", breatheOut: "breathe out",
      quote: "“No standard approach. We start from your story.”",
      groupsEyebrow: "For organisations", groupsTitle: "Also for teams, schools and associations.",
      groupsText: "I give mindfulness trainings and mindful yoga for groups, and talks on elderly care, mindfulness, ACT, resilience and chronic pain.",
      faqTitle: "Frequently asked questions", faqAll: "All questions"
    },
    about: {
      eyebrow: "About", title: "Hello, I’m Melanie.",
      bio: "I’m a clinical psychologist and have worked with adults and young adults for more than 10 years. I use evidence-based methods, adapted to the person in front of me. My style is warm and without judgement.",
      quote: "“I believe in a tailored approach. We start from your story.”",
      specTitle: "Specialties", specIntro: "Areas I’ve trained in further.",
      eduTitle: "Education & accreditation", riziv: "RIZIV/INAMI",
      pubTitle: "Research & publications", pubText: "Alongside my work as a psychologist I did scientific research. You can find my publications on ResearchGate.", pubLink: "See my publications",
      cta: "Book an appointment"
    },
    specialties: [
      { title: "Elderly care", text: "Support for older adults and their families, for example with ageing, loss or loneliness." },
      { title: "Mindfulness", text: "Learning to notice what happens in your head and body, without getting carried along by it." },
      { title: "Acceptance & Commitment Therapy", text: "Fighting less with difficult thoughts and feelings, and doing more of what matters to you." },
      { title: "Chronic pain & illness", text: "Learning to deal with pain or illness that doesn’t go away, so there’s room again for the rest of your life." }
    ],
    edu: [
      { year: "2010-2015", text: "MSc in Clinical Psychology, magna cum laude, Ghent University" },
      { year: "2015-2020", text: "PhD in Clinical Psychology, Ghent University" },
      { year: "2021", text: "Postgraduate training in Psychogerontology, KU Leuven" }
    ],
    services: {
      eyebrow: "Services", title: "What I offer", intro: "Individual therapy, mindfulness and yoga group sessions, and trainings or talks for organisations.",
      therapyFor: "For whom", therapyForText: "Adults and young adults.", therapyWhat: "For what",
      therapyHow: "How I work",
      therapyHowText: "My work is evidence-based, using among others ACT and mindfulness. We start with an introductory session. Then we decide together what to work on and how often we meet.",
      practical: "Practical",
      practicalItems: ["In Ghent or Lokeren", "A session lasts 55 minutes", "You can cancel up to 24 hours in advance"],
      rates: {
        title: "Rates",
        rows: [
          ["Through ELP", "€11"],
          ["Through ELP, with increased reimbursement", "€4"],
          ["Through ELP, up to and including age 23", "Free"],
          ["Without ELP", "€70"]
        ],
        note: "Per 55-minute session. Full details on the ELP rates are on ",
        linkLabel: "psy-ovl.be"
      },
      bookRosa: "Book via Rosa",
      mindTitle: "Mindfulness & yoga",
      mindText: "Stress doesn’t only sit in your head. It’s also in your shoulders, your stomach or your sleep. In these sessions I combine short mindfulness exercises with gentle yoga. You learn to notice tension and let it go.",
      mindItems: ["Small groups, on set dates", "No yoga experience needed", "You sign up here on the website"],
      mindCta: "See the dates and sign up",
      groupsEyebrow: "For organisations", groupsTitle: "Group sessions, trainings and talks",
      groupA: "Group sessions & trainings", groupAText: "A mindfulness training or mindful yoga for your team, school or association.",
      groupB: "Talks", groupBText: "A talk on one of my areas of expertise, adapted to your audience.",
      topicsLabel: "Topics"
    },
    complaints: ["Stress", "Burn-out", "Anxiety", "Low mood", "Low self-esteem", "Grief", "Life questions"],
    groupTopics: ["Mindfulness training", "Mindful yoga"],
    talkTopics: ["Elderly care", "Mindfulness", "Acceptance & Commitment Therapy", "Resilience", "Chronic pain"],
    sessions: {
      eyebrow: "Sessions", titleA: "Mindfulness & yoga ", titleB: "in a group.",
      intro: "I regularly organise sessions in small groups. Pick a date and reserve your place.",
      openLabel: "Registration open",
      chooseTitle: "Choose a session",
      types: { mindful_yoga: "Mindful yoga", mindfulness: "Mindfulness training" },
      left1: "1 place left", leftN: "{n} places left", full: "Full",
      reserve: "Reserve", selected: "Selected",
      pick: "Choose a session above to reserve your place.",
      formTitle: "Your reservation", places: "Number of places", note: "Note (optional)",
      confirm: "Confirm reservation", cancel: "Choose another session",
      doneTitle: "Your place is reserved.", doneText: "You’ll get a confirmation by email in a moment.",
      again: "Book another session", placeWord: "place", placesWord: "places",
      closedTitle: "There are no sessions planned right now.",
      closedText: "Leave your email address and I’ll let you know when there are new dates.",
      notifyBtn: "Keep me posted", notifyDone: "Thanks. You’ll get an email as soon as there are new sessions.",
      infoTitle: "Good to know",
      info: ["No experience needed", "You pay on the spot. The price is listed with each session.", "Can’t make it after all? Let me know at least 48 hours in advance, so someone else can have your place.", "Wear comfortable clothes"]
    },
    orgs: {
      eyebrow: "Organisations", title: "A group session or talk for your organisation",
      intro: "For your team, school or association: a mindfulness training, mindful yoga or a talk. Fill in the form and I’ll get in touch."
    },
    faq: {
      eyebrow: "FAQ", title: "Frequently asked questions",
      intro: "Can’t find your question? Feel free to send me a message.", contactCta: "Get in touch",
      groups: [
        { title: "ELP", items: [
          { q: "What is the difference between ELP and regular therapy?", a: "Under the ELP agreement (first-line psychological care) you pay a reduced rate: €11 per session, €4 with increased reimbursement, and free up to and including age 23. How many sessions you get depends on your situation. Full details are on psy-ovl.be." },
          { q: "What does a session cost without ELP?", a: "If your care doesn’t fall under the ELP agreement, a 55-minute session costs €70." } ] },
        { title: "Therapy", items: [
          { q: "How do I know if therapy is right for me?", a: "Having doubts is completely normal. In a first session we look together at what you need." },
          { q: "How long does therapy take?", a: "It differs per person. We agree together how often we meet and check along the way if it still fits." } ] },
        { title: "Practical", items: [
          { q: "How do I book a therapy appointment?", a: "Online via Rosa, or by phone or email. All details are on the contact page." },
          { q: "Can I cancel an appointment?", a: "Yes, up to 24 hours in advance. For the mindfulness and yoga group sessions, please let me know at least 48 hours in advance if you can’t come." },
          { q: "How do I sign up for mindfulness or yoga?", a: "On the Sessions page. You’ll see the planned dates and how many places are left, and you can reserve right away." },
          { q: "Do you offer sessions or talks for organisations?", a: "Yes. Mindfulness trainings, mindful yoga and talks on elderly care, mindfulness, ACT, resilience and chronic pain. You can request them on the Organisations page." } ] }
      ]
    },
    contact: {
      eyebrow: "Contact", title: "Get in touch",
      intro: "For therapy, the quickest way is to book online via Rosa. Rather call or email first? That’s always fine.",
      crisisTitle: "Not for emergencies",
      crisisText: "In crisis? Contact your GP or emergency services (112) right away, or call the free suicide line on 1813.",
      phone: "Phone", email: "Email", online: "Book therapy online", locations: "Locations", route: "Directions",
      sessionsLine: "Sign up for mindfulness or yoga", orgsLine: "Request a group session or talk"
    },
    req: {
      formTitle: "Request",
      typeLabel: "What would you like to book?",
      typeGroup: "Group session or training", typeGroupSub: "Mindfulness training or mindful yoga",
      typeTalk: "Talk", typeTalkSub: "Elderly care, mindfulness, ACT, resilience, chronic pain",
      topic: "Topic", org: "Organisation", name: "Name", email: "Email", phone: "Phone (optional)",
      date: "Preferred date or period", people: "Number of participants (approx.)", msg: "Message",
      submit: "Send request", sentTitle: "Thanks!",
      sentText: "Your request has been sent. I’ll get back to you as soon as possible.", again: "Send another request"
    },
    footer: {
      title: "Questions, or ready to start?", cta: "Book via Rosa", contact: "Contact",
      crisis: "In crisis? Call your GP, 112 or the suicide line on 1813."
    },
    cities: { ghent: "Ghent", lokeren: "Lokeren" }
  },
};

export default base;
