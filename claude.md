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

**Phase 3.2 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 3.2.1 Implement browser MediaRecorder API integration (high-quality webm/opus format)
- ✅ 3.2.2 Create record/stop button with visual feedback (animated button with pulse effect)
- ✅ 3.2.3 Add microphone permission handling and error states (comprehensive error messages)
- ✅ 3.2.4 Implement audio blob creation and temporary storage (duration tracking)

**Phase 3.3 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 3.3.1 Implement localStorage service for report persistence (complete ReportStorageService)
- ✅ 3.3.2 Create report submission handling (async submission with error handling)
- ✅ 3.3.3 Add report editing capabilities (update/delete functions in service)
- ✅ 3.3.4 Implement report history retrieval by user and date (complete reporting dashboard)

**Phase 4.1 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 4.1.1 Create /api folder structure for Vercel functions (api/, api/lib/ folders created)
- ✅ 4.1.2 Set up TypeScript configuration for serverless functions (api/tsconfig.json)
- ✅ 4.1.3 Configure OpenAI API client with proper error handling (OpenAI SDK v5.20.1, shared client)
- ✅ 4.1.4 Add environment variables for OpenAI API key (.env.example updated, Vercel ready)

**Phase 4.2 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 4.2.1 Create /api/transcribe endpoint using OpenAI Whisper (formidable multipart processing)
- ✅ 4.2.2 Handle audio file upload and processing (25MB limit, multiple formats supported)
- ✅ 4.2.3 Add error handling for transcription failures (comprehensive error responses)
- ✅ 4.2.4 Return transcribed text to frontend (structured JSON responses with duration)

**Phase 4.3 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 4.3.1 Create /api/summarize endpoint using GPT-4o (individual/aggregate/executive modes)
- ✅ 4.3.2 Implement report summarization prompts (context-aware, role-specific prompts)
- ✅ 4.3.3 Handle batch summarization for multiple reports (efficient processing)
- ✅ 4.3.4 Add response formatting and error handling (token counts, processing time)

**Phase 4.4 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 4.4.1 Integrate transcription API with voice recording (TranscriptionService created)
- ✅ 4.4.2 Add real-time transcription display in text area (automatic population)
- ✅ 4.4.3 Implement edit capability for transcribed text (text area editable)
- ✅ 4.4.4 Add loading states and error handling for API calls (visual feedback, error states)

**Current Status**: ✅ PHASE 4 COMPLETED - OpenAI Integration Fully Operational  
**Next steps**: Ready for Phase 5 - Organizational Hierarchy Display