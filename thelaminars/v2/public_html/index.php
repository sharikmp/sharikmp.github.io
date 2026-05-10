<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="The Laminars, Kolkata — coaching center offering tuition for Class 1-12, spoken English &amp; Hindi classes, Python &amp; Java programming, and career launch programs. Expert faculty · Trusted by 500+ students · 40+ years of excellence." />
    <meta name="keywords" content="coaching center Kolkata, tuition classes Kolkata, science coaching, board exam preparation, Class 9 10 11 12 coaching, English spoken classes, Hindi classes, Python programming Kolkata, Java coaching, tech training Kolkata" />
    <title>The Laminars | Coaching Center in Kolkata - Academics, Languages &amp; Tech</title>

    <!-- Open Graph -->
    <meta property="og:title" content="The Laminars | Coaching Center in Kolkata" />
    <meta property="og:description" content="Where knowledge meets ambition - Science, Languages, Technology &amp; beyond." />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_IN" />

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
    <!-- Google Fonts: Inter + Poppins -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet" />
    <!-- Font Awesome 6 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
    <!-- Site CSS -->
    <link rel="stylesheet" href="css/style.css" />
</head>

<body>

    <!-- ============================================================
     NAVIGATION
============================================================ -->
    <nav class="navbar navbar-expand-lg sticky-top" id="mainNav" aria-label="Main navigation">
        <div class="container">

            <!-- Brand -->
            <a class="navbar-brand" href="#home">
                <img src="img/logo.svg" alt="The Laminars logo" class="brand-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                <span class="brand-icon" style="display:none;" aria-hidden="true"><i class="fas fa-graduation-cap"></i></span>
                <span class="brand-text">The <span>Laminars</span></span>
            </a>

            <!-- Hamburger -->
            <button class="navbar-toggler" type="button"
                data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="hamburger-icon" aria-hidden="true">
                    <span></span><span></span><span></span>
                </span>
            </button>

            <!-- Links -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
                    <li class="nav-item"><a class="nav-link" href="#home">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
                    <li class="nav-item"><a class="nav-link" href="#courses">Courses</a></li>
                    <li class="nav-item"><a class="nav-link" href="#faculty">Faculty</a></li>
                    <li class="nav-item"><a class="nav-link" href="#testimonials">Testimonials</a></li>
                    <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
                </ul>
                <a href="#contact" class="btn btn-enroll ms-lg-3">Enroll Now</a>
            </div>
        </div>
    </nav>


    <!-- ============================================================
     HERO SECTION
============================================================ -->
    <section id="home" class="hero-section" aria-label="Hero">

        <!-- Animated canvas background -->
        <div id="canvas-container" aria-hidden="true"></div>

        <!-- Text overlay -->
        <div class="hero-overlay">
            <div class="container">
                <div class="row align-items-center">

                    <!-- Text column -->
                    <div class="col-lg-8">
                        <div class="hero-text-col">

                            <div class="hero-badge">Kolkata's Premier Coaching Institute</div>

                            <h1 class="hero-heading">
                                The Laminars -<br>
                                <span class="hero-gradient-text" id="heroTyped">Where Knowledge Meets Ambition.</span><span class="typing-cursor" aria-hidden="true"></span>
                            </h1>

                            <p class="hero-subtext">
                                Science · Languages · Technology &amp; beyond — your journey to excellence starts here.
                                Expert faculty, proven results, trusted by 500+ students.
                            </p>

                            <div class="hero-cta">
                                <a href="#courses" class="btn btn-hero-primary">
                                    <i class="fas fa-compass me-2" aria-hidden="true"></i>Explore Courses
                                </a>
                                <a href="#contact" class="btn btn-hero-secondary">
                                    <i class="fas fa-phone me-2" aria-hidden="true"></i>Contact Us
                                </a>
                            </div>

                            <!-- Stats strip -->
                            <div class="hero-stats" aria-label="Key statistics">
                                <div class="stat-item">
                                    <span class="stat-number" data-count="500">0</span><span class="stat-suffix">+</span>
                                    <span class="stat-label">Students Enrolled</span>
                                </div>
                                <div class="stat-divider" aria-hidden="true"></div>
                                <div class="stat-item">
                                    <span class="stat-number" data-count="40">0</span><span class="stat-suffix">+</span>
                                    <span class="stat-label">Years of Excellence</span>
                                </div>
                                <div class="stat-divider" aria-hidden="true"></div>
                                <div class="stat-item">
                                    <span class="stat-number" data-count="11">0</span><span class="stat-suffix">+</span>
                                    <span class="stat-label">Programs Offered</span>
                                </div>
                                <div class="stat-divider" aria-hidden="true"></div>
                                <div class="stat-item">
                                    <span class="stat-number" data-count="5">0</span><span class="stat-suffix">+</span>
                                    <span class="stat-label">Expert Faculty</span>
                                </div>
                            </div>

                        </div>
                    </div><!-- /text col -->

                    <!-- Decorative right column -->
                    <div class="col-lg-4 col-12 d-flex justify-content-center align-items-center hero-deco-col" aria-hidden="true">
                        <div class="hero-deco-left">
                            <div class="hdl-ring hdl-ring-outer"></div>
                            <div class="hdl-ring hdl-ring-inner"></div>
                            <div class="hdl-cap"><img id="hdl-center-img" src="img/course/science.jpeg" alt="Science" class="hdl-center-img" /></div>
                            <div class="hdl-top-label"><span class="hdl-label-text">Science &amp; Maths</span></div>
                            <div class="hdl-orbit-ring">
                                <!-- icons injected by JS from ORBIT_ITEMS in script.js -->
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- Scroll indicator -->
        <div class="scroll-indicator" aria-hidden="true">
            <div class="scroll-dot"></div>
        </div>
    </section>


    <!-- ============================================================
     ABOUT / LEGACY SECTION
