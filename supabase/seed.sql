-- =============================================================
-- GETSKILLS — Seed Data
-- Run AFTER schema.sql in the Supabase SQL Editor
-- Seeds the 12 mock skills from src/data/skills.js
-- =============================================================

-- Insert all 12 approved skills (no author_id — community submitted)
insert into public.skills (
  slug, title, description, long_description,
  category, platform, skill_code, tags,
  status, is_premium, is_featured, install_count, copy_count, download_count
) values

-- 1. Smart Commit Messages
(
  'commit-master',
  'Smart Commit Messages',
  'Automatically generates conventional commit messages by analyzing your staged changes. Follows Angular commit convention with scope detection.',
  'This skill analyzes your git diff and generates semantically meaningful commit messages following the Conventional Commits specification.

It detects the type of change (feat, fix, refactor, docs, test, chore), identifies the scope from file paths, and writes a concise but descriptive commit message.

Perfect for teams that enforce commit message standards or anyone who wants cleaner git history.',
  'coding', 'claude-code',
  E'---\nname: smart-commit\ndescription: Generate conventional commit messages from staged changes\n---\n\nAnalyze the staged git diff and generate a commit message following\nConventional Commits (type(scope): description).\n\nRules:\n- Detect type: feat, fix, refactor, docs, test, chore, style, perf\n- Infer scope from the most-changed directory\n- Keep subject under 72 chars\n- Add body only if changes span 3+ files\n- Never include file lists in the subject line',
  array['git','commits','automation','conventional-commits'],
  'approved', false, true, 12847, 8200, 4647
),

-- 2. PR Review Assistant
(
  'pr-reviewer',
  'PR Review Assistant',
  'Comprehensive pull request reviewer that checks for bugs, security issues, performance problems, and style consistency.',
  'A thorough code review skill that examines pull requests across multiple dimensions:

- **Security**: SQL injection, XSS, credential exposure, OWASP top 10
- **Performance**: N+1 queries, unnecessary re-renders, memory leaks
- **Logic**: Edge cases, race conditions, error handling gaps
- **Style**: Naming conventions, code organization, DRY violations

Outputs a structured review with severity levels and inline suggestions.',
  'coding', 'claude-code',
  E'---\nname: pr-review\ndescription: Review pull requests for bugs, security, performance, and style\n---\n\nYou are a senior engineer reviewing a pull request.\n\nCheck for:\n1. Security vulnerabilities (injection, XSS, auth bypass)\n2. Performance issues (N+1, memory leaks, blocking calls)\n3. Logic errors (edge cases, race conditions, null handling)\n4. Code quality (naming, DRY, separation of concerns)\n\nOutput format:\n## Summary\n## Critical Issues (must fix)\n## Suggestions (nice to have)\n## What looks good',
  array['code-review','pull-requests','security','quality'],
  'approved', false, true, 9523, 6100, 3423
),

-- 3. REST API Scaffolder
(
  'api-scaffolder',
  'REST API Scaffolder',
  'Generates complete REST API endpoints with validation, error handling, tests, and OpenAPI docs from a single resource description.',
  'Describe a resource and this skill generates a complete, production-ready REST API including:

- Route handlers (CRUD + search/filter)
- Input validation with Zod/Joi schemas
- Error handling middleware
- Unit and integration tests
- OpenAPI 3.0 documentation

Supports Express, Fastify, and Hono frameworks.',
  'coding', 'universal',
  E'---\nname: api-scaffold\ndescription: Generate complete REST API from resource description\n---\n\nGenerate a full REST API for the described resource.\n\nInclude:\n- CRUD endpoints (GET, POST, PUT, DELETE)\n- List endpoint with pagination, filtering, sorting\n- Zod validation schemas\n- Error handling with proper HTTP status codes\n- TypeScript types\n- Jest test file with happy + error paths\n- OpenAPI 3.0 spec fragment\n\nFramework: detect from package.json or ask user.\nUse project conventions for file structure.',
  array['api','rest','backend','scaffolding','openapi'],
  'approved', true, true, 7891, 5100, 2791
),

