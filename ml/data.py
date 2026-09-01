"""
Training data for the intent classifier.

Templates crossed with slot fills, per language. Written by hand rather than
scraped: the label space is nine tools and the phrasings are the ways a visitor
actually asks a portfolio a question, which is a small enough world to enumerate
honestly.
"""

EN = {
    "get_availability": [
        "are you free {when}", "are you available {when}", "when are you available",
        "when can you start", "are you taking on work", "do you have availability",
        "are you booked", "when do you have capacity", "can you start {when}",
        "are you looking for work", "are you open to new projects",
        "what is your availability", "are you free for a project",
        "could you start {when}", "any availability {when}", "are you hireable",
        "when are you next free", "do you have time for a project",
    ],
    "get_rates": [
        "what do you charge", "what are your rates", "how much do you cost",
        "what is your day rate", "how much for {work}", "what is your pricing",
        "do you have a day rate", "how much would {work} cost", "price for {work}",
        "what does a day cost", "how do you price work", "what is your fee",
        "are you expensive", "what budget do I need", "cost of {work}",
        "how much per day", "your rate for consulting", "what would you charge for {work}",
    ],
    "get_contact": [
        "how do I contact you", "how can I reach you", "what is your email",
        "how do I get in touch", "where can I find you", "your github",
        "your linkedin", "can I email you", "how to reach out",
        "what is the best way to contact you", "do you have an email",
        "send you a message", "get in touch", "your contact details",
        "how do I hire you", "where do I write to you",
    ],
    "list_roles": [
        "what is your experience", "where have you worked", "your work history",
        "tell me about your career", "what jobs have you had", "your background",
        "how many years of experience", "what companies have you worked for",
        "your professional experience", "what did you do at {company}",
        "your role at {company}", "what was your job at {company}",
        "have you worked in a team", "your cv", "your resume", "past employers",
        "what have you done professionally", "your previous roles",
    ],
    "list_projects": [
        "what have you built", "show me your projects", "what projects have you done",
        "your portfolio", "what have you made", "side projects",
        "what have you shipped", "things you have built", "your work",
        "list your projects", "what do you build", "any open source",
        "what have you created", "show me your work",
    ],
    "get_skills": [
        "what technologies do you know", "your stack", "what do you know about {tech}",
        "do you know {tech}", "can you do {tech}", "your skills",
        "what languages do you use", "are you good at {tech}",
        "what frameworks do you use", "your tech stack", "do you use {tech}",
        "have you worked with {tech}", "what tools do you use",
        "where did you study", "your education", "what did you study",
        "your degree", "are you self taught", "what is your background in tech",
        "do you know how to {tech}",
    ],
    "get_profile": [
        "who are you", "tell me about yourself", "introduce yourself",
        "what do you do", "who is kevin", "who is kevin riou", "about you",
        "a bit about you", "your bio", "describe yourself", "what is your job",
        "what are you", "tell me who you are", "your profile", "present yourself",
        "what is your role", "where are you based", "where do you live",
    ],
    "get_project": [
        "tell me about {project}", "what is {project}", "how did you build {project}",
        "details on {project}", "explain {project}", "the {project} project",
        "more about {project}", "what was {project}", "how does {project} work",
        "why did you build {project}",
    ],
}