============================================================ -->
    <section id="about" class="section-padding" aria-label="About The Laminars">
        <div class="container">
            <div class="row align-items-center g-5">

                <!-- Text -->
                <div class="col-lg-6" data-aos="fade-right">
                    <div class="section-label">Who We Are</div>
                    <h2 class="section-heading">
                        40+ Years of Academic<br>
                        <span class="gradient-text">Excellence in Kolkata</span>
                    </h2>
                    <p class="section-desc">
                        The Laminars is a trusted coaching center in Garden Reach, Kolkata, dedicated to
                        transforming students into confident, capable learners. From Class 1 to advanced tech
                        programs, we bridge the gap between potential and performance.
                    </p>

                    <div class="mv-grid">
                        <div class="mv-card">
                            <div class="mv-icon"><i class="fas fa-bullseye" aria-hidden="true"></i></div>
                            <div>
                                <h5>Our Mission</h5>
                                <p>To provide accessible, high-quality education that empowers every student to achieve academic and personal excellence.</p>
                            </div>
                        </div>
                        <div class="mv-card">
                            <div class="mv-icon"><i class="fas fa-eye" aria-hidden="true"></i></div>
                            <div>
                                <h5>Our Vision</h5>
                                <p>To be the most trusted knowledge partner in Kolkata, shaping future leaders through inspired, multi-disciplinary education.</p>
                            </div>
                        </div>
                    </div>

                    <div class="about-highlights">
                        <div class="highlight-item"><i class="fas fa-check-circle" aria-hidden="true"></i><span>First Coding Coaching in Garden Reach</span></div>
                        <div class="highlight-item"><i class="fas fa-check-circle" aria-hidden="true"></i><span>First Python for Kids in the Area</span></div>
                        <div class="highlight-item"><i class="fas fa-check-circle" aria-hidden="true"></i><span>Industry-Aligned Logic Building</span></div>
                        <div class="highlight-item"><i class="fas fa-check-circle" aria-hidden="true"></i><span>Multidisciplinary Expert Faculty</span></div>
                    </div>
                </div>

                <!-- Visual -->
                <div class="col-lg-6" data-aos="fade-left">
                    <div class="about-visual">
                        <div class="about-main-card">
                            <div class="about-icon-grid">
                                <div class="about-icon-card blue"><i class="fas fa-atom" aria-hidden="true"></i><span>Science</span></div>
                                <div class="about-icon-card teal"><i class="fas fa-language" aria-hidden="true"></i><span>Languages</span></div>
                                <div class="about-icon-card purple"><i class="fas fa-laptop-code" aria-hidden="true"></i><span>Technology</span></div>
                                <div class="about-icon-card orange"><i class="fas fa-trophy" aria-hidden="true"></i><span>Results</span></div>
                            </div>
                            <div class="about-center-badge">
                                <i class="fas fa-graduation-cap" aria-hidden="true"></i>
                                <span>The Laminars</span>
                                <span class="badge-sub">Kolkata · Est. 40+ yrs</span>
                            </div>
                        </div>
                        <div class="float-card float-card-1">
                            <i class="fas fa-star" aria-hidden="true" style="color:#f59e0b"></i>
                            <span>40+ Years of Trust</span>
                        </div>
                        <div class="float-card float-card-2">
                            <i class="fas fa-users" aria-hidden="true" style="color:#3b82f6"></i>
                            <span>500+ Students</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>


    <!-- ============================================================
     LEGACY HIGHLIGHTS STRIP
============================================================ -->
    <section class="section-padding bg-light-section" aria-label="Legacy Highlights">
        <div class="container">
            <div class="section-header text-center">
                <div class="section-label">Our Legacy</div>
                <h2 class="section-heading">Why <span class="gradient-text">The Laminars</span> Stands Apart</h2>
                <p class="section-intro">Decades of teaching mastery, innovation, and commitment to student success</p>
            </div>

            <div class="row g-4 mt-3">

                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="0">
                    <div class="legacy-card">
                        <div class="legacy-icon blue-gradient"><i class="fas fa-history"></i></div>
                        <h5>40+ Years of Excellence</h5>
                        <p>Over four decades of academic expertise with consistent student success across generations and refined teaching methodologies.</p>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="legacy-card">
                        <div class="legacy-icon teal-gradient"><i class="fas fa-heart"></i></div>
                        <h5>A Teacher's Dream Project</h5>
                        <p>Vision-driven educational approach with a community-first mindset, focused on meaningful learning outcomes that empower young minds.</p>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="legacy-card">
                        <div class="legacy-icon purple-gradient"><i class="fas fa-code"></i></div>
                        <h5>First Coding in Garden Reach</h5>
                        <p>Pioneered structured coding education locally with industry-relevant curriculum and hands-on, project-based learning.</p>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="0">
                    <div class="legacy-card">
                        <div class="legacy-icon orange-gradient"><i class="fas fa-child"></i></div>
                        <h5>First Python for Kids</h5>
                        <p>Introduced Python from 5th standard, building logical thinking from an early stage with an interactive and fun learning approach.</p>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="legacy-card">
                        <div class="legacy-icon blue-gradient"><i class="fas fa-layer-group"></i></div>
                        <h5>Multidisciplinary Expertise</h5>
                        <p>Languages, sciences, and technology taught by seasoned subject matter experts for holistic academic development.</p>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="legacy-card">
                        <div class="legacy-icon teal-gradient"><i class="fas fa-lightbulb"></i></div>
                        <h5>Industry-Aligned Logic</h5>
                        <p>Connecting academics with real-world applications through practical understanding, problem solving, and preparing students for future careers.</p>
                    </div>
                </div>

            </div>
        </div>
    </section>


    <!-- ============================================================
     PROGRAMS / COURSES SECTION
