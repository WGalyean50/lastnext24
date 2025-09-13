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

**Phase 5.1 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 5.1.1 Create hierarchical tree display component (OrganizationTree with role-based visibility)
- ✅ 5.1.2 Implement expand/collapse functionality with carets (animated visual feedback)
- ✅ 5.1.3 Add role-based visibility rules (downward full access, lateral limited views)
- ✅ 5.1.4 Display user names, roles, and report content (comprehensive user info display)

**Phase 5.2 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 5.2.1 Create main dashboard layout with sidebar (responsive 3-column layout)
- ✅ 5.2.2 Add "New Report" button (always visible, top right in header)
- ✅ 5.2.3 Implement previous reports dropdown in sidebar (recent reports with quick access)
- ✅ 5.2.4 Add time frame controls (Today, Yesterday with active state indicators)

**Phase 6.1 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 6.1.1 Create manager-specific interface for viewing team reports (ManagerView component)
- ✅ 6.1.2 Implement "Generate Report" button for aggregation (AI-powered with loading states)
- ✅ 6.1.3 Display aggregated reports with edit capabilities (full WYSIWYG editing)
- ✅ 6.1.4 Add submit functionality for upward reporting (complete workflow integration)

**Phase 6.2 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 6.2.1 Implement client-side report concatenation logic (ReportAggregationService)
- ✅ 6.2.2 Integrate with summarization API for intelligent aggregation (OpenAI GPT-4o integration)
- ✅ 6.2.3 Add manual editing capabilities for aggregated content (textarea with save/edit modes)
- ✅ 6.2.4 Handle different aggregation levels (Manager → Director → VP → CTO hierarchy support)

**Phase 7.1 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 7.1.1 Create /api/chat endpoint using GPT-4o (comprehensive API with search, context, NLP, citations)
- ✅ 7.1.2 Implement report search and context building (role-based permissions with hierarchy filtering)
- ✅ 7.1.3 Add natural language query processing (GPT-4o integration with contextual prompts)
- ✅ 7.1.4 Return responses with basic report citations (source attribution with user names and snippets)

**Phase 7.2 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 7.2.1 Create chat interface sidebar for leader views (ChatInterface component for leadership roles)
- ✅ 7.2.2 Implement question input and response display (interactive chat UI with input/output)
- ✅ 7.2.3 Add loading states and conversation history (animated loading, message persistence)
- ✅ 7.2.4 Show basic attribution for quoted information (sources display with relevance scoring)

**Phase 8.1 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 8.1.1 Implement blue and white color scheme consistently (Theme system, centralized colors)
- ✅ 8.1.2 Add loading animations and micro-interactions (LoadingSpinner, AnimatedButton, FadeIn components)
- ✅ 8.1.3 Ensure responsive design for different screen sizes (Mobile-first approach, responsive utilities)
- ✅ 8.1.4 Add proper error states and user feedback (ErrorBoundary, ErrorState, ToastNotification)

**Phase 8.2 Status**: ✅ COMPLETED - All 4 tasks finished  
- ✅ 8.2.1 Optimize bundle size and implement code splitting (Lazy loading, Vite optimization)
- ✅ 8.2.2 Add proper caching for API calls (CacheService, CachedApiService with TTL)
- ✅ 8.2.3 Implement optimistic UI updates where appropriate (useOptimisticUpdate hook)
- ✅ 8.2.4 Add error boundaries and graceful failure handling (Global ErrorBoundary wrapper)

**Phase 8.3 Status**: ✅ COMPLETED - All 4 tasks finished
- ✅ 8.3.1 Enhance demo reports with realistic, varied content (39 users, diverse project reports)
- ✅ 8.3.2 Add historical data for multiple dates (Multi-day report scenarios)
- ✅ 8.3.3 Create diverse project scenarios across teams (24 projects across 8 teams)
- ✅ 8.3.4 Add edge cases for testing (Long reports, empty states, error scenarios)

**Current Status**: ✅ **AUDIO RECORDING & TRANSCRIPTION FIXED - READY FOR PRODUCTION**
**Audio Recording**: ✅ **FULLY WORKING** - Safari MediaRecorder optimizations successful (44KB+ MP4 files)
**Transcription Issue**: ✅ **FIXED** - Applied working patterns from voice-transcription-export package

## Latest Transcription Debugging (Phase 2):
**🔧 COMPREHENSIVE STEP-BY-STEP DEBUGGING DEPLOYED**
- **Priority 1 fixes implemented** based on transcription-fix.md analysis
- **Enhanced /api/transcribe.ts**: Step-by-step error tracking (INITIALIZATION → RESPONSE_PROCESSING)
- **Detailed logging**: Each stage logged with emojis for easy identification in Vercel logs
- **Environment diagnostics**: Node version, platform, OpenAI key status validation
- **Specific error messages**: Based on exact failure step with helpful context
- **New /api/health.ts**: Function health check and environment validation endpoint
- **Comprehensive documentation**: transcription-fix.md with priority-ranked solutions

## Previous Transcription Attempts:
**Phase 1**: Applied working patterns from voice-transcription-export package
- Enhanced form parsing with improved error handling and logging
- Added support for multiple file field names (audio, file, recording)
- Improved MIME type detection and OpenAI API compatibility
- Fixed formidable configuration with explicit temp directory and encoding

## Recent Fixes Applied:
- ✅ Safari MediaRecorder compatibility (browser detection, MP4 codecs, periodic data requests)
- ✅ Styled-components keyframe animation error resolved 
- ✅ TypeScript build errors fixed (removed invalid Blob.lastModified access)
- ✅ Enhanced error handling and user feedback
- ✅ Comprehensive server-side logging for debugging

## Progress Summary:
**Phase 8**: ✅ COMPLETED - Polish & Optimization  
**Audio Recording**: ✅ **PRODUCTION READY**
**Transcription**: ⚠️ **DEBUGGING NEEDED** - Server-side form parsing issue