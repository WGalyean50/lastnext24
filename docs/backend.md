# LastNext24 MVP Backend Architecture

## Overview
LastNext24 is a demo-focused hierarchical reporting platform. This is an MVP with static demo data and basic functionality.

## Simplified MVP Requirements

### 1. Static Demo Data Structure

**Users Data** (Hardcoded in frontend)
- `id`, `name`, `role`, `manager_id`
- Pre-populated with 37 users in hierarchy
- Stored as JSON/TypeScript constants

**Reports Data** (Local browser storage)
- `id`, `user_id`, `date`, `content`, `summary`
- Browser localStorage/sessionStorage for demo persistence
- Pre-generated sample reports included

**Demo Projects Data** (Static)
- `id`, `name`, `team_id`
- Static fictional projects hardcoded in frontend

### 2. Core Functionality

**Demo Mode Only**
- Frontend role selector (no real auth)
- Local session storage

**Basic Report Operations**
- Create/edit text reports
- Simple audio recording + OpenAI Whisper
- GPT-4o summarization (one API call)

**Simple Hierarchy Display**
- Static org tree from hardcoded data
- Basic aggregation (concatenate + summarize)
- Chat queries (search reports + GPT-4o)

### 3. Minimal API Endpoints

**Essential Only** (Serverless functions)
- `POST /api/transcribe` - Audio to text (Whisper)
- `POST /api/summarize` - Text to summary (GPT-4o)
- `POST /api/chat` - Ask questions about reports
- `GET /api/demo-data` - Get pre-generated demo content (optional - can be hardcoded)

**No Database APIs Needed**
- User data: Static constants in frontend
- Reports: Browser localStorage only
- All data operations handled client-side

### 4. Simple Integrations

**OpenAI APIs**
- Whisper: Audio → text (direct API calls)
- GPT-4o: Text → summary (simple prompts)
- Basic error handling with user-friendly messages

**Local Storage Only**
- Browser localStorage for demo report persistence
- No external database required
- Audio files processed temporarily (not stored)

### 5. MVP Demo Setup

**Hardcoded Organization**
```
CTO (1) → VP (2) → Director (4) → Manager (8) → Engineer (24)
```

**Pre-generated Content**
- Static user list with names/roles
- Sample reports for each person
- 3-4 fictional projects per team
- Realistic daily update content

**No Background Jobs**
- All processing happens on-demand
- No scheduling or automation
- Manual "Generate Report" buttons trigger aggregation

## Simple Tech Stack

- **Frontend**: React + TypeScript (main application)
- **Backend**: Vercel serverless functions (Node.js/TypeScript)
- **Data Storage**: Browser localStorage + hardcoded constants
- **AI**: OpenAI Whisper + GPT-4o (direct API calls)
- **Hosting**: Vercel (frontend + serverless functions)
- **No**: Database, Redis, queues, complex auth, real-time features

## MVP Build Order

1. **Static demo data**: Hardcode users + sample reports
2. **Basic UI**: Role selector + report form
3. **OpenAI integration**: Audio transcription + text summarization  
4. **Simple aggregation**: Combine reports for managers
5. **Chat feature**: Search + ask questions about reports

**Total estimate**: 2-3 weeks for fully functional demo