============================================================ -->
    <section id="courses" class="section-padding" aria-label="Courses">
        <div class="container">
            <div class="section-header text-center">
                <div class="section-label">Find Your Path</div>
                <h2 class="section-heading">Programs <span class="gradient-text">We Offer</span></h2>
                <p class="section-intro">From foundational academics to career-ready tech skills — there's a program for every learner at The Laminars.</p>
            </div>

            <!-- Category Filter Tabs -->
            <div class="course-filter-tabs" role="tablist" aria-label="Program categories">
                <button class="filter-btn active" data-category="all" role="tab" aria-selected="true">
                    <i class="fas fa-th-large me-1"></i> All Programs
                </button>
                <button class="filter-btn" data-category="academics" role="tab" aria-selected="false">
                    <i class="fas fa-book me-1"></i> Academics
                </button>
                <button class="filter-btn" data-category="languages" role="tab" aria-selected="false">
                    <i class="fas fa-language me-1"></i> Languages
                </button>
                <button class="filter-btn" data-category="technology" role="tab" aria-selected="false">
                    <i class="fas fa-laptop-code me-1"></i> Technology
                </button>
            </div>

            <div class="row g-4 mt-2" id="courseGrid">

                <!-- ─── ACADEMICS CATEGORY HEADER ─── -->
                <div class="col-12 course-category-header" data-category-header="academics" data-aos="fade-up">
                    <div class="category-divider-label"><i class="fas fa-book me-2" aria-hidden="true"></i>Academics</div>
                </div>

                <!-- ─── ACADEMICS ─── -->
                <div class="col-lg-4 col-md-6" data-category="academics" data-aos="fade-up" data-aos-delay="0">
                    <div class="course-card">
                        <div class="course-icon-wrap blue-gradient"><i class="fas fa-child" aria-hidden="true"></i></div>
                        <span class="course-class-tag">Class 1-5</span>
                        <h4 class="course-title">Laminars Little Minds</h4>
                        <p class="course-desc">Building strong academic foundations for young learners through personalized attention and engaging, activity-based methods.</p>
                        <div class="course-meta">
                            <span><i class="fas fa-book" aria-hidden="true"></i> Science, Maths, English, Hindi</span>
                        </div>
                        <div class="course-tags-row">
                            <span class="ctag">Activity-Based</span>
                            <span class="ctag">Individual Attention</span>
                        </div>
                        <a href="#contact" class="btn btn-course" data-course="Laminars Little Minds">Enroll Now <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6" data-category="academics" data-aos="fade-up" data-aos-delay="100">
                    <div class="course-card">
                        <div class="course-icon-wrap teal-gradient"><i class="fas fa-school" aria-hidden="true"></i></div>
                        <span class="course-class-tag teal-tag">Class 6-8</span>
                        <h4 class="course-title">Laminars Foundation Academy</h4>
                        <p class="course-desc">Strengthening core concepts and preparing students for higher academic levels with analytical depth and regular assessments.</p>
                        <div class="course-meta">
                            <span><i class="fas fa-book" aria-hidden="true"></i> Science, Maths, English, Hindi</span>
                        </div>
                        <div class="course-tags-row">
                            <span class="ctag">Concept-Driven</span>
                            <span class="ctag">Doubt Clearing</span>
                        </div>
                        <a href="#contact" class="btn btn-course" data-course="Laminars Foundation Academy">Enroll Now <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6" data-category="academics" data-aos="fade-up" data-aos-delay="200">
                    <div class="course-card">
                        <div class="featured-badge" style="background:var(--purple);">Board</div>
                        <div class="course-icon-wrap purple-gradient"><i class="fas fa-award" aria-hidden="true"></i></div>
                        <span class="course-class-tag arts-tag">Class 9-12 · Board Focus</span>
                        <h4 class="course-title">Laminars Senior Academy</h4>
                        <p class="course-desc">Result-oriented coaching for board classes with in-depth subject understanding, PYQ practice, and personalized mentorship.</p>
                        <div class="course-meta">
                            <span><i class="fas fa-book" aria-hidden="true"></i> Science, English, Hindi</span>
                        </div>
                        <div class="course-tags-row">
                            <span class="ctag">Board Pattern</span>
                            <span class="ctag">Mock Tests</span>
                        </div>
                        <a href="#contact" class="btn btn-course" data-course="Laminars Senior Academy">Enroll Now <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                    </div>
                </div>

                <!-- ─── LANGUAGES CATEGORY HEADER ─── -->
                <div class="col-12 course-category-header" data-category-header="languages" data-aos="fade-up">
                    <div class="category-divider-label"><i class="fas fa-language me-2" aria-hidden="true"></i>Languages</div>
                </div>

                <!-- ─── LANGUAGES ─── -->
                <div class="col-lg-4 col-md-6" data-category="languages" data-aos="fade-up" data-aos-delay="0">
                    <div class="course-card">
                        <div class="course-icon-wrap orange-gradient"><i class="fas fa-heading" aria-hidden="true"></i></div>
                        <span class="course-class-tag orange-tag">Class 9-12 · Board</span>
                        <h4 class="course-title">Hindi — Academic</h4>
                        <p class="course-desc">Board-oriented Hindi coaching with deep focus on grammar, literature, and answer-writing for Classes 9-12.</p>
                        <div class="course-meta">
                            <span><i class="fas fa-pen-nib" aria-hidden="true"></i> Prose, Poetry, Grammar, Mock Papers</span>
                        </div>
                        <div class="course-tags-row">
                            <span class="ctag">Answer Writing</span>
                            <span class="ctag">Board Exam</span>
                        </div>
                        <a href="#contact" class="btn btn-course" data-course="Hindi Academic">Enroll Now <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6" data-category="languages" data-aos="fade-up" data-aos-delay="100">
                    <div class="course-card">
                        <div class="course-icon-wrap blue-gradient"><i class="fas fa-spell-check" aria-hidden="true"></i></div>
                        <span class="course-class-tag">Any Age</span>
                        <h4 class="course-title">Hindi — Basics</h4>
                        <p class="course-desc">Foundational Hindi language skills for beginners of all ages — reading, writing, and spoken basics from Varnamala onwards.</p>
                        <div class="course-meta">
                            <span><i class="fas fa-users" aria-hidden="true"></i> Children, Adults, Non-Hindi Speakers</span>
                        </div>
                        <div class="course-tags-row">
                            <span class="ctag">Beginner Friendly</span>
                            <span class="ctag">All Ages</span>
                        </div>
                        <a href="#contact" class="btn btn-course" data-course="Hindi Basics">Enroll Now <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6" data-category="languages" data-aos="fade-up" data-aos-delay="200">
                    <div class="course-card">
                        <div class="course-icon-wrap teal-gradient"><i class="fas fa-book-open" aria-hidden="true"></i></div>
                        <span class="course-class-tag teal-tag">Class 9-12 · Board</span>
                        <h4 class="course-title">English — Academic</h4>
                        <p class="course-desc">Literature, writing skills, and grammar coaching for Classes 9-12 with a sharp focus on board exam performance.</p>
                        <div class="course-meta">
                            <span><i class="fas fa-pen-nib" aria-hidden="true"></i> Literature, Writing, Grammar, Mock Papers</span>
                        </div>
                        <div class="course-tags-row">
                            <span class="ctag">Chapter-Wise</span>
                            <span class="ctag">Writing Formats</span>
                        </div>
                        <a href="#contact" class="btn btn-course" data-course="English Academic">Enroll Now <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6" data-category="languages" data-aos="fade-up" data-aos-delay="0">
                    <div class="course-card">
                        <div class="course-icon-wrap purple-gradient"><i class="fas fa-comments" aria-hidden="true"></i></div>
                        <span class="course-class-tag arts-tag">All Ages</span>
                        <h4 class="course-title">English — Spoken</h4>
                        <p class="course-desc">Practical spoken English for students and adults — build confidence, fluency, and real communication skills through daily practice.</p>
                        <div class="course-meta">
                            <span><i class="fas fa-users" aria-hidden="true"></i> Students, Professionals, Adults</span>
                        </div>
                        <div class="course-tags-row">
                            <span class="ctag">Practice-First</span>
                            <span class="ctag">Confidence Building</span>
                        </div>
                        <a href="#contact" class="btn btn-course" data-course="English Spoken">Enroll Now <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                    </div>
                </div>

                <!-- ─── TECHNOLOGY CATEGORY HEADER ─── -->
                <div class="col-12 course-category-header" data-category-header="technology" data-aos="fade-up">
                    <div class="category-divider-label"><i class="fas fa-laptop-code me-2" aria-hidden="true"></i>Technology</div>
                </div>

                <!-- ─── TECHNOLOGY ─── -->
                <div class="col-lg-4 col-md-6" data-category="technology" data-aos="fade-up" data-aos-delay="0">
                    <div class="course-card">
                        <div class="course-icon-wrap blue-gradient"><i class="fas fa-laptop-code" aria-hidden="true"></i></div>
                        <span class="course-class-tag">Age 10+ · Up to Class 10</span>
                        <h4 class="course-title">Laminars Code Juniors</h4>
                        <p class="course-desc">Introducing students to programming and logical thinking through Python &amp; Java in a structured, engaging, and beginner-friendly way.</p>
                        <div class="course-meta">
                            <span><i class="fas fa-code" aria-hidden="true"></i> Python, Java, Logic, Algorithms</span>
                        </div>
                        <div class="course-tags-row">
                            <span class="ctag">Weekend Batches</span>
                            <span class="ctag">Project-Based</span>
                        </div>
                        <a href="#contact" class="btn btn-course" data-course="Laminars Code Juniors">Enroll Now <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6" data-category="technology" data-aos="fade-up" data-aos-delay="100">
                    <div class="course-card">
                        <div class="featured-badge" style="background:var(--primary);">Advanced</div>
                        <div class="course-icon-wrap purple-gradient"><i class="fas fa-microchip" aria-hidden="true"></i></div>
                        <span class="course-class-tag arts-tag">Advanced Learners</span>
                        <h4 class="course-title">Laminars Tech Academy</h4>
                        <p class="course-desc">Advanced training in programming and software development for learners building strong technical skills in Python, Java, and DSA.</p>
                        <div class="course-meta">
                            <span><i class="fas fa-code" aria-hidden="true"></i> Python, Java, Algorithms, Software Dev</span>
                        </div>
                        <div class="course-tags-row">
                            <span class="ctag">Real-World Projects</span>
                            <span class="ctag">Flexible Batches</span>
                        </div>
                        <a href="#contact" class="btn btn-course" data-course="Laminars Tech Academy">Enroll Now <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6" data-category="technology" data-aos="fade-up" data-aos-delay="200">
                    <div class="course-card">
                        <div class="featured-badge" style="background:var(--green);">Job-Ready</div>
                        <div class="course-icon-wrap teal-gradient"><i class="fas fa-briefcase" aria-hidden="true"></i></div>
                        <span class="course-class-tag teal-tag">Weekend Batches</span>
                        <h4 class="course-title">Laminars Career Launchpad</h4>
                        <p class="course-desc">Job-ready technical skills and preparation for opportunities in the software and technology domain with interview prep and portfolio projects.</p>
                        <div class="course-meta">
                            <span><i class="fas fa-rocket" aria-hidden="true"></i> Industry-Relevant · Portfolio Builds</span>
                        </div>
                        <div class="course-tags-row">
                            <span class="ctag">Interview Prep</span>
                            <span class="ctag">Portfolio Projects</span>
                        </div>
                        <a href="#contact" class="btn btn-course" data-course="Laminars Career Launchpad">Enroll Now <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
                    </div>
                </div>

            </div><!-- /#courseGrid -->
        </div>
    </section>


    <!-- ============================================================
     THE LAMINARS ADVANTAGE
