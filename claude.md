# Claude Instructions for LastNext24

## Project Context
LastNext24 is a hierarchical reporting platform MVP that allows teams to provide daily updates that aggregate up through organizational hierarchies.

## Required Reading
**IMPORTANT**: Before starting any task, always read all files in `/docs/` for complete context. This ensures you understand the full project scope and requirements.

Current documentation includes:
- `/docs/backend.md` - Backend architecture and requirements
- `/docs/todo.md` - Detailed development task list and progress tracking

## Development Guidelines
- This is an MVP, not an enterprise product - keep solutions simple
- Use static demo data rather than complex dynamic systems
- Focus on core functionality over scalability features
- Prioritize working demo over production-ready code
- **Task Completion Protocol**: After completing any task from `todo.md`, always update both `todo.md` (mark task as completed) and `CLAUDE.md` (update progress status) to maintain accurate project tracking

## Repository & Deployment
**GitHub Repository**: https://github.com/WGalyean50/lastnext24  
**Status**: Repository created and initial commit pushed

### Deployment Configuration
**Status**: Configured for Vercel hosting
- `vercel.json` - Main deployment configuration with Vite framework settings and serverless functions
- `.vercelignore` - Deployment exclusions (dev files, docs, logs)
- `.env.example` - Environment variable template for OpenAI API key configuration

### Development Progress
**Phase 1.1 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 1.1.1 Initialize React + TypeScript project with Vite (React 19.1.1, TypeScript ~5.8.3, Vite 7.1.2)
- ✅ 1.1.2 Set up ESLint, Prettier, and TypeScript config (All configs in place, scripts added)
- ✅ 1.1.3 Configure Vercel deployment settings
- ✅ 1.1.4 Create initial GitHub repository and push

**Phase 1.2 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 1.2.1 Install React Router for navigation (React Router DOM v7.8.2 + TypeScript types)
- ✅ 1.2.2 Install UI dependencies (styled-components v6.1.19 + TypeScript types)
- ✅ 1.2.3 Install audio recording dependencies (audio-recorder-polyfill v0.4.1)
- ✅ 1.2.4 Set up environment variables for OpenAI API keys (.env.example template created)

**Phase 1.3 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 1.3.1 Create folder structure (components/, hooks/, services/, types/, data/ created)
- ✅ 1.3.2 Set up TypeScript interfaces (Complete type definitions in types/index.ts)
- ✅ 1.3.3 Create constants file (Organization data with 39 users, projects, utility functions)
- ✅ 1.3.4 Set up basic routing structure (HomePage, RoleSelectPage, DashboardPage with React Router)

**Phase 2.1 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 2.1.1 Create 39-person organizational hierarchy data (TypeScript constants)
- ✅ 2.1.2 Generate realistic user profiles with names, roles, manager relationships  
- ✅ 2.1.3 Create sample projects data (3 per team - 24 total projects)
- ✅ 2.1.4 Generate pre-populated demo reports for demonstration (19 reports across all levels)

**Phase 2.2 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 2.2.1 Create homepage component with "LastNext24" branding
- ✅ 2.2.2 Add "Rapid Reporting Made Easy" tagline
- ✅ 2.2.3 Implement "Enter Demo Version" button with blue styling
- ✅ 2.2.4 Set up routing from homepage to role selection

**Phase 2.3 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 2.3.1 Create role selector dropdown component (role selection page with cards)
- ✅ 2.3.2 Implement role options: Engineer, Manager, Director, VP, CTO (all 5 roles implemented)
- ✅ 2.3.3 Add role persistence using sessionStorage (working persistence and retrieval)
- ✅ 2.3.4 Create role-based routing and permissions logic (automatic redirects, role-based content)

**Phase 3.1 Status**: ✅ COMPLETED - All 5 tasks finished
- ✅ 3.1.1 Create modal component with proper accessibility (ESC key, focus trap, ARIA labels)
- ✅ 3.1.2 Add optional title field for reports (100 char limit, optional)  
- ✅ 3.1.3 Implement date/time selector (defaults to today, required field)
- ✅ 3.1.4 Create text input area with placeholder prompt (textarea with helpful placeholder)
- ✅ 3.1.5 Add modal open/close functionality (integrated with Dashboard "New Report" button)

**Current Status**: Phase 3.1 Report Creation Modal COMPLETED - Ready for Phase 3.2 Voice Recording Implementation  
**Next steps**: Begin Phase 3.2 - MediaRecorder API, record/stop button, microphone permissions, audio blob storage