-- 4. Auto Documentation
(
  'doc-writer',
  'Auto Documentation',
  'Generates comprehensive documentation from your codebase — README, API docs, architecture diagrams, and inline comments.',
  'Point this skill at any codebase and it generates professional documentation:

- **README.md**: Project overview, setup instructions, usage examples
- **API Documentation**: Endpoint descriptions, request/response schemas
- **Architecture Doc**: Component relationships, data flow, design decisions
- **Inline Comments**: JSDoc/docstrings for public APIs

Uses your existing docs as style reference to maintain consistency.',
  'writing', 'claude-code',
  E'---\nname: auto-docs\ndescription: Generate documentation from codebase analysis\n---\n\nAnalyze the codebase and generate documentation.\n\nSteps:\n1. Read project structure and key files\n2. Identify public APIs, components, and data models\n3. Check for existing docs to match style\n4. Generate requested documentation type\n\nOutput formats: README.md, API reference, architecture overview,\nor inline JSDoc/docstrings. Match the project existing tone.',
  array['documentation','readme','api-docs','jsdoc'],
  'approved', false, false, 11234, 7200, 4034
),

-- 5. Test Suite Generator
(
  'test-generator',
  'Test Suite Generator',
  'Creates comprehensive test suites with edge cases, mocks, and fixtures. Supports Jest, Vitest, Pytest, and Go testing.',
  'Generate production-quality test suites that actually catch bugs.

This skill reads your source code, identifies testable units, and generates tests covering:
- Happy paths
- Edge cases (null, empty, boundary values)
- Error scenarios
- Integration points

Automatically creates mocks, fixtures, and factory functions.',
  'coding', 'universal',
  E'---\nname: test-gen\ndescription: Generate comprehensive test suites for any code\n---\n\nGenerate tests for the specified code.\n\nRequirements:\n- Detect test framework from project config\n- Cover happy paths, edge cases, and error scenarios\n- Create mock factories for external dependencies\n- Use descriptive test names: "should [expected] when [condition]"\n- Group related tests with describe blocks\n- Include setup/teardown when needed\n- Aim for >90% branch coverage',
  array['testing','jest','vitest','pytest','tdd'],
  'approved', false, true, 15678, 10200, 5478
),

-- 6. Database Migration Builder
(
  'db-migration',
  'Database Migration Builder',
  'Generates safe, reversible database migrations with rollback plans. Supports PostgreSQL, MySQL, SQLite via Prisma, Drizzle, or raw SQL.',
  'Describe your schema changes in plain English and get production-safe migrations.

Features:
- Generates up and down migrations
- Handles data backfill for non-nullable columns
- Adds appropriate indexes
- Warns about locking issues on large tables
- Generates migration tests',
  'data', 'claude-code',
  E'---\nname: db-migrate\ndescription: Generate safe database migrations with rollback support\n---\n\nGenerate a database migration for the described schema change.\n\nAlways include:\n- Up migration (apply change)\n- Down migration (rollback)\n- Data backfill if adding NOT NULL columns\n- Index recommendations\n- Warning if table has >1M rows (locking risk)\n\nDetect ORM from project (Prisma, Drizzle, Knex, or raw SQL).\nFollow existing migration naming convention.',
  array['database','migration','postgresql','prisma','drizzle'],
  'approved', true, false, 6234, 4100, 2134
),