============================================================ -->
    <section class="section-padding bg-light-section" aria-label="The Laminars Advantage">
        <div class="container">
            <div class="row align-items-center g-5">

                <div class="col-lg-6" data-aos="fade-right">
                    <div class="section-label">The Laminars Advantage</div>
                    <h2 class="section-heading">
                        Empowering Students to Unlock<br>
                        <span class="gradient-text">Their True Potential</span>
                    </h2>
                    <p class="section-desc">
                        We believe every student has the capacity to excel. Our unique methodology bridges
                        the gap between theory and practical application, ensuring education is engaging
                        and deeply understood.
                    </p>
                    <p class="section-desc mt-3">
                        By fostering a supportive environment, we not only improve grades but build lifelong
                        confidence and critical thinking skills that last well beyond the classroom.
                    </p>
                    <a href="#contact" class="btn btn-advantage mt-4">
                        <i class="fas fa-user-plus me-2"></i>Join The Laminars
                    </a>
                </div>

                <div class="col-lg-6" data-aos="fade-left">
                    <div class="row g-3">
                        <div class="col-6">
                            <div class="advantage-card">
                                <div class="adv-icon blue-gradient"><i class="fas fa-users-class"></i></div>
                                <h6>Small Batch Sizes</h6>
                                <p>Ensures high teacher-to-student ratio and meaningful attention.</p>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="advantage-card">
                                <div class="adv-icon teal-gradient"><i class="fas fa-user-tie"></i></div>
                                <h6>Personalized Mentorship</h6>
                                <p>Custom study plans based on each student's pace and learning style.</p>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="advantage-card">
                                <div class="adv-icon purple-gradient"><i class="fas fa-chart-line"></i></div>
                                <h6>Regular Assessments</h6>
                                <p>Weekly tests to track performance and boost weak areas early.</p>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="advantage-card">
                                <div class="adv-icon orange-gradient"><i class="fas fa-question-circle"></i></div>
                                <h6>Doubt-Solving Sessions</h6>
                                <p>Dedicated extra time just for clearing hurdles and building confidence.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>


    <!-- ============================================================
     DIRECTOR'S MESSAGE
