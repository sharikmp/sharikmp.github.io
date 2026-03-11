// ===== PORTFOLIO DATA =====
const portfolioData = {
    profile: {
        name: "Sharik Madhyapradeshi",
        title: "Sr. SDET and Test Architecture Lead",
        summary: "Passionate Software Development Engineer in Test (SDET) with 8+ years of comprehensive experience in automation tools (Selenium, Playwright, Cucumber, Rest Assured, Soap UI, and Postman) with Java and Python. Proven track record in full SDLC testing, framework architecture, API automation, and leading quality engineering initiatives.",
        location: "Kolkata, West Bengal, India",
        image: "./assests/images/me.jpeg"
    },

    skills: [
        { 
            category: "Programming", 
            icon: "fa-code", 
            items: [
                { name: "Java (Core & Advance)", duration: "8y" },
                { name: "Python", duration: "5y" },
                { name: "JavaScript", duration: "4y" },
                { name: "TypeScript", duration: "2y" },
                { name: "HTML", duration: "8y" },
                { name: "CSS", duration: "8y" }
            ] 
        },
        { 
            category: "Automation Frameworks", 
            icon: "fa-robot", 
            items: [
                { name: "Selenium Webdriver", duration: "7y" },
                { name: "Playwright", duration: "2y" },
                { name: "Cucumber (BDD)", duration: "6y" },
                { name: "Rest Assured", duration: "5y" },
                { name: "SoapUI", duration: "4y" },
                { name: "TestNG", duration: "7y" }
            ] 
        },
        { 
            category: "Testing Expertise", 
            icon: "fa-vial", 
            items: [
                { name: "System & Integration", duration: "8y" },
                { name: "API Automation", duration: "6y" },
                { name: "Regression Testing", duration: "8y" },
                { name: "Mulesoft Testing", duration: "3y" },
                { name: "Azure Integration", duration: "2y" }
            ] 
        },
        { 
            category: "Tools & Utilities", 
            icon: "fa-toolbox", 
            items: [
                { name: "Maven", duration: "7y" },
                { name: "Jenkins", duration: "5y" },
                { name: "Microsoft TFS", duration: "4y" },
                { name: "JIRA", duration: "6y" },
                { name: "Postman", duration: "6y" },
                { name: "Excel Apache POI", duration: "5y" }
            ] 
        }
    ],

    experience: [
        {
            company: "WTW",
            role: "Sr. SDET and Test Architecture Lead",
            duration: "Dec 2024 - March 2026",
            description: "Leading test automation architecture utilizing Playwright and TypeScript. Designing robust frameworks, defining test strategies, and implementing advanced automation solutions for complex enterprise applications.",
            keyContributions: [
                {
                    name: "Playwright Framework Design (JS/TS)",
                    description: "Architected scalable and maintainable test automation frameworks using Playwright and TypeScript, ensuring high code quality and reusability across projects."
                },
                {
                    name: "Test website development",
                    description: "Developed a comprehensive test website showcasing automation projects, tools, and resources. Implemented interactive features and responsive design for optimal user experience."
                },
                {
                    name: "Automation Knowledge Sharing",
                    description: "Conducted knowledge sharing sessions and workshops on test automation best practices, framework design, and Playwright usage to upskill team members and promote automation adoption across the organization."
                },
                {
                    name: "Selenium c# framework maintainance & enhancement",
                    description: "Maintained and enhanced existing Selenium C# automation frameworks, ensuring compatibility with evolving application features and improving test coverage and reliability."
                },
                {
                    name: "Leading AI Initiatives in Testing",
                    description: "Developed BUG RCA Analyzer agent using copilot and JIRA"
                },
                {
                    name: "Developed Copilot powered Automation Run Result Analysis tool",
                    description: "Created an AI-powered tool leveraging Copilot to analyze automation run results, identify patterns, and provide actionable insights for improving test reliability and efficiency."
                }
            ]
        },
        {
            company: "Veeva Systems",
            role: "SDET",
            duration: "July 2023 - Dec 2024",
            description: "Developed and maintained automation frameworks using Selenium Java, Rest Assured, and Playwright. Ensured high software quality through rigorous system and API testing strategies.",
            keyContributions: [
                {
                    name: "Selenium Java Framework Enhancement",
                    description: "Designed and maintained robust Selenium Java automation frameworks for web application testing, ensuring comprehensive UI coverage and cross-browser compatibility."
                },
                {
                    name: "REST Assured API Enhancement",
                    description: "Implemented comprehensive API automation testing using REST Assured, validating endpoints, response parsing, and integration scenarios."
                },
                {
                    name: "Playwright Framework Implementation",
                    description: "Introduced and implemented Playwright-based automation framework for modern web application testing with improved performance and reliability."
                },
                {
                    name: "Developed Failure Analysis tool",
                    description: "Developed F.A.T. to analyze the test failure while the Jenkins pipeline is running and provide the possible reason for failure and the solution to fix it. This tool is powered by pure JS, created as a custom browser extension and integrated with Jenkins pipeline to provide real-time failure analysis and actionable insights for quick resolution."
                },
                {
                    name: "Quality Assurance Excellence",
                    description: "Drove quality assurance initiatives through comprehensive testing strategies, resulting in improved test coverage and reduced production defects."
                }
            ]
        },
        {
            company: "PwC",
            role: "Automation Engineer",
            duration: "July 2021 - July 2023",
            location: "Kolkata, West Bengal",
            description: "Involved in System, Integration, functional, end to end and regression testing. Experience in Selenium Web driver Automation for Microsoft Dynamics 365 CRM. Built Azure Function Integration Testing framework with Cucumber and Rest Assured.",
            keyContributions: [
                {
                    name: "System & Integration Testing",
                    description: "Executed comprehensive system, integration, and functional testing across multiple applications, ensuring seamless component interactions and business process workflows."
                },
                {
                    name: "End-to-End & Regression Testing",
                    description: "Designed and implemented end-to-end and regression testing strategies, validating critical user journeys and preventing regressions across release cycles."
                },
                {
                    name: "Microsoft Dynamics 365 CRM Automation",
                    description: "Developed Selenium WebDriver automation framework specifically for Microsoft Dynamics 365 CRM, ensuring robust automation for complex enterprise workflows."
                },
                {
                    name: "Azure Function Integration Framework",
                    description: "Architected and built integration testing framework for Azure Functions using Cucumber (BDD) and REST Assured, enabling seamless cloud-based service testing."
                },
                {
                    name: "BDD Framework Implementation with Cucumber",
                    description: "Implemented Behavior-Driven Development (BDD) framework using Cucumber, improving collaboration between QA and business stakeholders through executable specifications."
                }
            ]
        },
        {
            company: "Cognizant",
            role: "Associate - Projects (Frontend/QA)",
            duration: "July 2018 - July 2021",
            location: "Kolkata, West Bengal",
            description: "Hands-on experience in Selenium and API automation (Rest Assured, SoapUI). Developed automation frameworks from scratch. Worked on Mulesoft middleware application testing. Received early promotion for dedicated performance.",
            keyContributions: [
                {
                    name: "Selenium Web Automation Framework",
                    description: "Developed web automation frameworks from scratch using Selenium, implementing Page Object Model (POM) design patterns for maintainability and scalability."
                },
                {
                    name: "API Automation with REST Assured & SoapUI",
                    description: "Implemented comprehensive API testing using REST Assured and SoapUI, validating REST and SOAP services across multiple environments."
                },
                {
                    name: "Mulesoft Middleware Testing",
                    description: "Specialized in Mulesoft middleware application testing, validating integration flows, data mappings, and middleware-dependent processes."
                },
                {
                    name: "Early Promotion to Associate",
                    description: "Recognized for outstanding performance and dedication, receiving early promotion to Associate level, demonstrating strong technical skills and team contribution."
                }
            ]
        }
    ],

    projectsData: {
        "projects": [
            { 
                "id": 1, 
                "title": "Playwright Framework", 
                "date": "Mar 2023",
                "display": true,
                "relevance": 100,
                "description": "A comprehensive, next-generation test automation framework built with Playwright, TypeScript, and modern DevOps practices. Features multi-browser testing, parallel execution, and powerful debugging capabilities for reliable end-to-end testing.", 
                "longDescription": { 
                    "description": "Enterprise-grade Playwright automation framework with TypeScript support, modern async/await patterns, and fixture-based test organization. Provides a complete testing solution with Page Object Model architecture, comprehensive utilities, and production-ready infrastructure.", 
                    "points": [
                        "Page Object Model (POM) design pattern with base page abstraction", 
                        "Multi-browser testing: Chromium, Firefox, WebKit with parallel execution", 
                        "Fixture-based test setup/teardown and resource management", 
                        "Automatic video recording and screenshot capture on failure", 
                        "Network interception and API response mocking capabilities",
                        "Intelligent auto-waiting for elements and network idle states",
                        "Comprehensive test scenarios: Authentication, Cart, Checkout, Products",
                        "Configuration management for multiple environments (Dev, QA, Staging)",
                        "Built-in Allure reporting with detailed test analytics",
                        "CI/CD integration with GitHub Actions workflow automation"
                    ] 
                }, 
                "imageLink": null, 
                "icon": "fa-play", 
                "category": "qa", 
                "link": "PlaywrightFramework/", 
                "tags": ["Playwright", "TypeScript", "Test Automation", "E2E Testing", "Page Object Model"]
            },
            { "id": 2, "title": "UI Test Automation", "date": "Oct 2024", "display": true, "relevance": 95, "description": "Comprehensive, production-ready test automation framework built with Selenium and Java. Implements Page Object Model pattern, BDD with Cucumber, and enterprise-grade best practices for reliable UI testing.", "longDescription": { "description": "Enterprise-grade Selenium-based UI automation framework with Java. Features Page Object Model architecture, Cucumber BDD integration, reusable UI components, and production-ready utilities for maintainable and scalable test automation.", "points": ["Page Object Model (POM) with component-based design pattern", "Cucumber BDD framework with Gherkin syntax feature files", "Reusable UI components (AppButton, AppTextInput, AppDropDown, etc.)", "Maven build system with complete dependency management", "Apache POI for Excel-driven data parameterization", "Configuration management for multi-environment testing", "Screenshot capture utilities for failure analysis", "ScenarioContext for cross-step data sharing", "Hooks and lifecycle management for setup/teardown", "Comprehensive test scenarios for login, cart, and checkout flows"] }, "imageLink": null, "icon": "fa-mobile-alt", "category": "qa", "link": "SeleniumFramework/index.html", "tags": ["Selenium", "Java", "Cucumber", "BDD", "Page Object Model", "Maven"] },
            { "id": 5, "title": "REST Assured Framework", "date": "Feb 2021", "display": true, "relevance": 90, "description": "REST API testing framework showcasing API validation, response parsing, and endpoint testing. Ideal for API-first testing strategies.", "longDescription": { "description": "Java-based REST API testing framework using REST Assured library. Comprehensive examples of API testing, validation, and assertion strategies.", "points": ["GET, POST, PUT, DELETE endpoint testing", "Request/response validation and parsing", "Authentication and authorization testing", "Header and body assertion", "JSON Path and XML Path queries", "API response schema validation", "Test data setup and teardown"] }, "imageLink": null, "icon": "fa-network-wired", "category": "qa", "link": "RestAssuredFramework/index.html", "tags": ["API Testing", "REST", "Java"] },
            { "id": 4, "title": "Learn Automation", "date": "May 2025", "display": true, "relevance": 70, "description": "Interactive learning platform demonstrating automation techniques. Includes practice examples with alerts, dropdowns, iframes, drag-drop, and form handling.", "longDescription": { "description": "Comprehensive interactive learning platform with hands-on automation examples. Perfect for beginners learning automation fundamentals and intermediate testers improving their skills.", "points": ["Alert handling and dialog popups", "Dropdown and multi-select elements", "iframe and nested frame handling", "Drag and drop interactions", "File upload scenarios", "Form filling and validation", "Window and tab management"] }, "imageLink": null, "icon": "fa-graduation-cap", "category": "qa", "link": "learn.automation/index.html", "tags": ["Learning", "Practice", "Web Elements"] },
            { "id": 3, "title": "QA Sniper", "date": "Mar 2021", "display": true, "relevance": 65, "description": "Curated collection of QA automation snippets and useful code utilities. Includes locator strategies, assertion helpers, and common automation patterns.", "longDescription": { "description": "A well-organized repository of reusable code snippets and automation utilities for QA engineers. Includes common patterns, utilities, and best practices.", "points": ["XPath and CSS selector strategies", "Custom assertion methods and matchers", "Wait condition utilities", "Test data builders and fixtures", "Common automation design patterns", "Debugging and troubleshooting helpers"] }, "imageLink": null, "icon": "fa-scissors", "category": "qa", "link": "qasnipper/index.html", "tags": ["Code Snippets", "QA Tools", "Utilities"] },
            { "id": 6, "title": "Test Report", "date": "Nov 2020", "display": true, "relevance": 60, "description": "Professional test report dashboard showcasing test metrics, execution statistics, and detailed test results visualization with interactive charts.", "longDescription": { "description": "Interactive test reporting dashboard with comprehensive metrics visualization. Displays test execution statistics, pass/fail rates, and detailed test results with beautiful charts.", "points": ["Real-time test metrics display", "Pass/fail/skip statistics visualization", "Execution timeline and duration analysis", "Test case categorization and filtering", "Detailed execution logs and screenshots", "Performance metrics and trends", "Interactive charts and graphs"] }, "imageLink": null, "icon": "fa-chart-line", "category": "qa", "link": "testreport/index.html", "tags": ["Reporting", "Analytics", "Dashboard"] },
            { "id": 7, "title": "Dummy Claim", "date": "Jul 2025", "display": true, "relevance": 50, "description": "Sample claims management application for testing purposes. Features user authentication, claim submission, dashboard analytics, and file upload capabilities.", "longDescription": { "description": "Full-featured claims management web application designed for testing and training. Includes authentication, data management, and reporting features.", "points": ["User login and session management", "Claim submission and tracking", "Document upload and verification", "Claims analytics dashboard", "Status tracking and notifications", "Admin and user role separation", "Search and filtering capabilities"] }, "imageLink": null, "icon": "fa-file-invoice", "category": "qa", "link": "dummyclaim/index.html", "tags": ["Test Application", "Claims", "Web App"] },
            { "id": 8, "title": "BioGen", "date": "Feb 2025", "display": true, "relevance": 35, "description": "Biodata generation and management tool with theme switching. Includes profile photo management, printing capabilities, and data export features.", "longDescription": { "description": "Professional biodata generation tool with rich editing features. Create, customize, and export biodata in multiple formats with theme support.", "points": ["Interactive biodata form with validation", "Photo upload and management", "Multiple theme options for custom styling", "Print to PDF functionality", "Data export in multiple formats", "Template customization", "Mobile-responsive design"] }, "imageLink": null, "icon": "fa-dna", "category": "dev", "link": "biogen/index.html", "tags": ["Data Management", "Biodata", "Web App"] },
            { "id": 9, "title": "Drum Kit", "date": "Jul 2021", "display": true, "relevance": 30, "description": "Interactive virtual drum kit with realistic sound effects. Click or use keyboard shortcuts to play different drum sounds and create rhythms.", "longDescription": { "description": "Interactive virtual drum kit with realistic sound effects and keyboard integration. Create music by clicking or pressing keyboard shortcuts.", "points": ["Realistic drum sound effects", "Keyboard shortcuts for all drums", "Visual feedback on drum hits", "Responsive touch support", "Multiple drum kit layouts", "Sound volume control", "Recording and playback features"] }, "imageLink": null, "icon": "fa-drum", "category": "dev", "link": "drumkit/index.html", "tags": ["Game", "Audio", "Interactive"] },
            { "id": 10, "title": "Simon Game", "date": "Jul 2021", "display": true, "relevance": 28, "description": "Classic Simon memory game with increasing difficulty levels. Test your memory and reflexes as the sequence gets longer and faster.", "longDescription": { "description": "Classic Simon Says memory game with progressive difficulty. Test your memory and reaction time with increasingly complex sequences.", "points": ["Progressive difficulty levels", "Color-coded button sequences", "Audio and visual feedback", "Score tracking and high scores", "Multiple game modes", "Reset and restart options", "Leaderboard and statistics"] }, "imageLink": null, "icon": "fa-gamepad", "category": "dev", "link": "simongame/index.html", "tags": ["Game", "JavaScript", "Memory"] },
            { "id": 11, "title": "Tic Tac Toe", "date": "Oct 2020", "display": true, "relevance": 27, "description": "Classic Tic Tac Toe game implementation with intuitive gameplay. Play against AI or another player with game rules and win conditions.", "longDescription": { "description": "Classic Tic Tac Toe game with AI opponent and multiplayer modes. Includes game state management and win condition detection.", "points": ["Single player vs AI mode", "Multiplayer two-player mode", "Difficulty levels for AI opponent", "Game history and move replay", "Win/loss statistics tracking", "Reset and new game options", "Responsive game board"] }, "imageLink": null, "icon": "fa-tic", "category": "dev", "link": "XnO/index.html", "tags": ["Game", "JavaScript", "AI"] },
            { "id": 12, "title": "HTML Builder", "date": "Dec 2020", "display": true, "relevance": 32, "description": "Rich text HTML editor with formatting tools. Create formatted content with bold, italic, lists, links, images, and text justification options.", "longDescription": { "description": "Powerful WYSIWYG HTML editor with comprehensive formatting tools. Create and edit rich text content with real-time preview.", "points": ["Text formatting (bold, italic, underline, strikethrough)", "Text alignment and justification", "Ordered and unordered lists", "Link insertion and editing", "Image embedding and sizing", "Code block insertion", "Real-time HTML preview"] }, "imageLink": null, "icon": "fa-pen-fancy", "category": "dev", "link": "htmlbuilder/index.html", "tags": ["Editor", "Text Formatting", "HTML"] },
            { "id": 13, "title": "JSON Tools", "date": "Apr 2023", "display": true, "relevance": 33, "description": "Comprehensive JSON manipulation utilities for formatting, validation, and parsing. Supports JSON-to-CSV conversion and beautification.", "longDescription": { "description": "All-in-one JSON manipulation toolkit for developers. Format, validate, transform, and analyze JSON data with ease.", "points": ["JSON formatting and minification", "JSON validation with error reporting", "JSON to CSV conversion", "CSV to JSON import", "JSON schema validation", "Data sorting and filtering", "Clipboard integration"] }, "imageLink": null, "icon": "fa-braces", "category": "dev", "link": "jsontools/index.html", "tags": ["JSON", "Tools", "Developer Utilities"] },
            { "id": 14, "title": "Way2QAE", "date": "Feb 2025", "display": true, "relevance": 40, "description": "Main QA learning platform providing comprehensive course materials. Foundation for QA engineering training with structured curriculum.", "longDescription": { "description": "Comprehensive QA engineering learning platform with structured course materials. Foundation for aspiring and professional QA engineers.", "points": ["Structured QA fundamentals course", "Automation best practices guides", "Tool-specific tutorials and documentation", "Real-world project examples", "Industry standard patterns and practices", "Certification preparation materials", "Community resources and forums"] }, "imageLink": null, "icon": "fa-book", "category": "dev", "link": "way2qae/index.html", "tags": ["Learning", "QA Training", "Course"] },
            { "id": 15, "title": "Quiz Maker", "date": "May 2025", "display": true, "relevance": 25, "description": "Interactive quiz builder tool for creating and taking quizzes. Features question management, scoring, and progress tracking.", "longDescription": { "description": "Flexible quiz creation and management platform. Build engaging quizzes with multiple question types and automatic scoring.", "points": ["Multiple question types (MCQ, true/false, fill-in-the-blank)", "Quiz creation and editing interface", "Automatic scoring and grading", "Progress tracking and statistics", "Timed quizzes with countdowns", "Question randomization options", "Result export and certificates"] }, "imageLink": null, "icon": "fa-list-check", "category": "dev", "link": "way2qaequizmaker/index.html", "tags": ["Quiz", "Education", "Interactive"] },
            { "id": 16, "title": "Slides Maker", "date": "May 2025", "display": true, "relevance": 24, "description": "Tutorial presentation slides creator tool. Build engaging slide decks with text, images, and multimedia content for training delivery.", "longDescription": { "description": "Intuitive presentation slide builder for creating professional training materials. Support for text, images, videos, and animations.", "points": ["Drag-and-drop slide editor", "Text and image formatting tools", "Multimedia embedding (audio, video)", "Slide transitions and animations", "Speaker notes and presenter mode", "Theme and layout customization", "Export to PDF and downloadable formats"] }, "imageLink": null, "icon": "fa-stream", "category": "dev", "link": "way2qaetutorialslidesmaker/index.html", "tags": ["Presentation", "Slides", "Education"] },
            { "id": 17, "title": "Curriculum", "date": "Feb 2025", "display": true, "relevance": 42, "description": "Structured QA engineering curriculum with learning modules. Comprehensive course outline and training materials for QA professionals.", "longDescription": { "description": "Comprehensive QA engineering curriculum with modular learning paths. Designed for career progression from beginner to advanced levels.", "points": ["Beginner fundamentals module", "Intermediate automation framework design", "Advanced API and performance testing", "Tool-specific training tracks", "Hands-on project assignments", "Capstone projects for certification", "Career guidance and progression paths"] }, "imageLink": null, "icon": "fa-graduation-cap", "category": "dev", "link": "way2qae-curriculum/index.html", "tags": ["Course", "QA Training", "Curriculum"] },
            { "id": 18, "title": "Wonder Toyz", "date": "Feb 2026", "display": true, "relevance": 22, "description": "E-commerce toy store platform with product catalog, shopping cart, and checkout. Includes order tracking and payment integration.", "longDescription": { "description": "Full-featured e-commerce platform for toy store operations. Includes product management, shopping cart, and order tracking.", "points": ["Product catalog with search and filtering", "Shopping cart management", "Secure checkout process", "Payment gateway integration", "Order history and tracking", "User account management", "Product reviews and ratings"] }, "imageLink": null, "icon": "fa-shopping-cart", "category": "dev", "link": "wondertoyz/index.html", "tags": ["E-commerce", "Shopping", "Web App"] },
            { "id": 19, "title": "Tradex Trading App Design", "date": "Nov 2025", "display": true, "relevance": 20, "description": "Trading platform with portfolio management, trade execution, and market analysis tools. Includes backtesting and performance analytics.", "longDescription": { "description": "Advanced trading platform with real-time market data and portfolio analysis. Support for strategy backtesting and performance optimization.", "points": ["Real-time market data and charts", "Portfolio management and tracking", "Trade execution and order management", "Strategy backtesting tools", "Performance analytics and reports", "Risk analysis and alerts", "Historical data analysis"] }, "imageLink": null, "icon": "fa-chart-bar", "category": "dev", "link": "tradex/index.html", "tags": ["Trading", "Finance", "Analytics"] },
            { "id": 20, "title": "Notice Maker", "date": "Feb 2025", "display": true, "relevance": 18, "description": "Document and notice creation tool with templates. Generate professional notices, letters, and announcements with customizable formatting.", "longDescription": { "description": "Professional document and notice generator with pre-built templates. Create formal documents quickly with customizable templates.", "points": ["Pre-built notice templates", "Letter and announcement templates", "Batch document generation", "Custom branding options", "Export to PDF and Word formats", "Template library management", "Document archival and retrieval"] }, "imageLink": null, "icon": "fa-id-card", "category": "dev", "link": "noticemaker/index.html", "tags": ["Document", "Templates", "Utility"] },
            { "id": 21, "title": "First Birthday", "date": "Aug 2025", "display": true, "relevance": 15, "description": "Personal portfolio and profile showcase. Highlights skills, projects, and professional achievements with an attractive design.", "longDescription": { "description": "Professional portfolio website showcasing skills and projects. Modern design with interactive elements and comprehensive project highlights.", "points": ["Professional portfolio layout", "Project showcase with descriptions", "Skills and expertise display", "Contact information and social links", "Responsive mobile-first design", "Performance optimized", "SEO-friendly structure"] }, "imageLink": null, "icon": "fa-user", "category": "dev", "link": "mohammad-zohan/index.html", "tags": ["Portfolio", "Profile", "Showcase"] },
            { "id": 22, "title": "Ramadan Mubarak", "date": "Apr 2022", "display": true, "relevance": 12, "description": "Ramadan celebration application with prayer times, calendar, and religious information. Includes notifications and daily reminders.", "longDescription": { "description": "Islamic calendar and prayer times application for Ramadan. Track prayer times, fasting schedules, and daily Islamic content.", "points": ["Prayer times for multiple locations", "Islamic calendar with dates", "Fasting schedule and reminders", "Daily Islamic quotes and teachings", "Push notifications for prayer times", "Nearby mosque finder", "Community features and discussions"] }, "imageLink": null, "icon": "fa-moon", "category": "dev", "link": "RamazanMubarak/index.html", "tags": ["Religion", "Calendar", "Application"] },
            { "id": 23, "title": "Area Calculator", "date": "Nov 2025", "display": true, "relevance": 8, "description": "Mathematical calculator for computing areas of different shapes. Supports circles, rectangles, triangles, and other geometric figures with instant results.", "longDescription": { "description": "Comprehensive geometric calculator for area calculations. Support for various 2D shapes with instant result calculation.", "points": ["Rectangle and square area calculation", "Circle area with radius input", "Triangle area with multiple formulas", "Trapezoid and parallelogram calculations", "Polygon area computation", "Unit conversion options", "Calculation history and memory"] }, "imageLink": null, "icon": "fa-square", "category": "utils", "link": "areacalculator/index.html", "tags": ["Calculator", "Math", "Geometry"] },
            { "id": 24, "title": "Countdown Timer", "date": "May 2022", "display": true, "relevance": 10, "description": "Simple countdown timer with customizable duration. Perfect for events, meetings, exercises, or any time-based activities with alert notifications.", "longDescription": { "description": "Flexible countdown timer with customizable durations and notifications. Perfect for time management and activity tracking.", "points": ["Custom duration input", "Multiple timer presets", "Audio and visual alerts", "Lap/interval tracking", "Pause and resume functionality", "Timer history", "Desktop notifications"] }, "imageLink": null, "icon": "fa-hourglass-end", "category": "utils", "link": "countdown/index.html", "tags": ["Timer", "Utility", "Time-tracking"] },
            { "id": 25, "title": "Credit Score Tool", "date": "Nov 2025", "display": true, "relevance": 5, "description": "Credit score calculator for juice booth operations. Tracks customer loyalty points and credit management for business operations.", "longDescription": { "description": "Specialized credit and loyalty point management system for juice booth operations. Track customer balances and credit scores.", "points": ["Customer credit tracking", "Loyalty point accumulation", "Redemption and adjustment options", "Customer account statements", "Transaction history", "Bulk credit operations", "Exportable reports"] }, "imageLink": null, "icon": "fa-juice-box", "category": "utils", "link": "creditscorejuiceboothapp/index.html", "tags": ["Calculator", "Business", "Management"] },
            { "id": 26, "title": "EPF Calculator", "date": "May 2025", "display": true, "relevance": 7, "description": "Employee Provident Fund calculation tool for retirement planning. Computes accumulations, maturity benefits, and withdrawal amounts based on contributions.", "longDescription": { "description": "Financial planning tool for Employee Provident Fund calculations. Accurate computation of retirement benefits and accumulations.", "points": ["EPF contribution calculation", "Maturity benefit projection", "Withdrawal amount computation", "Interest rate adjustments", "Multi-year projections", "Retirement age flexibility", "Downloadable benefit statements"] }, "imageLink": null, "icon": "fa-piggy-bank", "category": "utils", "link": "epfcalculator/index.html", "tags": ["Calculator", "Finance", "Retirement"] },
            { "id": 27, "title": "Expense Splitter", "date": "Oct 2025", "display": true, "relevance": 9, "description": "Smart expense splitting calculator for group outings. Automatically calculates individual shares and settlement amounts between friends and colleagues.", "longDescription": { "description": "Intelligent expense tracking and splitting tool for group activities. Automatically calculate who owes whom and settlement amounts.", "points": ["Group expense tracking", "Fair split calculations", "Settlement amount computation", "Multiple payment options", "Transaction history", "Export reports", "Mobile-friendly interface"] }, "imageLink": null, "icon": "fa-split", "category": "utils", "link": "expense-splitter/index.html", "tags": ["Calculator", "Utility", "Expense Management"] },
            { "id": 28, "title": "MathBee", "date": "Jun 2023", "display": true, "relevance": 3, "description": "Intelligent math learning platform with adaptive difficulty levels. Provides personalized problem sets and solution explanations for effective learning.", "longDescription": { "description": "AI-powered adaptive math learning platform with difficulty progression. Personalized learning paths with instant feedback and explanations.", "points": ["Adaptive difficulty progression", "Personalized problem generation", "Instant feedback and explanations", "Progress tracking and analytics", "Multiple math topics covered", "Timed practice sessions", "Performance-based recommendations"] }, "imageLink": null, "icon": "fa-lightbulb", "category": "ai", "link": "mathbee/v2/index.html", "tags": ["AI", "Learning", "Math", "Adaptive"] }
        ],
        "categories": [
            { "id": "qa", "name": "QA & Automation Engineering", "description": "Testing frameworks, automation utilities, and QA tools", "icon": "fa fa-robot", "color": "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)" },
            { "id": "dev", "name": "Development & Scripting", "description": "Interactive applications, games, editors, and learning platforms", "icon": "fa fa-code", "color": "linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)" },
            { "id": "utils", "name": "Utilities & Tools", "description": "Practical calculators and utility applications", "icon": "fa fa-toolbox", "color": "linear-gradient(135deg, var(--accent-color) 0%, var(--primary-color) 100%)" },
            { "id": "ai", "name": "AI & Machine Learning", "description": "Intelligent learning and analysis tools", "icon": "fa fa-brain", "color": "linear-gradient(135deg, var(--tertiary-color) 0%, var(--secondary-color) 100%)" }
        ]
    },

    awards: [
        {
            title: "Dream Team Award",
            issuer: "Client Organisation (PwC)",
            month: "Mar",
            year: "2023",
            icon: "fas fa-trophy",
            description: "Recognized as a core team member for outstanding collaboration and significant contributions to project success"
        },
        {
            title: "Star R&R Award",
            issuer: "PwC",
            month: "Nov",
            year: "2022",
            icon: "fas fa-star",
            description: "Awarded for delivering exceptional results and recognition for remarkable performance and dedication"
        },
        {
            title: "Spot Award",
            issuer: "Client Organisation (PwC)",
            month: "Oct",
            year: "2022",
            icon: "fas fa-medal",
            description: "Received multiple spot awards for immediate recognition of outstanding work and exceptional problem-solving"
        },
        {
            title: "Early Promotion to Associate",
            issuer: "Cognizant",
            month: "Jun",
            year: "2021",
            icon: "fas fa-arrow-trend-up",
            description: "Promoted to Associate level ahead of schedule, demonstrating leadership and technical excellence"
        }
    ],

    education: [
        {
            institution: "Maulana Abul Kalam Azad University of Technology",
            degree: "B.Tech (EE)",
            field: "Bachelor of Technology",
            year: "2018",
            gpa: "84.70% (CGPA 9.22)",
            details: "Comprehensive understanding of software development, data structures, algorithms, and computer networks"
        },
        {
            institution: "West Bengal Council of Secondary <br> Education",
            degree: "12th Standard Science",
            field: "Science Stream",
            year: "2013",
            gpa: "74.80%",
            details: "Strong foundation in Physics, Chemistry, and Mathematics"
        },
        {
            institution: "West Bengal Board of Secondary <br>Education",
            degree: "10th Standard",
            field: "General",
            year: "2011",
            gpa: "80.88%",
            details: "Strong academic foundation in core subjects"
        }
    ],

    contact: {
        location: "India",
        github: "https://github.com/sharikmp",
        linkedin: "https://linkedin.com"
    }
};





