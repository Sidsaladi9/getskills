-- ============================================
-- GetSkills Seed Data
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================

-- Insert skills (author_id is null for seeded skills — they're "community" skills)
insert into public.skills (slug, title, description, long_description, category, platform, skill_code, tags, is_premium, is_featured, status, install_count, created_at, updated_at) values

('smart-commit-messages', 'Smart Commit Messages',
 'Automatically generates conventional commit messages by analyzing your staged changes. Follows Angular commit convention with scope detection.',
 E'This skill analyzes your git diff and generates semantically meaningful commit messages following the Conventional Commits specification.\n\nIt detects the type of change (feat, fix, refactor, docs, test, chore), identifies the scope from file paths, and writes a concise but descriptive commit message.\n\nPerfect for teams that enforce commit message standards or anyone who wants cleaner git history.',
 'coding', 'claude-code',
 E'---\nname: smart-commit\ndescription: Generate conventional commit messages from staged changes\n---\n\nAnalyze the staged git diff and generate a commit message following\nConventional Commits (type(scope): description).\n\nRules:\n- Detect type: feat, fix, refactor, docs, test, chore, style, perf\n- Infer scope from the most-changed directory\n- Keep subject under 72 chars\n- Add body only if changes span 3+ files\n- Never include file lists in the subject line',
 '{git,commits,automation,conventional-commits}', false, true, 'approved', 12847,
 '2026-01-15', '2026-03-28'),

('pr-review-assistant', 'PR Review Assistant',
 'Comprehensive pull request reviewer that checks for bugs, security issues, performance problems, and style consistency.',
 E'A thorough code review skill that examines pull requests across multiple dimensions:\n\n- **Security**: SQL injection, XSS, credential exposure, OWASP top 10\n- **Performance**: N+1 queries, unnecessary re-renders, memory leaks\n- **Logic**: Edge cases, race conditions, error handling gaps\n- **Style**: Naming conventions, code organization, DRY violations\n\nOutputs a structured review with severity levels and inline suggestions.',
 'coding', 'claude-code',
 E'---\nname: pr-review\ndescription: Review pull requests for bugs, security, performance, and style\n---\n\nYou are a senior engineer reviewing a pull request.\n\nCheck for:\n1. Security vulnerabilities (injection, XSS, auth bypass)\n2. Performance issues (N+1, memory leaks, blocking calls)\n3. Logic errors (edge cases, race conditions, null handling)\n4. Code quality (naming, DRY, separation of concerns)\n\nOutput format:\n## Summary\n## Critical Issues (must fix)\n## Suggestions (nice to have)\n## What looks good',
 '{code-review,pull-requests,security,quality}', false, true, 'approved', 9523,
 '2026-02-01', '2026-03-25'),

('rest-api-scaffolder', 'REST API Scaffolder',
 'Generates complete REST API endpoints with validation, error handling, tests, and OpenAPI docs from a single resource description.',
 E'Describe a resource and this skill generates a complete, production-ready REST API including:\n\n- Route handlers (CRUD + search/filter)\n- Input validation with Zod/Joi schemas\n- Error handling middleware\n- Unit and integration tests\n- OpenAPI 3.0 documentation\n\nSupports Express, Fastify, and Hono frameworks.',
 'coding', 'universal',
 E'---\nname: api-scaffold\ndescription: Generate complete REST API from resource description\n---\n\nGenerate a full REST API for the described resource.\n\nInclude:\n- CRUD endpoints (GET, POST, PUT, DELETE)\n- List endpoint with pagination, filtering, sorting\n- Zod validation schemas\n- Error handling with proper HTTP status codes\n- TypeScript types\n- Jest test file with happy + error paths\n- OpenAPI 3.0 spec fragment\n\nFramework: detect from package.json or ask user.\nUse project conventions for file structure.',
 '{api,rest,backend,scaffolding,openapi}', true, true, 'approved', 7891,
 '2026-01-20', '2026-03-20'),

('auto-documentation', 'Auto Documentation',
 'Generates comprehensive documentation from your codebase — README, API docs, architecture diagrams, and inline comments.',
 E'Point this skill at any codebase and it generates professional documentation:\n\n- **README.md**: Project overview, setup instructions, usage examples\n- **API Documentation**: Endpoint descriptions, request/response schemas\n- **Architecture Doc**: Component relationships, data flow, design decisions\n- **Inline Comments**: JSDoc/docstrings for public APIs\n\nUses your existing docs as style reference to maintain consistency.',
 'writing', 'claude-code',
 E'---\nname: auto-docs\ndescription: Generate documentation from codebase analysis\n---\n\nAnalyze the codebase and generate documentation.\n\nSteps:\n1. Read project structure and key files\n2. Identify public APIs, components, and data models\n3. Check for existing docs to match style\n4. Generate requested documentation type\n\nOutput formats: README.md, API reference, architecture overview,\nor inline JSDoc/docstrings. Match the project''s existing tone.',
 '{documentation,readme,api-docs,jsdoc}', false, false, 'approved', 11234,
 '2025-12-10', '2026-03-30'),

('test-suite-generator', 'Test Suite Generator',
 'Creates comprehensive test suites with edge cases, mocks, and fixtures. Supports Jest, Vitest, Pytest, and Go testing.',
 E'Generate production-quality test suites that actually catch bugs.\n\nThis skill reads your source code, identifies testable units, and generates tests covering:\n- Happy paths\n- Edge cases (null, empty, boundary values)\n- Error scenarios\n- Integration points\n\nAutomatically creates mocks, fixtures, and factory functions.',
 'coding', 'universal',
 E'---\nname: test-gen\ndescription: Generate comprehensive test suites for any code\n---\n\nGenerate tests for the specified code.\n\nRequirements:\n- Detect test framework from project config\n- Cover happy paths, edge cases, and error scenarios\n- Create mock factories for external dependencies\n- Use descriptive test names: "should [expected] when [condition]"\n- Group related tests with describe blocks\n- Include setup/teardown when needed\n- Aim for >90%% branch coverage',
 '{testing,jest,vitest,pytest,tdd}', false, true, 'approved', 15678,
 '2025-11-15', '2026-03-29'),

('database-migration-builder', 'Database Migration Builder',
 'Generates safe, reversible database migrations with rollback plans. Supports PostgreSQL, MySQL, SQLite via Prisma, Drizzle, or raw SQL.',
 E'Describe your schema changes in plain English and get production-safe migrations.\n\nFeatures:\n- Generates up and down migrations\n- Handles data backfill for non-nullable columns\n- Adds appropriate indexes\n- Warns about locking issues on large tables\n- Generates migration tests',
 'data', 'claude-code',
 E'---\nname: db-migrate\ndescription: Generate safe database migrations with rollback support\n---\n\nGenerate a database migration for the described schema change.\n\nAlways include:\n- Up migration (apply change)\n- Down migration (rollback)\n- Data backfill if adding NOT NULL columns\n- Index recommendations\n- Warning if table has >1M rows (locking risk)\n\nDetect ORM from project (Prisma, Drizzle, Knex, or raw SQL).\nFollow existing migration naming convention.',
 '{database,migration,postgresql,prisma,drizzle}', true, false, 'approved', 6234,
 '2026-02-15', '2026-03-22'),

('refactoring-guru', 'Refactoring Guru',
 'Identifies code smells and applies proven refactoring patterns. Explains the "why" behind each change with before/after comparisons.',
 E'An opinionated but educational refactoring companion that:\n\n1. Scans code for common smells (long methods, god classes, feature envy, etc.)\n2. Suggests specific refactoring patterns from Fowler''s catalog\n3. Applies changes incrementally with explanations\n4. Shows before/after comparisons\n5. Ensures all tests still pass after each step',
 'coding', 'universal',
 E'---\nname: refactor\ndescription: Identify code smells and apply refactoring patterns\n---\n\nAnalyze code for refactoring opportunities.\n\nLook for:\n- Long methods (>20 lines)\n- God classes / large files\n- Duplicated logic\n- Deep nesting (>3 levels)\n- Feature envy\n- Primitive obsession\n\nFor each issue:\n1. Name the code smell\n2. Explain why it matters\n3. Show the refactored version\n4. Verify tests still pass',
 '{refactoring,clean-code,patterns,code-quality}', false, false, 'approved', 8432,
 '2026-01-05', '2026-03-18'),

('ci-cd-pipeline-generator', 'CI/CD Pipeline Generator',
 'Creates production-ready CI/CD pipelines for GitHub Actions, GitLab CI, or CircleCI with caching, matrix builds, and deployment.',
 E'Generate complete CI/CD pipelines tailored to your project.\n\nAnalyzes your repo to determine:\n- Language/framework and appropriate build steps\n- Test commands and coverage thresholds\n- Linting and formatting checks\n- Docker build and push (if Dockerfile exists)\n- Deployment targets (Vercel, Netlify, AWS, GCP)\n- Caching strategies for faster builds\n- Matrix builds for multiple Node/Python versions',
 'devops', 'claude-code',
 E'---\nname: ci-pipeline\ndescription: Generate CI/CD pipelines from project analysis\n---\n\nAnalyze the repository and generate a CI/CD pipeline.\n\nSteps:\n1. Detect language, framework, package manager\n2. Identify test, lint, and build commands\n3. Check for Dockerfile, deployment configs\n4. Generate pipeline with:\n   - Install + cache dependencies\n   - Lint + type check\n   - Test with coverage\n   - Build\n   - Deploy (if target detected)\n\nPlatform: GitHub Actions (default), GitLab CI, or CircleCI.',
 '{ci-cd,github-actions,deployment,automation}', true, false, 'approved', 5678,
 '2026-02-20', '2026-03-27'),

('professional-email-crafter', 'Professional Email Crafter',
 'Writes polished professional emails — follow-ups, cold outreach, status updates, and difficult conversations — with the right tone.',
 E'Transform bullet points into polished professional emails.\n\nHandles:\n- Cold outreach with personalization hooks\n- Follow-up sequences with escalation\n- Status updates for stakeholders\n- Difficult conversations (delays, rejections, feedback)\n- Thank you and appreciation notes\n\nMatches your writing style from previous examples.',
 'business', 'universal',
 E'---\nname: email-craft\ndescription: Write polished professional emails from bullet points\n---\n\nWrite a professional email from the user''s notes.\n\nGuidelines:\n- Match the formality level to the context\n- Keep subject lines under 50 chars, specific and actionable\n- Lead with the key message or ask\n- Use short paragraphs (2-3 sentences max)\n- End with a clear next step or CTA\n- Avoid jargon unless writing to domain experts\n- Be warm but concise',
 '{email,communication,professional,outreach}', false, false, 'approved', 4567,
 '2026-03-01', '2026-03-26'),

('react-component-factory', 'React Component Factory',
 'Generates accessible, performant React components with TypeScript, Tailwind styling, Storybook stories, and tests.',
 E'Describe a UI component and get a complete, production-ready implementation:\n\n- Fully typed TypeScript component\n- Tailwind CSS styling with design tokens\n- ARIA attributes and keyboard navigation\n- Storybook stories with multiple variants\n- Unit tests with React Testing Library\n- Responsive design by default',
 'design', 'cursor',
 E'---\nname: component-factory\ndescription: Generate accessible React components with tests and stories\n---\n\nGenerate a React component with:\n1. TypeScript with proper prop types and defaults\n2. Tailwind CSS (use project''s design tokens if available)\n3. ARIA attributes and keyboard navigation\n4. forwardRef for composition\n5. Storybook story with controls\n6. RTL test covering render, interaction, accessibility\n\nFollow existing project patterns for file structure,\nnaming conventions, and export style.',
 '{react,components,typescript,accessibility,tailwind}', true, true, 'approved', 10234,
 '2025-12-20', '2026-03-31'),

('data-pipeline-builder', 'Data Pipeline Builder',
 'Creates ETL/ELT pipelines with validation, error handling, and monitoring. Supports pandas, Polars, dbt, and SQL transforms.',
 E'Build robust data pipelines from natural language descriptions.\n\nCapabilities:\n- Extract from CSV, JSON, APIs, databases\n- Transform with pandas, Polars, or SQL\n- Load to warehouses, lakes, or APIs\n- Schema validation at each stage\n- Error handling with dead letter queues\n- Logging and monitoring hooks',
 'data', 'claude-code',
 E'---\nname: data-pipeline\ndescription: Build ETL pipelines with validation and monitoring\n---\n\nBuild a data pipeline for the described use case.\n\nStructure:\n1. Extract: Define source connectors\n2. Validate: Schema checks, null handling, type coercion\n3. Transform: Business logic, aggregations, joins\n4. Load: Target destination with upsert logic\n5. Monitor: Row counts, timing, error rates\n\nUse project''s existing tools (pandas/Polars/dbt/SQL).\nInclude error handling and retry logic.',
 '{etl,data-pipeline,pandas,sql,analytics}', true, false, 'approved', 3456,
 '2026-03-05', '2026-03-30'),

('learning-path-creator', 'Learning Path Creator',
 'Generates personalized learning paths with resources, projects, and milestones for any technical topic.',
 E'Tell this skill what you want to learn and your current level, and it creates a structured learning path:\n\n- Prerequisite assessment\n- Week-by-week curriculum\n- Curated resources (docs, videos, articles)\n- Hands-on projects at each stage\n- Knowledge checkpoints\n- Estimated time commitments',
 'education', 'universal',
 E'---\nname: learning-path\ndescription: Create personalized learning paths for technical topics\n---\n\nCreate a learning path for the specified topic.\n\nStructure:\n1. Prerequisites check\n2. Learning objectives\n3. Weekly modules (4-12 weeks):\n   - Key concepts to learn\n   - Recommended resources (official docs preferred)\n   - Hands-on project\n   - Self-assessment questions\n4. Capstone project\n5. Next steps / advanced topics\n\nAdjust depth based on stated experience level.',
 '{learning,education,curriculum,self-study}', false, false, 'approved', 6789,
 '2026-01-10', '2026-03-15');

-- Insert some seed reviews (using skill IDs from above — we'll reference by slug)
-- Note: These require actual user IDs. For demo, we skip reviews in seed.
-- Reviews will be created by real users after launch.
