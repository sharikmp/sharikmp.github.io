// ===== PORTFOLIO DATA =====
const portfolioData = {
    profile: {
        name: "Sharik Madhyapradeshi",
        title: "Sr. SDET & Test Architect",
        summary: "Passionate Software Development Engineer in Test (SDET) with 7+ years of comprehensive experience in automation tools (Selenium, Playwright, Cucumber, Rest Assured, Soap UI, and Postman) with Java and Python. Proven track record in full SDLC testing, framework architecture, API automation, and leading quality engineering initiatives.",
        location: "Kolkata, West Bengal, India",
        email: "Sharik.madhyapradeshi@gmail.com",
        phone: "+91-(0)-8697908892",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
        image: "https://ui-avatars.com/api/?name=Sharik+Madhyapradeshi&size=512&background=2563eb&color=fff&font-size=0.33"
    },

    skills: [
        { category: "Programming", icon: "fa-code", items: ["Java (Core & Advance)", "Python", "JavaScript", "TypeScript", "HTML", "CSS"] },
        { category: "Automation Frameworks", icon: "fa-robot", items: ["Selenium Webdriver", "Playwright", "Cucumber (BDD)", "Rest Assured", "SoapUI", "TestNG"] },
        { category: "Testing Expertise", icon: "fa-vial", items: ["System & Integration Testing", "API Automation", "Regression Testing", "Mulesoft Testing", "Azure Function Integration"] },
        { category: "Tools & Utilities", icon: "fa-toolbox", items: ["Maven", "Jenkins", "Microsoft TFS", "JIRA", "Postman", "Excel Apache POI", "JSON/XML Parsers"] }
    ],

    experience: [
        {
            company: "WTW",
            role: "Sr. SDET (Architect Level)",
            duration: "Dec 2024 - March 2026",
            description: "Leading test automation architecture utilizing Playwright and TypeScript. Designing robust frameworks, defining test strategies, and implementing advanced automation solutions for complex enterprise applications."
        },
        {
            company: "Veeva Systems",
            role: "SDET",
            duration: "July 2023 - Dec 2024",
            description: "Developed and maintained automation frameworks using Selenium Java, Rest Assured, and Playwright. Ensured high software quality through rigorous system and API testing strategies."
        },
        {
            company: "PwC",
            role: "Automation Engineer",
            duration: "July 2021 - July 2023",
            location: "Kolkata, West Bengal",
            description: "Involved in System, Integration, functional, end to end and regression testing. Experience in Selenium Web driver Automation for Microsoft Dynamics 365 CRM. Built Azure Function Integration Testing framework with Cucumber and Rest Assured."
        },
        {
            company: "Cognizant",
            role: "Associate - Projects (Frontend/QA)",
            duration: "July 2018 - July 2021",
            location: "Kolkata, West Bengal",
            description: "Hands-on experience in Selenium and API automation (Rest Assured, SoapUI). Developed automation frameworks from scratch. Worked on Mulesoft middleware application testing. Received early promotion for dedicated performance."
        }
    ],

    projectsData: {
        "projects": [
            { "id": 1, "title": "Playwright Utilities", "description": "Advanced Playwright test automation utilities for modern web testing. Includes UI action helpers, element interaction wrappers, and test data management tools.", "icon": "fa-play", "category": "qa", "link": "PlaywrightUtilities/", "tags": ["Playwright", "Test Automation", "UI Testing"] },
            { "id": 2, "title": "UI Test Automation", "description": "Selenium-based UI test automation framework with Maven build system. Comprehensive test suite with JUnit integration and cross-browser testing capabilities.", "icon": "fa-mobile-alt", "category": "qa", "link": "UITestAutomation/", "tags": ["Selenium", "Java", "Maven", "JUnit"] },
            { "id": 3, "title": "QA Snippets", "description": "Curated collection of QA automation snippets and useful code utilities. Includes locator strategies, assertion helpers, and common automation patterns.", "icon": "fa-scissors", "category": "qa", "link": "qasnipper/index.html", "tags": ["Code Snippets", "QA Tools", "Utilities"] },
            { "id": 4, "title": "Learn Automation", "description": "Interactive learning platform demonstrating automation techniques. Includes practice examples with alerts, dropdowns, iframes, drag-drop, and form handling.", "icon": "fa-graduation-cap", "category": "qa", "link": "learn.automation/index.html", "tags": ["Learning", "Practice", "Web Elements"] },
            { "id": 5, "title": "REST Assured Framework", "description": "REST API testing framework showcasing API validation, response parsing, and endpoint testing. Ideal for API-first testing strategies.", "icon": "fa-network-wired", "category": "qa", "link": "restassuredframework/index.html", "tags": ["API Testing", "REST", "Java"] },
            { "id": 6, "title": "Test Report", "description": "Professional test report dashboard showcasing test metrics, execution statistics, and detailed test results visualization with interactive charts.", "icon": "fa-chart-line", "category": "qa", "link": "testreport/index.html", "tags": ["Reporting", "Analytics", "Dashboard"] },
            { "id": 7, "title": "Dummy Claim", "description": "Sample claims management application for testing purposes. Features user authentication, claim submission, dashboard analytics, and file upload capabilities.", "icon": "fa-file-invoice", "category": "qa", "link": "dummyclaim/index.html", "tags": ["Test Application", "Claims", "Web App"] },
            { "id": 8, "title": "BioGen", "description": "Biodata generation and management tool with theme switching. Includes profile photo management, printing capabilities, and data export features.", "icon": "fa-dna", "category": "dev", "link": "biogen/index.html", "tags": ["Data Management", "Biodata", "Web App"] },
            { "id": 9, "title": "Drum Kit", "description": "Interactive virtual drum kit with realistic sound effects. Click or use keyboard shortcuts to play different drum sounds and create rhythms.", "icon": "fa-drum", "category": "dev", "link": "drumkit/index.html", "tags": ["Game", "Audio", "Interactive"] },
            { "id": 10, "title": "Simon Game", "description": "Classic Simon memory game with increasing difficulty levels. Test your memory and reflexes as the sequence gets longer and faster.", "icon": "fa-gamepad", "category": "dev", "link": "simongame/index.html", "tags": ["Game", "JavaScript", "Memory"] },
            { "id": 11, "title": "Tic Tac Toe", "description": "Classic Tic Tac Toe game implementation with intuitive gameplay. Play against AI or another player with game rules and win conditions.", "icon": "fa-tic", "category": "dev", "link": "XnO/index.html", "tags": ["Game", "JavaScript", "AI"] },
            { "id": 12, "title": "HTML Builder", "description": "Rich text HTML editor with formatting tools. Create formatted content with bold, italic, lists, links, images, and text justification options.", "icon": "fa-pen-fancy", "category": "dev", "link": "htmlbuilder/index.html", "tags": ["Editor", "Text Formatting", "HTML"] },
            { "id": 13, "title": "JSON Tools", "description": "Comprehensive JSON manipulation utilities for formatting, validation, and parsing. Supports JSON-to-CSV conversion and beautification.", "icon": "fa-braces", "category": "dev", "link": "jsontools/index.html", "tags": ["JSON", "Tools", "Developer Utilities"] },
            { "id": 14, "title": "Way2QAE", "description": "Main QA learning platform providing comprehensive course materials. Foundation for QA engineering training with structured curriculum.", "icon": "fa-book", "category": "dev", "link": "way2qae/index.html", "tags": ["Learning", "QA Training", "Course"] },
            { "id": 15, "title": "Quiz Maker", "description": "Interactive quiz builder tool for creating and taking quizzes. Features question management, scoring, and progress tracking.", "icon": "fa-list-check", "category": "dev", "link": "way2qaequizmaker/index.html", "tags": ["Quiz", "Education", "Interactive"] },
            { "id": 16, "title": "Slides Maker", "description": "Tutorial presentation slides creator tool. Build engaging slide decks with text, images, and multimedia content for training delivery.", "icon": "fa-stream", "category": "dev", "link": "way2qaetutorialslidesmaker/index.html", "tags": ["Presentation", "Slides", "Education"] },
            { "id": 17, "title": "Curriculum", "description": "Structured QA engineering curriculum with learning modules. Comprehensive course outline and training materials for QA professionals.", "icon": "fa-graduation-cap", "category": "dev", "link": "way2qae-curriculum/index.html", "tags": ["Course", "QA Training", "Curriculum"] },
            { "id": 18, "title": "Wonder Toyz", "description": "E-commerce toy store platform with product catalog, shopping cart, and checkout. Includes order tracking and payment integration.", "icon": "fa-shopping-cart", "category": "dev", "link": "wondertoyz/index.html", "tags": ["E-commerce", "Shopping", "Web App"] },
            { "id": 19, "title": "TrustEx Trading", "description": "Trading platform with portfolio management, trade execution, and market analysis tools. Includes backtesting and performance analytics.", "icon": "fa-chart-bar", "category": "dev", "link": "tradex/index.html", "tags": ["Trading", "Finance", "Analytics"] },
            { "id": 20, "title": "Notice Maker", "description": "Document and notice creation tool with templates. Generate professional notices, letters, and announcements with customizable formatting.", "icon": "fa-id-card", "category": "dev", "link": "noticemaker/index.html", "tags": ["Document", "Templates", "Utility"] },
            { "id": 21, "title": "Mohammad Zohan", "description": "Personal portfolio and profile showcase. Highlights skills, projects, and professional achievements with an attractive design.", "icon": "fa-user", "category": "dev", "link": "mohammad-zohan/index.html", "tags": ["Portfolio", "Profile", "Showcase"] },
            { "id": 22, "title": "Ramadan Mubarak", "description": "Ramadan celebration application with prayer times, calendar, and religious information. Includes notifications and daily reminders.", "icon": "fa-moon", "category": "dev", "link": "RamazanMubarak/index.html", "tags": ["Religion", "Calendar", "Application"] },
            { "id": 23, "title": "Area Calculator", "description": "Mathematical calculator for computing areas of different shapes. Supports circles, rectangles, triangles, and other geometric figures with instant results.", "icon": "fa-square", "category": "utils", "link": "areacalculator/index.html", "tags": ["Calculator", "Math", "Geometry"] },
            { "id": 24, "title": "Countdown Timer", "description": "Simple countdown timer with customizable duration. Perfect for events, meetings, exercises, or any time-based activities with alert notifications.", "icon": "fa-hourglass-end", "category": "utils", "link": "countdown/index.html", "tags": ["Timer", "Utility", "Time-tracking"] },
            { "id": 25, "title": "Credit Score Tool", "description": "Credit score calculator for juice booth operations. Tracks customer loyalty points and credit management for business operations.", "icon": "fa-juice-box", "category": "utils", "link": "creditscorejuiceboothapp/index.html", "tags": ["Calculator", "Business", "Management"] },
            { "id": 26, "title": "EPF Calculator", "description": "Employee Provident Fund calculation tool for retirement planning. Computes accumulations, maturity benefits, and withdrawal amounts based on contributions.", "icon": "fa-piggy-bank", "category": "utils", "link": "epfcalculator/index.html", "tags": ["Calculator", "Finance", "Retirement"] },
            { "id": 27, "title": "Expense Splitter", "description": "Smart expense splitting calculator for group outings. Automatically calculates individual shares and settlement amounts between friends and colleagues.", "icon": "fa-split", "category": "utils", "link": "expense-splitter/index.html", "tags": ["Calculator", "Utility", "Expense Management"] },
            { "id": 28, "title": "MathBee", "description": "Intelligent math learning platform with adaptive difficulty levels. Provides personalized problem sets and solution explanations for effective learning.", "icon": "fa-lightbulb", "category": "ai", "link": "mathbee/v2/index.html", "tags": ["AI", "Learning", "Math", "Adaptive"] }
        ],
        "categories": [
            { "id": "qa", "name": "QA & Automation Engineering", "description": "Testing frameworks, automation utilities, and QA tools", "icon": "fa-robot", "color": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
            { "id": "dev", "name": "Development & Scripting", "description": "Interactive applications, games, editors, and learning platforms", "icon": "fa-code", "color": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
            { "id": "utils", "name": "Utilities & Tools", "description": "Practical calculators and utility applications", "icon": "fa-toolbox", "color": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
            { "id": "ai", "name": "AI & Machine Learning", "description": "Intelligent learning and analysis tools", "icon": "fa-brain", "color": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" }
        ]
    },

    awards: [
        {
            title: "Dream Team Award",
            issuer: "Client Organisation (PwC)",
            year: "Oct 2022, Mar 2023",
            icon: "fas fa-trophy",
            description: "Recognized as a core team member for outstanding collaboration and significant contributions to project success"
        },
        {
            title: "Star R&R Award",
            issuer: "PwC",
            year: "Nov 2022",
            icon: "fas fa-star",
            description: "Awarded for delivering exceptional results and recognition for remarkable performance and dedication"
        },
        {
            title: "Spot Award",
            issuer: "Client Organisation (PwC)",
            year: "Aug 2022, Oct 2022",
            icon: "fas fa-medal",
            description: "Received multiple spot awards for immediate recognition of outstanding work and exceptional problem-solving"
        },
        {
            title: "Early Promotion to Associate",
            issuer: "Cognizant",
            year: "2021",
            icon: "fas fa-arrow-trend-up",
            description: "Promoted to Associate level ahead of schedule, demonstrating leadership and technical excellence"
        }
    ],

    education: [
        {
            institution: "Maulana Abul Kalam Azad University of Technology",
            degree: "B.Tech Computer Science & Engineering",
            field: "Bachelor of Technology",
            year: "2018",
            gpa: "84.70% (CGPA 9.22)",
            details: "Comprehensive understanding of software development, data structures, algorithms, and computer networks"
        },
        {
            institution: "West Bengal Board of Secondary Education",
            degree: "12th Standard Science",
            field: "Science Stream",
            year: "2013",
            gpa: "74.80%",
            details: "Strong foundation in Physics, Chemistry, and Mathematics"
        },
        {
            institution: "West Bengal Council of Secondary Education",
            degree: "10th Standard",
            field: "General",
            year: "2011",
            gpa: "80.88%",
            details: "Strong academic foundation in core subjects"
        }
    ],

    contact: {
        email: "sharik@example.com",
        phone: "+91-9876543210",
        location: "India",
        github: "https://github.com/sharikmp",
        linkedin: "https://linkedin.com"
    }
};
