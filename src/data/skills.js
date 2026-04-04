export const CATEGORIES = [
  { id: 'productivity', name: 'Productivity', icon: 'Zap', color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'coding', name: 'Coding', icon: 'Code2', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'writing', name: 'Writing', icon: 'PenTool', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'data', name: 'Data & Analytics', icon: 'BarChart3', color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'design', name: 'Design', icon: 'Palette', color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'devops', name: 'DevOps', icon: 'Server', color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'business', name: 'Business', icon: 'Briefcase', color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', color: 'text-indigo-500', bg: 'bg-indigo-50' },
]

export const PLATFORMS = [
  { id: 'claude-code', name: 'Claude Code' },
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'cursor', name: 'Cursor' },
  { id: 'windsurf', name: 'Windsurf' },
  { id: 'copilot', name: 'GitHub Copilot' },
  { id: 'universal', name: 'Universal' },
]

export const SKILLS = [
  {
    id: 'commit-master',
    title: 'Smart Commit Messages',
    description: 'Automatically generates conventional commit messages by analyzing your staged changes. Follows Angular commit convention with scope detection.',
    longDescription: `This skill analyzes your git diff and generates semantically meaningful commit messages following the Conventional Commits specification.\n\nIt detects the type of change (feat, fix, refactor, docs, test, chore), identifies the scope from file paths, and writes a concise but descriptive commit message.\n\nPerfect for teams that enforce commit message standards or anyone who wants cleaner git history.`,
    category: 'coding',
    platform: 'claude-code',
    author: { name: 'Sarah Chen', avatar: 'SC', verified: true },
    installs: 12847,
    stars: 4.9,
    reviews: 342,
    tags: ['git', 'commits', 'automation', 'conventional-commits'],
    createdAt: '2026-01-15',
    updatedAt: '2026-03-28',
    isPremium: false,
    isFeatured: true,
    skillCode: `---
name: smart-commit
description: Generate conventional commit messages from staged changes
---

Analyze the staged git diff and generate a commit message following
Conventional Commits (type(scope): description).

Rules:
- Detect type: feat, fix, refactor, docs, test, chore, style, perf
- Infer scope from the most-changed directory
- Keep subject under 72 chars
- Add body only if changes span 3+ files
- Never include file lists in the subject line`,
  },
  {
    id: 'pr-reviewer',
    title: 'PR Review Assistant',
    description: 'Comprehensive pull request reviewer that checks for bugs, security issues, performance problems, and style consistency.',
    longDescription: `A thorough code review skill that examines pull requests across multiple dimensions:\n\n- **Security**: SQL injection, XSS, credential exposure, OWASP top 10\n- **Performance**: N+1 queries, unnecessary re-renders, memory leaks\n- **Logic**: Edge cases, race conditions, error handling gaps\n- **Style**: Naming conventions, code organization, DRY violations\n\nOutputs a structured review with severity levels and inline suggestions.`,
    category: 'coding',
    platform: 'claude-code',
    author: { name: 'Marcus Johnson', avatar: 'MJ', verified: true },
    installs: 9523,
    stars: 4.8,
    reviews: 278,
    tags: ['code-review', 'pull-requests', 'security', 'quality'],
    createdAt: '2026-02-01',
    updatedAt: '2026-03-25',
    isPremium: false,
    isFeatured: true,
    skillCode: `---
name: pr-review
description: Review pull requests for bugs, security, performance, and style
---

You are a senior engineer reviewing a pull request.

Check for:
1. Security vulnerabilities (injection, XSS, auth bypass)
2. Performance issues (N+1, memory leaks, blocking calls)
3. Logic errors (edge cases, race conditions, null handling)
4. Code quality (naming, DRY, separation of concerns)

Output format:
## Summary
## Critical Issues (must fix)
## Suggestions (nice to have)
## What looks good`,
  },
  {
    id: 'api-scaffolder',
    title: 'REST API Scaffolder',
    description: 'Generates complete REST API endpoints with validation, error handling, tests, and OpenAPI docs from a single resource description.',
    longDescription: `Describe a resource and this skill generates a complete, production-ready REST API including:\n\n- Route handlers (CRUD + search/filter)\n- Input validation with Zod/Joi schemas\n- Error handling middleware\n- Unit and integration tests\n- OpenAPI 3.0 documentation\n\nSupports Express, Fastify, and Hono frameworks.`,
    category: 'coding',
    platform: 'universal',
    author: { name: 'Alex Rivera', avatar: 'AR', verified: false },
    installs: 7891,
    stars: 4.7,
    reviews: 198,
    tags: ['api', 'rest', 'backend', 'scaffolding', 'openapi'],
    createdAt: '2026-01-20',
    updatedAt: '2026-03-20',
    isPremium: true,
    isFeatured: true,
    skillCode: `---
name: api-scaffold
description: Generate complete REST API from resource description
---

Generate a full REST API for the described resource.

Include:
- CRUD endpoints (GET, POST, PUT, DELETE)
- List endpoint with pagination, filtering, sorting
- Zod validation schemas
- Error handling with proper HTTP status codes
- TypeScript types
- Jest test file with happy + error paths
- OpenAPI 3.0 spec fragment

Framework: detect from package.json or ask user.
Use project conventions for file structure.`,
  },
  {
    id: 'doc-writer',
    title: 'Auto Documentation',
    description: 'Generates comprehensive documentation from your codebase — README, API docs, architecture diagrams, and inline comments.',
    longDescription: `Point this skill at any codebase and it generates professional documentation:\n\n- **README.md**: Project overview, setup instructions, usage examples\n- **API Documentation**: Endpoint descriptions, request/response schemas\n- **Architecture Doc**: Component relationships, data flow, design decisions\n- **Inline Comments**: JSDoc/docstrings for public APIs\n\nUses your existing docs as style reference to maintain consistency.`,
    category: 'writing',
    platform: 'claude-code',
    author: { name: 'Priya Patel', avatar: 'PP', verified: true },
    installs: 11234,
    stars: 4.8,
    reviews: 312,
    tags: ['documentation', 'readme', 'api-docs', 'jsdoc'],
    createdAt: '2025-12-10',
    updatedAt: '2026-03-30',
    isPremium: false,
    isFeatured: false,
    skillCode: `---
name: auto-docs
description: Generate documentation from codebase analysis
---

Analyze the codebase and generate documentation.

Steps:
1. Read project structure and key files
2. Identify public APIs, components, and data models
3. Check for existing docs to match style
4. Generate requested documentation type

Output formats: README.md, API reference, architecture overview,
or inline JSDoc/docstrings. Match the project's existing tone.`,
  },
  {
    id: 'test-generator',
    title: 'Test Suite Generator',
    description: 'Creates comprehensive test suites with edge cases, mocks, and fixtures. Supports Jest, Vitest, Pytest, and Go testing.',
    longDescription: `Generate production-quality test suites that actually catch bugs.\n\nThis skill reads your source code, identifies testable units, and generates tests covering:\n- Happy paths\n- Edge cases (null, empty, boundary values)\n- Error scenarios\n- Integration points\n\nAutomatically creates mocks, fixtures, and factory functions.`,
    category: 'coding',
    platform: 'universal',
    author: { name: 'Jordan Williams', avatar: 'JW', verified: true },
    installs: 15678,
    stars: 4.9,
    reviews: 456,
    tags: ['testing', 'jest', 'vitest', 'pytest', 'tdd'],
    createdAt: '2025-11-15',
    updatedAt: '2026-03-29',
    isPremium: false,
    isFeatured: true,
    skillCode: `---
name: test-gen
description: Generate comprehensive test suites for any code
---

Generate tests for the specified code.

Requirements:
- Detect test framework from project config
- Cover happy paths, edge cases, and error scenarios
- Create mock factories for external dependencies
- Use descriptive test names: "should [expected] when [condition]"
- Group related tests with describe blocks
- Include setup/teardown when needed
- Aim for >90% branch coverage`,
  },
  {
    id: 'db-migration',
    title: 'Database Migration Builder',
    description: 'Generates safe, reversible database migrations with rollback plans. Supports PostgreSQL, MySQL, SQLite via Prisma, Drizzle, or raw SQL.',
    longDescription: `Describe your schema changes in plain English and get production-safe migrations.\n\nFeatures:\n- Generates up and down migrations\n- Handles data backfill for non-nullable columns\n- Adds appropriate indexes\n- Warns about locking issues on large tables\n- Generates migration tests`,
    category: 'data',
    platform: 'claude-code',
    author: { name: 'Nina Kowalski', avatar: 'NK', verified: true },
    installs: 6234,
    stars: 4.7,
    reviews: 167,
    tags: ['database', 'migration', 'postgresql', 'prisma', 'drizzle'],
    createdAt: '2026-02-15',
    updatedAt: '2026-03-22',
    isPremium: true,
    isFeatured: false,
    skillCode: `---
name: db-migrate
description: Generate safe database migrations with rollback support
---

Generate a database migration for the described schema change.

Always include:
- Up migration (apply change)
- Down migration (rollback)
- Data backfill if adding NOT NULL columns
- Index recommendations
- Warning if table has >1M rows (locking risk)

Detect ORM from project (Prisma, Drizzle, Knex, or raw SQL).
Follow existing migration naming convention.`,
  },
  {
    id: 'refactor-guru',
    title: 'Refactoring Guru',
    description: 'Identifies code smells and applies proven refactoring patterns. Explains the "why" behind each change with before/after comparisons.',
    longDescription: `An opinionated but educational refactoring companion that:\n\n1. Scans code for common smells (long methods, god classes, feature envy, etc.)\n2. Suggests specific refactoring patterns from Fowler's catalog\n3. Applies changes incrementally with explanations\n4. Shows before/after comparisons\n5. Ensures all tests still pass after each step`,
    category: 'coding',
    platform: 'universal',
    author: { name: 'David Kim', avatar: 'DK', verified: false },
    installs: 8432,
    stars: 4.6,
    reviews: 234,
    tags: ['refactoring', 'clean-code', 'patterns', 'code-quality'],
    createdAt: '2026-01-05',
    updatedAt: '2026-03-18',
    isPremium: false,
    isFeatured: false,
    skillCode: `---
name: refactor
description: Identify code smells and apply refactoring patterns
---

Analyze code for refactoring opportunities.

Look for:
- Long methods (>20 lines)
- God classes / large files
- Duplicated logic
- Deep nesting (>3 levels)
- Feature envy
- Primitive obsession

For each issue:
1. Name the code smell
2. Explain why it matters
3. Show the refactored version
4. Verify tests still pass`,
  },
  {
    id: 'ci-pipeline',
    title: 'CI/CD Pipeline Generator',
    description: 'Creates production-ready CI/CD pipelines for GitHub Actions, GitLab CI, or CircleCI with caching, matrix builds, and deployment.',
    longDescription: `Generate complete CI/CD pipelines tailored to your project.\n\nAnalyzes your repo to determine:\n- Language/framework and appropriate build steps\n- Test commands and coverage thresholds\n- Linting and formatting checks\n- Docker build and push (if Dockerfile exists)\n- Deployment targets (Vercel, Netlify, AWS, GCP)\n- Caching strategies for faster builds\n- Matrix builds for multiple Node/Python versions`,
    category: 'devops',
    platform: 'claude-code',
    author: { name: 'Chris Anderson', avatar: 'CA', verified: true },
    installs: 5678,
    stars: 4.8,
    reviews: 145,
    tags: ['ci-cd', 'github-actions', 'deployment', 'automation'],
    createdAt: '2026-02-20',
    updatedAt: '2026-03-27',
    isPremium: true,
    isFeatured: false,
    skillCode: `---
name: ci-pipeline
description: Generate CI/CD pipelines from project analysis
---

Analyze the repository and generate a CI/CD pipeline.

Steps:
1. Detect language, framework, package manager
2. Identify test, lint, and build commands
3. Check for Dockerfile, deployment configs
4. Generate pipeline with:
   - Install + cache dependencies
   - Lint + type check
   - Test with coverage
   - Build
   - Deploy (if target detected)

Platform: GitHub Actions (default), GitLab CI, or CircleCI.`,
  },
  {
    id: 'email-crafter',
    title: 'Professional Email Crafter',
    description: 'Writes polished professional emails — follow-ups, cold outreach, status updates, and difficult conversations — with the right tone.',
    longDescription: `Transform bullet points into polished professional emails.\n\nHandles:\n- Cold outreach with personalization hooks\n- Follow-up sequences with escalation\n- Status updates for stakeholders\n- Difficult conversations (delays, rejections, feedback)\n- Thank you and appreciation notes\n\nMatches your writing style from previous examples.`,
    category: 'business',
    platform: 'universal',
    author: { name: 'Emily Torres', avatar: 'ET', verified: false },
    installs: 4567,
    stars: 4.5,
    reviews: 123,
    tags: ['email', 'communication', 'professional', 'outreach'],
    createdAt: '2026-03-01',
    updatedAt: '2026-03-26',
    isPremium: false,
    isFeatured: false,
    skillCode: `---
name: email-craft
description: Write polished professional emails from bullet points
---

Write a professional email from the user's notes.

Guidelines:
- Match the formality level to the context
- Keep subject lines under 50 chars, specific and actionable
- Lead with the key message or ask
- Use short paragraphs (2-3 sentences max)
- End with a clear next step or CTA
- Avoid jargon unless writing to domain experts
- Be warm but concise`,
  },
  {
    id: 'component-gen',
    title: 'React Component Factory',
    description: 'Generates accessible, performant React components with TypeScript, Tailwind styling, Storybook stories, and tests.',
    longDescription: `Describe a UI component and get a complete, production-ready implementation:\n\n- Fully typed TypeScript component\n- Tailwind CSS styling with design tokens\n- ARIA attributes and keyboard navigation\n- Storybook stories with multiple variants\n- Unit tests with React Testing Library\n- Responsive design by default`,
    category: 'design',
    platform: 'cursor',
    author: { name: 'Lisa Nakamura', avatar: 'LN', verified: true },
    installs: 10234,
    stars: 4.8,
    reviews: 287,
    tags: ['react', 'components', 'typescript', 'accessibility', 'tailwind'],
    createdAt: '2025-12-20',
    updatedAt: '2026-03-31',
    isPremium: true,
    isFeatured: true,
    skillCode: `---
name: component-factory
description: Generate accessible React components with tests and stories
---

Generate a React component with:
1. TypeScript with proper prop types and defaults
2. Tailwind CSS (use project's design tokens if available)
3. ARIA attributes and keyboard navigation
4. forwardRef for composition
5. Storybook story with controls
6. RTL test covering render, interaction, accessibility

Follow existing project patterns for file structure,
naming conventions, and export style.`,
  },
  {
    id: 'data-pipeline',
    title: 'Data Pipeline Builder',
    description: 'Creates ETL/ELT pipelines with validation, error handling, and monitoring. Supports pandas, Polars, dbt, and SQL transforms.',
    longDescription: `Build robust data pipelines from natural language descriptions.\n\nCapabilities:\n- Extract from CSV, JSON, APIs, databases\n- Transform with pandas, Polars, or SQL\n- Load to warehouses, lakes, or APIs\n- Schema validation at each stage\n- Error handling with dead letter queues\n- Logging and monitoring hooks`,
    category: 'data',
    platform: 'claude-code',
    author: { name: 'Raj Mehta', avatar: 'RM', verified: true },
    installs: 3456,
    stars: 4.6,
    reviews: 89,
    tags: ['etl', 'data-pipeline', 'pandas', 'sql', 'analytics'],
    createdAt: '2026-03-05',
    updatedAt: '2026-03-30',
    isPremium: true,
    isFeatured: false,
    skillCode: `---
name: data-pipeline
description: Build ETL pipelines with validation and monitoring
---

Build a data pipeline for the described use case.

Structure:
1. Extract: Define source connectors
2. Validate: Schema checks, null handling, type coercion
3. Transform: Business logic, aggregations, joins
4. Load: Target destination with upsert logic
5. Monitor: Row counts, timing, error rates

Use project's existing tools (pandas/Polars/dbt/SQL).
Include error handling and retry logic.`,
  },
  {
    id: 'learning-path',
    title: 'Learning Path Creator',
    description: 'Generates personalized learning paths with resources, projects, and milestones for any technical topic.',
    longDescription: `Tell this skill what you want to learn and your current level, and it creates a structured learning path:\n\n- Prerequisite assessment\n- Week-by-week curriculum\n- Curated resources (docs, videos, articles)\n- Hands-on projects at each stage\n- Knowledge checkpoints\n- Estimated time commitments`,
    category: 'education',
    platform: 'universal',
    author: { name: 'Tom Baker', avatar: 'TB', verified: false },
    installs: 6789,
    stars: 4.7,
    reviews: 201,
    tags: ['learning', 'education', 'curriculum', 'self-study'],
    createdAt: '2026-01-10',
    updatedAt: '2026-03-15',
    isPremium: false,
    isFeatured: false,
    skillCode: `---
name: learning-path
description: Create personalized learning paths for technical topics
---

Create a learning path for the specified topic.

Structure:
1. Prerequisites check
2. Learning objectives
3. Weekly modules (4-12 weeks):
   - Key concepts to learn
   - Recommended resources (official docs preferred)
   - Hands-on project
   - Self-assessment questions
4. Capstone project
5. Next steps / advanced topics

Adjust depth based on stated experience level.`,
  },
]

export const SKILL_OF_THE_DAY = SKILLS.find(s => s.id === 'test-generator')

export function getSkillsByCategory(categoryId) {
  return SKILLS.filter(s => s.category === categoryId)
}

export function getFeaturedSkills() {
  return SKILLS.filter(s => s.isFeatured)
}

export function getPremiumSkills() {
  return SKILLS.filter(s => s.isPremium)
}

export function searchSkills(query, filters = {}) {
  let results = [...SKILLS]

  if (query) {
    const q = query.toLowerCase()
    results = results.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some(t => t.includes(q))
    )
  }

  if (filters.category) {
    results = results.filter(s => s.category === filters.category)
  }

  if (filters.platform) {
    results = results.filter(s => s.platform === filters.platform)
  }

  if (filters.sort === 'popular') {
    results.sort((a, b) => b.installs - a.installs)
  } else if (filters.sort === 'rating') {
    results.sort((a, b) => b.stars - a.stars)
  } else if (filters.sort === 'newest') {
    results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  return results
}