-- 7. Refactoring Guru
(
  'refactor-guru',
  'Refactoring Guru',
  'Identifies code smells and applies proven refactoring patterns. Explains the "why" behind each change with before/after comparisons.',
  'An opinionated but educational refactoring companion that:

1. Scans code for common smells (long methods, god classes, feature envy, etc.)
2. Suggests specific refactoring patterns from Fowler''s catalog
3. Applies changes incrementally with explanations
4. Shows before/after comparisons
5. Ensures all tests still pass after each step',
  'coding', 'universal',
  E'---\nname: refactor\ndescription: Identify code smells and apply refactoring patterns\n---\n\nAnalyze code for refactoring opportunities.\n\nLook for:\n- Long methods (>20 lines)\n- God classes / large files\n- Duplicated logic\n- Deep nesting (>3 levels)\n- Feature envy\n- Primitive obsession\n\nFor each issue:\n1. Name the code smell\n2. Explain why it matters\n3. Show the refactored version\n4. Verify tests still pass',
  array['refactoring','clean-code','patterns','code-quality'],
  'approved', false, false, 8432, 5500, 2932
),

-- 8. CI/CD Pipeline Generator
(
  'ci-pipeline',
  'CI/CD Pipeline Generator',
  'Creates production-ready CI/CD pipelines for GitHub Actions, GitLab CI, or CircleCI with caching, matrix builds, and deployment.',
  'Generate complete CI/CD pipelines tailored to your project.

Analyzes your repo to determine:
- Language/framework and appropriate build steps
- Test commands and coverage thresholds
- Linting and formatting checks
- Docker build and push (if Dockerfile exists)
- Deployment targets (Vercel, Netlify, AWS, GCP)
- Caching strategies for faster builds
- Matrix builds for multiple Node/Python versions',
  'devops', 'claude-code',
  E'---\nname: ci-pipeline\ndescription: Generate CI/CD pipelines from project analysis\n---\n\nAnalyze the repository and generate a CI/CD pipeline.\n\nSteps:\n1. Detect language, framework, package manager\n2. Identify test, lint, and build commands\n3. Check for Dockerfile, deployment configs\n4. Generate pipeline with:\n   - Install + cache dependencies\n   - Lint + type check\n   - Test with coverage\n   - Build\n   - Deploy (if target detected)\n\nPlatform: GitHub Actions (default), GitLab CI, or CircleCI.',
  array['ci-cd','github-actions','deployment','automation'],
  'approved', true, false, 5678, 3700, 1978
),

-- 9. Professional Email Crafter
(
  'email-crafter',
  'Professional Email Crafter',
  'Writes polished professional emails — follow-ups, cold outreach, status updates, and difficult conversations — with the right tone.',
  'Transform bullet points into polished professional emails.

Handles:
- Cold outreach with personalization hooks
- Follow-up sequences with escalation
- Status updates for stakeholders
- Difficult conversations (delays, rejections, feedback)
- Thank you and appreciation notes

Matches your writing style from previous examples.',
  'business', 'universal',
  E'---\nname: email-craft\ndescription: Write polished professional emails from bullet points\n---\n\nWrite a professional email from the user notes.\n\nGuidelines:\n- Match the formality level to the context\n- Keep subject lines under 50 chars, specific and actionable\n- Lead with the key message or ask\n- Use short paragraphs (2-3 sentences max)\n- End with a clear next step or CTA\n- Avoid jargon unless writing to domain experts\n- Be warm but concise',
  array['email','communication','professional','outreach'],
  'approved', false, false, 4567, 3100, 1467
),

-- 10. React Component Factory
(
  'component-gen',
  'React Component Factory',
  'Generates accessible, performant React components with TypeScript, Tailwind styling, Storybook stories, and tests.',
  'Describe a UI component and get a complete, production-ready implementation:

- Fully typed TypeScript component
- Tailwind CSS styling with design tokens
- ARIA attributes and keyboard navigation
- Storybook stories with multiple variants
- Unit tests with React Testing Library
- Responsive design by default',
  'design', 'cursor',
  E'---\nname: component-factory\ndescription: Generate accessible React components with tests and stories\n---\n\nGenerate a React component with:\n1. TypeScript with proper prop types and defaults\n2. Tailwind CSS (use project design tokens if available)\n3. ARIA attributes and keyboard navigation\n4. forwardRef for composition\n5. Storybook story with controls\n6. RTL test covering render, interaction, accessibility\n\nFollow existing project patterns for file structure,\nnaming conventions, and export style.',
  array['react','components','typescript','accessibility','tailwind'],
  'approved', true, true, 10234, 6800, 3434
),

