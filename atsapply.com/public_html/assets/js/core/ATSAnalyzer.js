/**
 * ATSAnalyzer.js
 *
 * Scores a resume 0-100 for ATS compliance and generates
 * actionable suggestions + role-based keyword lists.
 *
 * Score breakdown (total 100):
 *   Required sections   20 pts
 *   Keyword presence    25 pts
 *   Experience quality  20 pts
 *   Skill density       15 pts
 *   Completeness        20 pts
 */

/* ── Role → Keyword map ──────────────────────────────────────── */
const ROLE_KEYWORDS = {
  'Frontend Developer': [
    'React','JavaScript','TypeScript','HTML','CSS','Webpack','Vite',
    'REST API','Jest','Playwright','CI/CD','Agile','Git','Redux','Vue','Angular',
  ],
  'Backend Developer': [
    'Node.js','Express','Python','Django','REST API','GraphQL','PostgreSQL',
    'MySQL','MongoDB','Docker','Kubernetes','AWS','CI/CD','Microservices','Redis',
  ],
  'Full Stack Developer': [
    'React','Node.js','TypeScript','REST API','MongoDB','PostgreSQL',
    'Docker','AWS','CI/CD','GraphQL','Git','Agile','Jest','Webpack',
  ],
  'QA Engineer': [
    'Selenium','Playwright','Cypress','Jest','TestNG','JUnit','API Testing',
    'Manual Testing','Automation','CI/CD','JIRA','Agile','SQL','Regression',
  ],
  'DevOps Engineer': [
    'Docker','Kubernetes','AWS','Azure','GCP','Terraform','CI/CD',
    'Jenkins','Ansible','Linux','Python','Bash','Monitoring','Git',
  ],
  'Data Scientist': [
    'Python','Pandas','NumPy','Scikit-learn','TensorFlow','Machine Learning',
    'SQL','Statistics','Jupyter','Data Visualization','NLP','Deep Learning',
  ],
  'Data Engineer': [
    'Python','SQL','Spark','Airflow','Kafka','AWS','ETL','Data Pipeline',
    'PostgreSQL','BigQuery','dbt','Hadoop','Redshift','Snowflake',
  ],
  'Product Manager': [
    'Roadmap','Agile','Scrum','KPIs','Stakeholder','User Research',
    'A/B Testing','JIRA','Product Strategy','Go-to-market','OKRs',
  ],
  'UI/UX Designer': [
    'Figma','User Research','Wireframing','Prototyping','Usability Testing',
    'Design System','Adobe XD','Accessibility','Interaction Design','CSS',
  ],
  'Android Developer': [
    'Kotlin','Java','Android SDK','Jetpack Compose','MVVM','Retrofit',
    'Room','Coroutines','Firebase','CI/CD','Play Store','REST API',
  ],
  'iOS Developer': [
    'Swift','Objective-C','SwiftUI','UIKit','CoreData','Xcode',
    'REST API','MVVM','TestFlight','App Store','Combine',
  ],
  'Cloud Architect': [
    'AWS','Azure','GCP','Terraform','CloudFormation','Kubernetes','Docker',
    'Microservices','Serverless','Security','Cost Optimization','Networking',
  ],
};

const DEFAULT_KEYWORDS = [
  'Communication','Problem Solving','Leadership','Teamwork','Agile',
  'Project Management','Analytical','Detail-oriented','Git','CI/CD',
];

/* ── ATS hard rules (things that hurt ATS parsing) ───────────── */
const ATS_WARNINGS = {
  noSummary:       'Add a professional summary — most ATS systems rank it highly.',
  shortSummary:    'Your summary is too short. Aim for 50-150 words.',
  noSkills:        'Add at least 5 skills. Skills sections are critical for keyword matching.',
  fewSkills:       'Add more skills (aim for 8–15) to improve keyword density.',
  noExperience:    'Work experience is the most weighted section in ATS scoring.',
  shortBullets:    'Use action-oriented bullet points (10+ words) to describe your impact.',
  noEducation:     'Education section is required by most ATS filters.',
  noEmail:         'Email address is missing from contact information.',
  noPhone:         'Phone number is missing from contact information.',
  noName:          'Full name is missing — required by all ATS systems.',
  noTargetRole:    'Enter a target role to get keyword suggestions tailored to that position.',
  missingKeywords: 'Your resume is missing important keywords for this role.',
};

/* ────────────────────────────────────────────────────────────── */

class ATSAnalyzer {

  /**
   * Analyse a resume and return a rich result object.
   * @param {object} resume  Full resume document.
   * @returns {ATSResult}
   */
  analyze(resume) {
    const result = {
      score:    0,
      grade:    '',
      criteria: [],
      suggestions: [],
      warnings:    [],
      tips:        [],
      keywords:    { present: [], missing: [], suggested: [] },
    };

    const scores = {
      sections:    this._scoreSections(resume, result),
      keywords:    this._scoreKeywords(resume, result),
      experience:  this._scoreExperience(resume, result),
      skillDensity: this._scoreSkillDensity(resume, result),
      completeness: this._scoreCompleteness(resume, result),
    };

    result.score = Math.min(100, Math.round(
      scores.sections + scores.keywords + scores.experience +
      scores.skillDensity + scores.completeness
    ));

    result.criteria = [
      { label: 'Required Sections',  max: 20, earned: Math.round(scores.sections)    },
      { label: 'Keyword Presence',   max: 25, earned: Math.round(scores.keywords)    },
      { label: 'Experience Quality', max: 20, earned: Math.round(scores.experience)  },
      { label: 'Skill Density',      max: 15, earned: Math.round(scores.skillDensity)},
      { label: 'Completeness',       max: 20, earned: Math.round(scores.completeness)},
    ];

    result.grade = this._grade(result.score);
    return result;
  }