// ===== INITIALIZE PORTFOLIO =====
document.addEventListener('DOMContentLoaded', function () {
    renderProfile();
    renderSkills();
    renderExperience();
    renderProjects();
    renderAwards();
    renderAcademics();
    renderFooter();
    initializeProjectFilters();
    initializeScrollEffects();
});

// ===== RENDER PROFILE =====
function renderProfile() {
    const profile = portfolioData.profile;
    
    // Update hero section
    const heroName = document.getElementById('heroName');
    const heroTitle = document.getElementById('heroTitle');
    const heroSummary = document.getElementById('heroSummary');
    const profilePicPlaceholder = document.querySelector('.profile-pic-placeholder');
    
    if (heroName) heroName.textContent = profile.name;
    if (heroTitle) heroTitle.textContent = profile.title;
    if (heroSummary) heroSummary.textContent = profile.summary;
    
    // Update or create profile image if imageLink exists
    if (profilePicPlaceholder && profile.image) {
        const profilePic = profilePicPlaceholder.parentElement;
        // Clear placeholder and add image
        if (profile.image) {
            profilePicPlaceholder.innerHTML = `<img src="${profile.image}" alt="${profile.name}" style="width: 100%; height: 100%; object-fit: cover;">`;
        }
    }
}

// ===== RENDER SKILLS =====
function renderSkills() {
    const skillsGrid = document.getElementById('skillsGrid');
    skillsGrid.innerHTML = portfolioData.skills.map((skill, index) => `
                <div class="skill-category" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="skill-category-header">
                        <div class="skill-category-icon-bg">
                            <i class="fa ${skill.icon}"></i>
                        </div>
                        <h3>${skill.category}</h3>
                    </div>
                    <div class="skills-list">
                        ${skill.items.map(s => `
                            <div class="skill-item">
                                <span class="skill-name">${s.name}</span>
                                <span class="skill-duration-tag">${s.duration}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
}

// ===== RENDER EXPERIENCE =====
function renderExperience() {
    const timeline = document.getElementById('experienceTimeline');
    timeline.innerHTML = portfolioData.experience.map((exp, index) => `
                <div class="experience-item" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="experience-left">
                        <div class="company-header">
                            <h3>${exp.company}</h3>
                            <p class="role"><i class="fas fa-briefcase"></i> ${exp.role}</p>
                        </div>
                        <p class="duration"><i class="fas fa-calendar"></i> ${exp.duration}</p>
                        <p class="description">${exp.description}</p>
                    </div>
                    
                    <div class="timeline-divider">
                        <div class="timeline-start-dot"></div>
                        <div class="timeline-line"></div>
                        <div class="timeline-end-dot"></div>
                    </div>
                    
                    <div class="experience-right">
                        ${exp.keyContributions && exp.keyContributions.length > 0 ? `
                            <div class="key-contributions">
                                <h4><i class="fas fa-star"></i> Key Contributions</h4>
                                <ul class="contributions-list">
                                    ${exp.keyContributions.map(contrib => `
                                        <li>
                                            <strong>${contrib.name}:</strong> ${contrib.description}
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');
}

// ===== RENDER PROJECTS =====
function renderProjects(sortBy = 'relevance') {
    const projectsContainer = document.getElementById('projectsGrid');
    const projects = portfolioData.projectsData.projects.filter(p => p.display !== false);
    const categories = portfolioData.projectsData.categories;

    // Sort projects globally or within categories
    let sortedProjects = [...projects];
    if (sortBy === 'relevance') {
        sortedProjects.sort((a, b) => b.relevance - a.relevance);
    } else if (sortBy === 'date') {
        sortedProjects.sort((a, b) => {
            const dateA = new Date(a.date || '0');
            const dateB = new Date(b.date || '0');
            return dateB - dateA;
        });
    }

    projectsContainer.innerHTML = `
        <div class="project-sort-controls">
            <label for="projectSort">Sort by:</label>
            <select id="projectSort" onchange="renderProjects(this.value)">
                <option value="relevance">Relevance</option>
                <option value="date">Date (Latest First)</option>
            </select>
        </div>
        ${categories.map(category => {
            const categoryProjects = sortedProjects.filter(p => p.category === category.id);
            
            if (categoryProjects.length === 0) return '';

            return `
                <div class="project-category-section" data-category="${category.id}" data-aos="fade-up">
                    <div class="category-header">
                        <h3><i class="${category.icon}"></i> ${category.name}</h3>
                        <p>${category.description}</p>
                    </div>
                    <table class="projects-table">
                        <thead>
                            <tr>
                                <th style="width: 5%;"> #</th>
                                <th style="width: 18%;">Title</th>
                                <th style="width: 45%;">Description</th>
                                <th style="width: 10%;">Link</th>
                                <th style="width: 12%;">Date</th>
                                <th style="width: 10%;">More Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${categoryProjects.map((project, idx) => `
                                <tr class="project-row" data-id="${project.id}">
                                    <td class="project-number" style="width: 5%;">${idx + 1}</td>
                                    <td class="project-title" style="width: 18%;">${project.title}</td>
                                    <td class="project-description" style="width: 45%;">${project.description}</td>
                                    <td class="project-link" style="width: 10%;">
                                        <a href="${project.link}" target="_blank" title="Open ${project.title}">
                                            <i class="fas fa-external-link-alt"></i>
                                        </a>
                                    </td>
                                    <td class="project-date" style="width: 12%;">${project.date || '—'}</td>
                                    <td class="project-expand" style="width: 10%;">
                                        <button class="expand-btn" onclick="toggleProjectRow(this, ${project.id})" title="Expand details">
                                            <i class="fas fa-chevron-down"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr class="project-details-row" id="details-${project.id}" style="display: none;">
                                    <td colspan="6" class="details-cell">
                                        <div class="project-details-content">
                                            <div class="detail-section">
                                                <h4><i class="fas fa-info-circle"></i> Overview</h4>
                                                <p>${project.longDescription.description}</p>
                                            </div>
                                            <div class="detail-section">
                                                <h4><i class="fas fa-list-check"></i> Key Features</h4>
                                                <ul class="features-list">
                                                    ${project.longDescription.points.map(point => `<li><i class="fas fa-check"></i> ${point}</li>`).join('')}
                                                </ul>
                                            </div>
                                            <div class="detail-section">
                                                <h4><i class="fas fa-microchip"></i> Technologies</h4>
                                                <div class="project-tags">
                                                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }).join('')}
    `;
}

// ===== TOGGLE PROJECT ROW COLLAPSE =====
function toggleProjectRow(button, projectId) {
    button.classList.toggle('active');
    const detailsRow = document.getElementById(`details-${projectId}`);
    if (detailsRow) {
        if (detailsRow.style.display === 'none') {
            detailsRow.style.display = 'table-row';
            button.querySelector('i').classList.remove('fa-chevron-down');
            button.querySelector('i').classList.add('fa-chevron-up');
        } else {
            detailsRow.style.display = 'none';
            button.querySelector('i').classList.remove('fa-chevron-up');
            button.querySelector('i').classList.add('fa-chevron-down');
        }
    }
}

// ===== TOGGLE PROJECT COLLAPSE (Legacy - Kept for compatibility) =====
function toggleProjectCollapse(button) {
    button.classList.toggle('active');
    const content = button.nextElementSibling;
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }
}

// ===== INITIALIZE PROJECT FILTERS =====
function initializeProjectFilters() {
    const filters = document.getElementById('projectFilters');
    const categories = portfolioData.projectsData.categories;

    filters.innerHTML = `
                <button class="filter-btn active" onclick="filterProjects('all')">
                    <i class="fas fa-th"></i> All Categories
                </button>
            ` + categories.map(cat => `
                <button class="filter-btn" onclick="filterProjects('${cat.id}')" data-category="${cat.id}">
                    <i class="${cat.icon}"></i> ${cat.name}
                </button>
            `).join('');
}

// ===== FILTER PROJECTS =====
function filterProjects(categoryId) {
    const sections = document.querySelectorAll('.project-category-section');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.closest('.filter-btn').classList.add('active');

    sections.forEach(section => {
        if (categoryId === 'all' || section.dataset.category === categoryId) {
            section.classList.remove('hidden');
            section.style.display = 'block';
        } else {
            section.classList.add('hidden');
            section.style.display = 'none';
        }
    });
}

// ===== OPEN PROJECT DETAIL =====
function openProjectDetail(projectId) {
    const project = portfolioData.projectsData.projects.find(p => p.id === projectId);
    const category = portfolioData.projectsData.categories.find(c => c.id === project.category);
    if (!project) return;

    const detailView = document.getElementById('projectDetailView');
    const detailContent = document.getElementById('projectDetailContent');

    detailContent.innerHTML = `
                <div class="project-detail-header" style="background: ${category.color};">
                    <button class="back-btn" onclick="closeProjectDetail()">
                        <i class="fas fa-times"></i>
                    </button>
                    <h2>${project.title}</h2>
                    <p>${project.description}</p>
                </div>
                <div class="project-detail-body">
                    <div class="detail-section">
                        <h3><i class="fas fa-star"></i> Overview</h3>
                        <p>${project.description}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-tags"></i> Technologies & Skills</h3>
                        <div class="tech-stack">
                            ${project.tags.map(tag => `<span class="tech-stack-item">${tag}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3><i class="fas fa-link"></i> Project Link</h3>
                        <div class="detail-links">
                            <a href="${project.link}" target="_blank" class="detail-link-btn"><i class="fas fa-external-link-alt"></i> View Project</a>
                        </div>
                    </div>
                </div>
            `;

    detailView.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== CLOSE PROJECT DETAIL =====
function closeProjectDetail() {
    const detailView = document.getElementById('projectDetailView');
    detailView.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close detail view on background click
document.addEventListener('click', function (e) {
    const detailView = document.getElementById('projectDetailView');
    if (e.target === detailView) {
        closeProjectDetail();
    }
});

// ===== RENDER AWARDS =====
function renderAwards() {
    const awardsGrid = document.getElementById('awardsGrid');
    awardsGrid.innerHTML = portfolioData.awards.map((award, index) => `
                <div class="award-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="award-badge-ribbon">
                        <i class="fas fa-certificate"></i>
                    </div>
                    <div class="award-icon-container">
                        <div class="award-icon-circle">
                            <i class="${award.icon}"></i>
                        </div>
                    </div>
                    <div class="award-content">
                        <div class="award-date-bubble">
                            <span class="award-month">${award.month}</span>
                            <span class="award-year">${award.year}</span>
                        </div>
                        <h3>${award.title}</h3>
                        <p class="award-issuer">
                            <i class="fas fa-building"></i> ${award.issuer}
                        </p>
                        <p class="award-description">${award.description}</p>
                    </div>
                </div>
            `).join('');
}

// ===== RENDER ACADEMICS =====
function renderAcademics() {
    const academicsGrid = document.getElementById('academicsGrid');
    academicsGrid.innerHTML = portfolioData.education.map((academic, index) => `
                <div class="academic-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="academic-leaf-decor">
                        <i class="fas fa-leaf"></i>
                    </div>
                    <div class="academic-header">
                        <div class="academic-icon-box">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <div class="academic-titles">
                            <h3>${academic.institution}</h3>
                            <p class="degree-main">${academic.degree}</p>
                        </div>
                    </div>
                    <div class="academic-body">
                        <div class="academic-info-row">
                            <span class="info-tag"><i class="fas fa-book-open"></i> ${academic.field}</span>
                            <span class="info-tag"><i class="fas fa-calendar-alt"></i> ${academic.year}</span>
                        </div>
                        <div class="academic-gpa-container">
                            <div class="gpa-label">Academic Achievement</div>
                            <div class="gpa-value">${academic.gpa}</div>
                        </div>
                        <p class="academic-details">${academic.details}</p>
                    </div>
                    <div class="academic-footer-seal">
                        <i class="fas fa-stamp"></i>
                    </div>
                </div>
            `).join('');
}

// ===== RENDER FOOTER =====
function renderFooter() {
    // Social Links
    const socialLinks = document.getElementById('socialLinks');
    socialLinks.innerHTML = '';

    // Footer Links
    const footerLinks = document.getElementById('footerLinks');
    footerLinks.innerHTML = `
                <li><a href="#introduction"><i class="fas fa-home"></i> Home</a></li>
                <li><a href="#skills"><i class="fas fa-star"></i> Skills</a></li>
                <li><a href="#projects"><i class="fas fa-folder"></i> Projects</a></li>
                <li><a href="#awards"><i class="fas fa-trophy"></i> Awards</a></li>
            `;

    // Contact Info
    const contactInfo = document.getElementById('contactInfo');
    const profile = portfolioData.profile;
    contactInfo.innerHTML = `
                <li><i class="fas fa-map-marker-alt"></i> ${profile.location}</li>
            `;
}

// ===== INITIALIZE SCROLL EFFECTS =====
function initializeScrollEffects() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out-cubic',
        once: true,
        offset: 100
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== SMOOTH SCROLL FOR INTERNAL LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});