-- 11. Data Pipeline Builder
(
  'data-pipeline',
  'Data Pipeline Builder',
  'Creates ETL/ELT pipelines with validation, error handling, and monitoring. Supports pandas, Polars, dbt, and SQL transforms.',
  'Build robust data pipelines from natural language descriptions.

Capabilities:
- Extract from CSV, JSON, APIs, databases
- Transform with pandas, Polars, or SQL
- Load to warehouses, lakes, or APIs
- Schema validation at each stage
- Error handling with dead letter queues
- Logging and monitoring hooks',
  'data', 'claude-code',
  E'---\nname: data-pipeline\ndescription: Build ETL pipelines with validation and monitoring\n---\n\nBuild a data pipeline for the described use case.\n\nStructure:\n1. Extract: Define source connectors\n2. Validate: Schema checks, null handling, type coercion\n3. Transform: Business logic, aggregations, joins\n4. Load: Target destination with upsert logic\n5. Monitor: Row counts, timing, error rates\n\nUse project existing tools (pandas/Polars/dbt/SQL).\nInclude error handling and retry logic.',
  array['etl','data-pipeline','pandas','sql','analytics'],
  'approved', true, false, 3456, 2200, 1256
),

-- 12. Learning Path Creator
(
  'learning-path',
  'Learning Path Creator',
  'Generates personalized learning paths with resources, projects, and milestones for any technical topic.',
  'Tell this skill what you want to learn and your current level, and it creates a structured learning path:

- Prerequisite assessment
- Week-by-week curriculum
- Curated resources (docs, videos, articles)
- Hands-on projects at each stage
- Knowledge checkpoints
- Estimated time commitments',
  'education', 'universal',
  E'---\nname: learning-path\ndescription: Create personalized learning paths for technical topics\n---\n\nCreate a learning path for the specified topic.\n\nStructure:\n1. Prerequisites check\n2. Learning objectives\n3. Weekly modules (4-12 weeks):\n   - Key concepts to learn\n   - Recommended resources (official docs preferred)\n   - Hands-on project\n   - Self-assessment questions\n4. Capstone project\n5. Next steps / advanced topics\n\nAdjust depth based on stated experience level.',
  array['learning','education','curriculum','self-study'],
  'approved', false, false, 6789, 4400, 2389
)

on conflict (slug) do update set
  title            = excluded.title,
  description      = excluded.description,
  long_description = excluded.long_description,
  skill_code       = excluded.skill_code,
  tags             = excluded.tags,
  install_count    = excluded.install_count,
  copy_count       = excluded.copy_count,
  download_count   = excluded.download_count,
  updated_at       = now();


-- Seed some daily stats for the sparklines (last 14 days for commit-master)
insert into public.daily_skill_stats (skill_id, date, copies, downloads, views)
select
  s.id,
  (current_date - (g * interval '1 day'))::date,
  floor(random() * 80 + 20)::integer,
  floor(random() * 40 + 10)::integer,
  floor(random() * 200 + 50)::integer
from public.skills s,
     generate_series(0, 13) as g
where s.slug = 'commit-master'
on conflict (skill_id, date) do nothing;

-- Seed platform stats for the last 30 days
insert into public.platform_stats (date, total_skills, total_installs, total_users, new_skills, new_users)
select
  (current_date - (g * interval '1 day'))::date,
  12,
  92000 + (g * 400),
  800 + (g * 15),
  0,
  floor(random() * 5 + 1)::integer
from generate_series(0, 29) as g
on conflict (date) do nothing;