============================================================ -->
    <section class="section-padding director-section" aria-label="Founder's Message">
        <div class="container">
            <div class="section-header text-center">
                <div class="section-label">A Word from Our Founder</div>
                <h2 class="section-heading">Founder's <span class="gradient-text">Message</span></h2>
            </div>

            <div class="row justify-content-center mt-4">
                <div class="col-lg-9" data-aos="fade-up">
                    <div class="director-card">
                        <div class="director-photo-wrap">
                            <img src="img/director.png" alt="Md Shahjahan Ansari - Founder &amp; Hindi Teacher" class="director-photo" />
                        </div>
                        <div class="director-content">
                            <blockquote class="director-quote-hindi">
                                "शिक्षा केवल तथ्यों को सीखना नहीं है, बल्कि मन को सोचने के लिए प्रशिक्षित करना है।"
                            </blockquote>
                            <p class="director-quote-en">
                                "Education is not just learning facts, but training the mind to think. At The Laminars,
                                our vision is to create an environment where students are encouraged to ask questions,
                                explore concepts, and discover their true potential. We are committed to shaping not
                                just successful students, but confident leaders of tomorrow."
                            </p>
                            <div class="director-info">
                                <strong>Md Shahjahan Ansari</strong>
                                <span>Founder &amp; Hindi Teacher</span>
                                <span class="director-qual">M.A. (Hindi &amp; Pol. Sci), BTC · 40+ Years Experience</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>


    <!-- ============================================================
     FACULTY SECTION