FR = {
    "get_availability": [
        "êtes-vous disponible", "es-tu dispo", "quand êtes-vous libre",
        "quand pouvez-vous commencer", "avez-vous des disponibilités",
        "êtes-vous libre {when}", "prenez-vous des missions",
        "êtes-vous pris", "quelle est votre disponibilité",
        "pouvez-vous démarrer {when}", "cherchez-vous des missions",
        "avez-vous du temps", "êtes-vous ouvert à un projet",
        "quand seriez-vous libre", "disponibilité",
    ],
    "get_rates": [
        "quels sont vos tarifs", "combien coûtez-vous", "quel est votre tjm",
        "votre tarif journalier", "combien pour {work}", "quel est votre prix",
        "vos prix", "combien ça coûte", "quel budget prévoir",
        "coût de {work}", "combien par jour", "votre tarif pour du conseil",
        "êtes-vous cher", "comment facturez-vous", "prix pour {work}",
    ],
    "get_contact": [
        "comment vous contacter", "comment vous joindre", "quel est votre email",
        "votre adresse mail", "votre github", "votre linkedin",
        "puis-je vous écrire", "comment entrer en contact", "vos coordonnées",
        "où vous écrire", "comment vous embaucher", "je veux vous contacter",
    ],
    "list_roles": [
        "quelle est votre expérience", "où avez-vous travaillé", "votre parcours",
        "votre carrière", "quels postes avez-vous occupés", "votre cv",
        "combien d'années d'expérience", "pour quelles entreprises",
        "qu'avez-vous fait chez {company}", "votre rôle chez {company}",
        "votre poste chez {company}", "vos expériences professionnelles",
        "avez-vous managé une équipe", "vos anciens employeurs",
    ],
    "list_projects": [
        "qu'avez-vous construit", "montrez-moi vos projets", "vos projets",
        "votre portfolio", "qu'avez-vous réalisé", "projets personnels",
        "qu'est-ce que vous avez fait", "vos réalisations",
        "listez vos projets", "avez-vous de l'open source", "vos travaux",
    ],
    "get_skills": [
        "quelles technologies connaissez-vous", "votre stack",
        "connaissez-vous {tech}", "savez-vous faire {tech}", "vos compétences",
        "quels langages utilisez-vous", "êtes-vous bon en {tech}",
        "quels frameworks", "utilisez-vous {tech}", "avez-vous fait du {tech}",
        "quels outils utilisez-vous", "où avez-vous étudié", "votre formation",
        "qu'avez-vous étudié", "votre diplôme", "vos études",
        "que savez-vous faire", "vous connaissez {tech}",
    ],
    "get_profile": [
        "qui êtes-vous", "parlez-moi de vous", "présentez-vous",
        "que faites-vous", "qui est kevin", "qui est kevin riou",
        "à propos de vous", "votre bio", "décrivez-vous", "quel est votre métier",
        "vous êtes qui", "votre profil", "où êtes-vous basé", "où habitez-vous",
        "quel est votre rôle",
    ],
    "get_project": [
        "parlez-moi de {project}", "qu'est-ce que {project}",
        "comment avez-vous fait {project}", "détails sur {project}",
        "expliquez {project}", "le projet {project}", "plus sur {project}",
        "c'était quoi {project}", "comment fonctionne {project}",
        "pourquoi avoir fait {project}",
    ],
}

SLOTS_EN = {
    "when": ["in september", "next month", "now", "in october", "soon", "this autumn", "in november"],
    "work": ["a web app", "a mobile app", "consulting", "a website", "an audit", "a migration", "architecture work"],
    "company": ["technis", "alpha8", "nareli", "pasquier", "triskalia", "cdg29"],
    "tech": ["react", "next.js", "typescript", "node", "vue", "postgres", "docker",
             "kubernetes", "react native", "graphql", "ai", "llm", "mcp", "tailwind", "python"],
    "project": ["britch", "diagevol", "ooof", "outrans counter", "the vscode extension",
                "the twitch bot", "the overlays", "portfolio v6", "chariteam"],
}
SLOTS_FR = {
    "when": ["en septembre", "le mois prochain", "maintenant", "en octobre", "bientôt", "cet automne"],
    "work": ["une application web", "une app mobile", "du conseil", "un site", "un audit", "une migration"],
    "company": ["technis", "alpha8", "nareli", "pasquier", "triskalia", "cdg29"],
    "tech": ["react", "next.js", "typescript", "node", "vue", "postgres", "docker",
             "kubernetes", "react native", "graphql", "l'ia", "les llm", "tailwind", "python"],
    "project": ["britch", "diagevol", "ooof", "outrans counter", "l'extension vscode",
                "le bot twitch", "les overlays", "portfolio v6", "chariteam"],
}