  /* ── Section presence (20 pts) ─────────────────────────────── */
  _scoreSections(resume, result) {
    let pts = 0;
    const { personal, summary, skills, experience, education } = resume;

    if (personal?.fullName?.trim()) pts += 3; else result.warnings.push(ATS_WARNINGS.noName);
    if (summary?.trim())             pts += 4; else result.warnings.push(ATS_WARNINGS.noSummary);
    if (skills?.length >= 1)         pts += 4; else result.warnings.push(ATS_WARNINGS.noSkills);
    if (experience?.length >= 1)     pts += 5; else result.warnings.push(ATS_WARNINGS.noExperience);
    if (education?.length >= 1)      pts += 4; else result.warnings.push(ATS_WARNINGS.noEducation);

    return pts;
  }

  /* ── Keyword matching (25 pts) ─────────────────────────────── */
  _scoreKeywords(resume, result) {
    const role     = resume.targetRole?.trim() || '';
    const keywords = this._keywordsForRole(role);
    const resumeText = this._fullText(resume).toLowerCase();

    const present = keywords.filter(kw => resumeText.includes(kw.toLowerCase()));
    const missing = keywords.filter(kw => !resumeText.includes(kw.toLowerCase()));

    result.keywords.present   = present;
    result.keywords.missing   = missing;
    result.keywords.suggested = keywords;

    if (!role) {
      result.tips.push(ATS_WARNINGS.noTargetRole);
      return 8; // partial credit when no role set
    }

    if (missing.length > 5) result.suggestions.push(ATS_WARNINGS.missingKeywords);

    const ratio = present.length / keywords.length;
    return Math.round(ratio * 25);
  }

  /* ── Experience quality (20 pts) ───────────────────────────── */
  _scoreExperience(resume, result) {
    const exp = resume.experience || [];
    if (!exp.length) return 0;

    let pts = 0;
    let totalBullets = 0;
    let shortBullets = 0;

    exp.forEach(e => {
      if (e.company?.trim()) pts += 1;
      if (e.role?.trim())    pts += 1;
      if (e.startDate)       pts += 0.5;
      e.bullets.forEach(b => {
        if (b.trim()) {
          totalBullets++;
          if (b.trim().split(/\s+/).length < 8) shortBullets++;
        }
      });
    });

    // Bullet quality
    if (totalBullets > 0) {
      const qualityRatio = 1 - (shortBullets / totalBullets);
      pts += qualityRatio * 8;
    }

    if (shortBullets > 0) result.suggestions.push(ATS_WARNINGS.shortBullets);

    return Math.min(20, pts);
  }

  /* ── Skill density (15 pts) ────────────────────────────────── */
  _scoreSkillDensity(resume, result) {
    const count = (resume.skills || []).length;
    if (count === 0) return 0;
    if (count < 5) { result.suggestions.push(ATS_WARNINGS.fewSkills); return 4; }
    if (count < 8) return 9;
    if (count < 12) return 13;
    return 15;
  }

  /* ── Completeness (20 pts) ─────────────────────────────────── */
  _scoreCompleteness(resume, result) {
    let pts = 0;
    const p = resume.personal || {};

    if (p.email?.trim())     pts += 3; else result.warnings.push(ATS_WARNINGS.noEmail);
    if (p.phone?.trim())     pts += 2; else result.warnings.push(ATS_WARNINGS.noPhone);
    if (p.city?.trim())      pts += 1;
    if (p.linkedin?.trim())  pts += 2;
    if (resume.summary?.trim().split(/\s+/).length >= 30) pts += 3;
    else if (resume.summary?.trim()) { pts += 1; result.suggestions.push(ATS_WARNINGS.shortSummary); }

    if ((resume.projects || []).length >= 1)      pts += 2;
    if ((resume.certifications || []).length >= 1) pts += 2;
    if ((resume.achievements || []).length >= 1)   pts += 2;
    if ((resume.languages || []).length >= 1)      pts += 1;

    return Math.min(20, pts);
  }

  /* ── Helpers ───────────────────────────────────────────────── */

  _fullText(resume) {
    const parts = [];
    const p = resume.personal || {};
    parts.push(p.fullName, p.title, resume.summary, resume.targetRole);
    (resume.skills || []).forEach(s => parts.push(s));
    (resume.experience || []).forEach(e => {
      parts.push(e.company, e.role, e.location);
      (e.bullets || []).forEach(b => parts.push(b));
    });
    (resume.education || []).forEach(e => parts.push(e.institution, e.degree, e.field));
    (resume.projects || []).forEach(pr => parts.push(pr.name, pr.description, pr.tech));
    (resume.certifications || []).forEach(c => parts.push(c.name, c.org));
    (resume.achievements || []).forEach(a => parts.push(a));
    return parts.filter(Boolean).join(' ');
  }

  _keywordsForRole(role) {
    if (!role) return DEFAULT_KEYWORDS;
    const exact = ROLE_KEYWORDS[role];
    if (exact) return exact;
    // Fuzzy: find closest key containing role words
    const lower = role.toLowerCase();
    const match = Object.keys(ROLE_KEYWORDS).find(k => k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase().split(' ')[0]));
    return match ? ROLE_KEYWORDS[match] : DEFAULT_KEYWORDS;
  }

  _grade(score) {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  }

  /** Return the keyword list for a given target role (used by keyword chip UI). */
  suggestKeywords(role) {
    return this._keywordsForRole(role);
  }

  /** List of all supported roles for the datalist. */
  get supportedRoles() {
    return Object.keys(ROLE_KEYWORDS);
  }
}

export const atsAnalyzer = new ATSAnalyzer();