============================================================ -->
    <section id="faculty" class="section-padding bg-light-section" aria-label="Faculty">
        <div class="container">
            <div class="section-header text-center">
                <div class="section-label">Meet the Team</div>
                <h2 class="section-heading">Our <span class="gradient-text">Expert Faculty</span></h2>
                <p class="section-intro">Passionate educators with years of experience guiding students to academic success</p>
            </div>

            <div class="row g-4 mt-2 justify-content-center">

                <!-- Director -->
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="0">
                    <div class="faculty-card">
                        <div class="faculty-photo-wrap">
                            <img src="img/director.png" alt="Md Shahjahan Ansari" class="faculty-photo" />
                        </div>
                        <div class="faculty-info">
                            <h5>Md Shahjahan Ansari</h5>
                            <span class="faculty-subject">Founder &amp; Hindi Teacher</span>
                            <div class="faculty-exp"><i class="fas fa-award" aria-hidden="true"></i> 40+ Years Experience</div>
                            <p class="faculty-bio">Founder of The Laminars with 40+ years of teaching mastery. M.A. in Hindi &amp; Political Science. A visionary educator committed to transforming students into confident leaders.</p>
                        </div>
                        <div class="faculty-social">
                            <a href="mailto:info@thelaminars.com" aria-label="Email"><i class="fas fa-envelope"></i></a>
                        </div>
                    </div>
                </div>

                <!-- Science Faculty -->
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="faculty-card">
                        <div class="faculty-photo-wrap">
                            <img src="img/science-faculty.jpeg" alt="Tamkeenat Naaz Akhtar" class="faculty-photo" />
                        </div>
                        <div class="faculty-info">
                            <h5>Tamkeenat Naaz Akhtar</h5>
                            <span class="faculty-subject">Science &amp; Mathematics</span>
                            <div class="faculty-exp"><i class="fas fa-award" aria-hidden="true"></i> 10+ Years Experience</div>
                            <p class="faculty-bio">B.Sc. in Mathematics, Ex-Byju's. Specialises in Science and Maths with a concept-driven approach that makes complex topics accessible and engaging for students.</p>
                        </div>
                        <div class="faculty-social">
                            <a href="mailto:info@thelaminars.com" aria-label="Email"><i class="fas fa-envelope"></i></a>
                        </div>
                    </div>
                </div>

                <!-- Tech Trainer -->
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                    <div class="faculty-card">
                        <div class="faculty-photo-wrap">
                            <img src="img/tech-trainer.jpeg" alt="Sharik M." class="faculty-photo" />
                        </div>
                        <div class="faculty-info">
                            <h5>Sharik M.</h5>
                            <span class="faculty-subject">Python, Java &amp; Technology</span>
                            <div class="faculty-exp"><i class="fas fa-award" aria-hidden="true"></i> 11+ Years Experience</div>
                            <p class="faculty-bio">Software Engineer &amp; Trainer with 11+ years in the tech industry. Leads all coding programs from beginner Python to advanced Java and career-ready technical training.</p>
                        </div>
                        <div class="faculty-social">
                            <a href="mailto:info@thelaminars.com" aria-label="Email"><i class="fas fa-envelope"></i></a>
                        </div>
                    </div>
                </div>

                <!-- Phy-Chem -->
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="0">
                    <div class="faculty-card">
                        <div class="faculty-photo-wrap">
                            <img src="img/phy-chem-sir.jpeg" alt="Tanzeem Aziz" class="faculty-photo" />
                        </div>
                        <div class="faculty-info">
                            <h5>Tanzeem Aziz</h5>
                            <span class="faculty-subject">Physics &amp; Chemistry</span>
                            <div class="faculty-exp"><i class="fas fa-award" aria-hidden="true"></i> Expert Faculty</div>
                            <p class="faculty-bio">B.Tech CSE from Jadavpur University. Teaches Physics and Chemistry with a strong analytical approach, helping senior students excel in board exams and competitive preparation.</p>
                        </div>
                        <div class="faculty-social">
                            <a href="mailto:info@thelaminars.com" aria-label="Email"><i class="fas fa-envelope"></i></a>
                        </div>
                    </div>
                </div>

                <!-- English Teacher -->
                <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                    <div class="faculty-card">
                        <div class="faculty-avatar blue"><span>AV</span></div>
                        <div class="faculty-info">
                            <h5>Mrs. A. Verma</h5>
                            <span class="faculty-subject">English Language &amp; Literature</span>
                            <div class="faculty-exp"><i class="fas fa-award" aria-hidden="true"></i> 12+ Years Experience</div>
                            <p class="faculty-bio">M.A. in English from Calcutta University. Specialises in academic English coaching, spoken communication, and board exam preparation for Classes 9-12.</p>
                        </div>
                        <div class="faculty-social">
                            <a href="mailto:info@thelaminars.com" aria-label="Email"><i class="fas fa-envelope"></i></a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>


    <!-- ============================================================
     TESTIMONIALS
============================================================ -->
    <section id="testimonials" class="section-padding" aria-label="Testimonials">
        <div class="container">
            <div class="section-header text-center">
                <div class="section-label">Success Stories</div>
                <h2 class="section-heading">What Our <span class="gradient-text">Students Say</span></h2>
                <p class="section-intro">Real experiences from students who transformed their academic journey with The Laminars</p>
            </div>

            <div id="testimonialCarousel" class="carousel slide mt-5" data-bs-ride="carousel" data-bs-interval="4500">

                <div class="carousel-indicators t-indicators">
                    <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Testimonial 1"></button>
                    <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="1" aria-label="Testimonial 2"></button>
                    <button type="button" data-bs-target="#testimonialCarousel" data-bs-slide-to="2" aria-label="Testimonial 3"></button>
                </div>

                <div class="carousel-inner">

                    <div class="carousel-item active">
                        <div class="row justify-content-center">
                            <div class="col-lg-7 col-md-9 col-12">
                                <div class="t-card">
                                    <div class="t-quote-icon" aria-hidden="true"><i class="fas fa-quote-left"></i></div>
                                    <p class="t-text">The Science and Math concepts that used to terrify me are now my strongest subjects. The teachers at The Laminars break down complex topics so easily. The personalized attention made all the difference.</p>
                                    <div class="t-stars" aria-label="5 out of 5 stars">
                                        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                                    </div>
                                    <div class="t-author">
                                        <div class="t-avatar blue"><span>R</span></div>
                                        <div><strong>Rohan S.</strong><span>Class 10 Student</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="carousel-item">
                        <div class="row justify-content-center">
                            <div class="col-lg-7 col-md-9 col-12">
                                <div class="t-card">
                                    <div class="t-quote-icon" aria-hidden="true"><i class="fas fa-quote-left"></i></div>
                                    <p class="t-text">I opted for their online classes, and the experience has been seamless. The interactive tools and the patience of the instructors have helped me excel in English and technical subjects beyond my expectations.</p>
                                    <div class="t-stars" aria-label="5 out of 5 stars">
                                        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                                    </div>
                                    <div class="t-author">
                                        <div class="t-avatar teal"><span>A</span></div>
                                        <div><strong>Ayesha M.</strong><span>Class 12 Student</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="carousel-item">
                        <div class="row justify-content-center">
                            <div class="col-lg-7 col-md-9 col-12">
                                <div class="t-card">
                                    <div class="t-quote-icon" aria-hidden="true"><i class="fas fa-quote-left"></i></div>
                                    <p class="t-text">Joining the Code Juniors program was the best decision for my child. The faculty made Python so fun and easy for a 10-year-old. Now she builds her own mini-projects at home!</p>
                                    <div class="t-stars" aria-label="5 out of 5 stars">
                                        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                                    </div>
                                    <div class="t-author">
                                        <div class="t-avatar purple"><span>F</span></div>
                                        <div><strong>Fatima K.</strong><span>Parent of Code Juniors Student</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div><!-- /.carousel-inner -->

                <button class="carousel-control-prev t-ctrl-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                    <i class="fas fa-chevron-left" aria-hidden="true"></i>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next t-ctrl-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                    <i class="fas fa-chevron-right" aria-hidden="true"></i>
                    <span class="visually-hidden">Next</span>
                </button>

            </div><!-- /#testimonialCarousel -->
        </div>
    </section>


    <!-- ============================================================
     CTA BANNER
============================================================ -->
    <section class="cta-banner-section" aria-label="Call to action">
        <div class="container">
            <div class="cta-banner">
                <div class="cta-banner-content">
                    <h2>Start Your Learning Journey Today</h2>
                    <p>Join hundreds of students who have transformed their academic results with The Laminars.</p>
                </div>
                <a href="#contact" class="btn btn-cta-banner">
                    <i class="fas fa-user-plus me-2"></i>Enroll Now
                </a>
            </div>
        </div>
    </section>


    <!-- ============================================================
     CONTACT SECTION
============================================================ -->
    <section id="contact" class="section-padding" aria-label="Contact">
        <div class="container">
            <div class="section-header text-center">
                <div class="section-label">Get In Touch</div>
                <h2 class="section-heading">Start Your <span class="gradient-text">Learning Journey</span></h2>
                <p class="section-intro">Reach out to us — our team is ready to guide you to the right program</p>
            </div>

            <div class="row g-5 mt-2">

                <!-- Contact info panel -->
                <div class="col-lg-5" data-aos="fade-right">
                    <div class="contact-info-panel">
                        <h4 class="ci-title">We're Here to Help</h4>
                        <p class="ci-desc">Have questions about courses, enrollment, or fees? Reach us through any of the channels below.</p>

                        <div class="ci-list">
                            <div class="ci-item">
                                <div class="ci-icon"><i class="fas fa-map-marker-alt" aria-hidden="true"></i></div>
                                <div><strong>Address</strong>
                                    <p>Ground Floor - Golden Palace, Rameshwarpur Road, Kolkata - 700024</p>
                                </div>
                            </div>
                            <div class="ci-item">
                                <div class="ci-icon"><i class="fas fa-phone-alt" aria-hidden="true"></i></div>
                                <div><strong>Phone</strong>
                                    <p>+91-8697908896</p>
                                </div>
                            </div>
                            <div class="ci-item">
                                <div class="ci-icon"><i class="fas fa-envelope" aria-hidden="true"></i></div>
                                <div><strong>Email</strong>
                                    <p>info@thelaminars.com</p>
                                </div>
                            </div>
                            <div class="ci-item">
                                <div class="ci-icon"><i class="fas fa-clock" aria-hidden="true"></i></div>
                                <div><strong>Timings</strong>
                                    <p>Mon-Sat: 9:00 AM - 8:00 PM</p>
                                </div>
                            </div>
                        </div>

                        <!-- Inspirational quote -->
                        <div class="ci-quote">
                            <i class="fas fa-quote-left" aria-hidden="true"></i>
                            <p>"Dream, dream, dream. Dreams transform into thoughts and thoughts result in action."</p>
                            <span>— Dr. A.P.J. Abdul Kalam</span>
                        </div>

                    </div>
                </div>

                <!-- Enquiry form -->
                <div class="col-lg-7" data-aos="fade-left">
                    <div class="contact-form-wrap">
                        <form id="contactForm" method="POST" action="send-enquiry.php" novalidate aria-label="Enquiry form">
                            <div class="row g-3">

                                <div class="col-md-6">
                                    <div class="field-group">
                                        <label for="name">Full Name *</label>
                                        <input type="text" id="name" name="name" class="field-input"
                                            placeholder="Your name" required autocomplete="name" />
                                        <span class="field-error" id="nameError" role="alert"></span>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="field-group">
                                        <label for="phone">Phone Number *</label>
                                        <input type="tel" id="phone" name="phone" class="field-input"
                                            placeholder="10-digit mobile number" required autocomplete="tel" />
                                        <span class="field-error" id="phoneError" role="alert"></span>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="field-group">
                                        <label for="email">Email Address</label>
                                        <input type="email" id="email" name="email" class="field-input"
                                            placeholder="you@email.com" autocomplete="email" />
                                        <span class="field-error" id="emailError" role="alert"></span>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="field-group">
                                        <label for="course">Course Interest</label>
                                        <select id="course" name="subject" class="field-input">
                                            <option value="">Select a program…</option>
                                            <optgroup label="Academics">
                                                <option value="Laminars Little Minds">Laminars Little Minds (Class 1-5)</option>
                                                <option value="Laminars Foundation Academy">Laminars Foundation Academy (Class 6-8)</option>
                                                <option value="Laminars Senior Academy">Laminars Senior Academy (Class 9-12)</option>
                                            </optgroup>
                                            <optgroup label="Languages">
                                                <option value="Hindi Academic">Hindi - Academic (Class 9-12)</option>
                                                <option value="Hindi Basics">Hindi - Basics (All Ages)</option>
                                                <option value="English Academic">English - Academic (Class 9-12)</option>
                                                <option value="English Spoken">English - Spoken (All Ages)</option>
                                                            </optgroup>
                                            <optgroup label="Technology">
                                                <option value="Laminars Code Juniors">Laminars Code Juniors (Age 10+)</option>
                                                <option value="Laminars Tech Academy">Laminars Tech Academy (Advanced)</option>
                                                <option value="Laminars Career Launchpad">Laminars Career Launchpad</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <div class="field-group">
                                        <label for="message">Your Message</label>
                                        <textarea id="message" name="message" class="field-input"
                                            rows="4" placeholder="Tell us about yourself and how we can help…"></textarea>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <button type="submit" class="btn btn-submit" id="submitBtn">
                                        <span class="btn-label">Send Enquiry</span>
                                        <i class="fas fa-paper-plane ms-2" aria-hidden="true"></i>
                                    </button>
                                </div>

                            </div>
                        </form>

                        <!-- Success overlay -->
                        <div class="form-success" id="formSuccess" role="status" aria-live="polite">
                            <div class="success-icon"><i class="fas fa-check-circle" aria-hidden="true"></i></div>
                            <h4>Enquiry Sent Successfully!</h4>
                            <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                            <button class="btn btn-reset" id="resetForm">Send Another Enquiry</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>


    <!-- ============================================================
     FOOTER
============================================================ -->
    <footer class="site-footer" aria-label="Site footer">
        <div class="container">
            <div class="row g-4">

                <!-- Brand -->
                <div class="col-lg-4 col-md-6">
                    <div class="footer-brand">
                        <div class="footer-logo">
                            <i class="fas fa-graduation-cap" aria-hidden="true"></i>
                            <span>The <strong>Laminars</strong></span>
                        </div>
                        <p class="footer-tagline">Where knowledge meets ambition — shaping tomorrow's leaders through excellence in academics, languages, and technology since 40+ years.</p>
                        <div class="footer-social">
                            <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                            <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                            <a href="https://wa.me/918697908896" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                        </div>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="col-lg-2 col-md-6 col-6">
                    <div class="footer-col">
                        <h6 class="footer-heading">Quick Links</h6>
                        <ul class="footer-links">
                            <li><a href="#home">Home</a></li>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#courses">Courses</a></li>
                            <li><a href="#faculty">Faculty</a></li>
                            <li><a href="#testimonials">Testimonials</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <!-- Programs -->
                <div class="col-lg-3 col-md-6 col-6">
                    <div class="footer-col">
                        <h6 class="footer-heading">Our Programs</h6>
                        <ul class="footer-links">
                            <li><a href="#courses">Little Minds (Class 1-5)</a></li>
                            <li><a href="#courses">Foundation Academy (Class 6-8)</a></li>
                            <li><a href="#courses">Senior Academy (Class 9-12)</a></li>

                            <li><a href="#courses">Code Juniors</a></li>
                            <li><a href="#courses">Career Launchpad</a></li>
                        </ul>
                    </div>
                </div>

                <!-- Contact Info -->
                <div class="col-lg-3 col-md-6">
                    <div class="footer-col">
                        <h6 class="footer-heading">Contact Info</h6>
                        <ul class="footer-contact">
                            <li><i class="fas fa-map-marker-alt" aria-hidden="true"></i>Ground Floor - Golden Palace, Rameshwarpur Road, Kolkata - 700024</li>
                            <li><i class="fas fa-phone-alt" aria-hidden="true"></i>+91-8697908896</li>
                            <li><i class="fas fa-envelope" aria-hidden="true"></i>info@thelaminars.com</li>
                            <li><i class="fas fa-clock" aria-hidden="true"></i>Mon-Sat: 9:00 AM - 8:00 PM</li>
                        </ul>
                    </div>
                </div>

            </div>

            <div class="footer-bottom">
                <p>&copy; 2026 The Laminars Coaching Institute. All rights reserved.</p>
                <div class="footer-bottom-links">
                    <a href="#">Privacy Policy</a>
                    <a href="sitemap.xml">Sitemap</a>
                </div>
            </div>
        </div>
    </footer>


    <!-- Back to Top -->
    <button class="back-to-top" id="backToTop" aria-label="Scroll back to top">
        <i class="fas fa-chevron-up" aria-hidden="true"></i>
    </button>


    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Site JS -->
    <script src="js/script.js"></script>

</body>

</html>