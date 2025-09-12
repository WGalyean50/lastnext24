# LastNext24 - Product Requirements Document

## Product Overview

**Product Name**: LastNext24  
**Version**: MVP (Minimum Viable Product)  
**Product Type**: Hierarchical Reporting Platform (Demo)  
**Target Audience**: Organizations with hierarchical management structures  

### Vision Statement
LastNext24 aims to streamline organizational reporting by providing an intuitive platform where employees can quickly submit daily updates through voice or text, while managers receive intelligent aggregations and insights across their reporting hierarchy.

### Product Tagline
"Rapid Reporting Made Easy"

## Problem Statement

Organizations struggle with inefficient reporting processes where:
- Individual contributors spend excessive time writing status updates
- Managers receive fragmented information from their teams
- Leadership lacks visibility into organizational activities
- Voice-to-text capabilities are underutilized for rapid input
- Report aggregation and insights are manual and time-consuming

## Product Goals

### Primary Goals
1. **Simplify Report Creation**: Enable quick daily updates via voice transcription or text input
2. **Intelligent Aggregation**: Automatically summarize team reports for managers
3. **Hierarchical Visibility**: Provide appropriate visibility based on organizational level
4. **Rapid Insights**: Enable natural language queries about organizational activities

### Success Metrics
- Time reduction in report creation (target: 50% reduction)
- Manager satisfaction with team visibility
- Adoption rate across organizational hierarchy
- Quality of AI-generated summaries and insights

## Target Users

### Primary Personas

**1. Individual Contributors (Engineers)**
- **Role**: Individual contributors, engineers, specialists
- **Needs**: Quick, efficient way to submit daily updates
- **Pain Points**: Time-consuming written reports, repetitive content
- **Goals**: Minimize reporting overhead while maintaining transparency

**2. Middle Managers**
- **Role**: Team leads, managers, directors
- **Needs**: Visibility into team activities, efficient upward reporting
- **Pain Points**: Fragmented team information, manual aggregation
- **Goals**: Comprehensive team oversight with minimal administrative burden

**3. Senior Leadership**
- **Role**: VPs, CTOs, executives
- **Needs**: High-level organizational insights, strategic visibility
- **Pain Points**: Information delays, lack of cross-functional visibility
- **Goals**: Real-time organizational pulse, data-driven decision making

## Core Features

### 1. Voice-First Report Creation
**Description**: Primary input method through voice recording with AI transcription  
**User Story**: As an individual contributor, I want to record my daily update by speaking so that I can quickly communicate my activities without typing.

**Acceptance Criteria**:
- Voice recording interface with start/stop functionality
- Real-time transcription using OpenAI Whisper
- Editable transcription text for corrections
- Optional manual text input as alternative

### 2. Hierarchical Report Aggregation
**Description**: Automatic summarization of subordinate reports for managers  
**User Story**: As a manager, I want to see a consolidated view of my team's activities so that I can understand overall progress and identify issues.

**Acceptance Criteria**:
- Automatic aggregation of direct report submissions
- AI-powered summarization using GPT-4o
- Editable aggregated content before upward submission
- Manual "Generate Report" trigger for on-demand processing

### 3. Organizational Hierarchy Visualization
**Description**: Interactive org chart showing report status and content  
**User Story**: As a leader, I want to see the organizational structure with report visibility so that I can navigate and understand activities across teams.

**Acceptance Criteria**:
- Expandable/collapsible org tree interface
- Role-based visibility controls (downward full, lateral limited)
- Report content display within hierarchy view
- Simple text-based layout for MVP

### 4. Natural Language Chat Interface
**Description**: Q&A system for querying organizational reports  
**User Story**: As a manager, I want to ask questions about team activities in natural language so that I can quickly get insights without manual searching.

**Acceptance Criteria**:
- Text input for questions about reports
- AI-powered responses with report citations
- Basic search and retrieval functionality
- Simple conversation interface

### 5. Role-Based Demo System
**Description**: Role selection system for MVP demonstration  
**User Story**: As a demo user, I want to experience different organizational perspectives so that I can understand the platform's value across hierarchy levels.

**Acceptance Criteria**:
- Dropdown role selector (Engineer, Manager, Director, VP, CTO)
- Role-appropriate interface and data visibility
- Session-based role persistence
- Pre-populated demo data for each role

## Technical Architecture

### Frontend Technology
- **Framework**: React with TypeScript
- **Styling**: Clean, minimal design with blue and white color scheme
- **Audio**: Browser-based voice recording capabilities
- **State Management**: Local session storage for demo mode

### Backend Technology
- **Framework**: Python FastAPI
- **Database**: Supabase PostgreSQL
- **AI Services**: OpenAI (Whisper for transcription, GPT-4o for summarization)
- **Hosting**: Vercel serverless functions

### Data Model

**Users Table**
```sql
- id: Primary key
- name: Full name
- role: Position title
- manager_id: Reference to reporting manager
```

**Reports Table**
```sql
- id: Primary key
- user_id: Foreign key to users
- date: Report date
- content: Original report text
- summary: AI-generated summary
```

**Projects Table** (Demo)
```sql
- id: Primary key
- name: Project name
- team_id: Associated team
```

### API Endpoints

**Core Endpoints**:
- `GET /api/users` - Retrieve user hierarchy
- `POST /api/reports` - Create new report
- `GET /api/reports/:userId/:date` - Get user reports
- `POST /api/transcribe` - Voice to text conversion
- `POST /api/summarize` - Text summarization
- `POST /api/chat` - Natural language queries
- `GET /api/demo-data` - Pre-generated demo content

## User Experience Design

### Information Architecture
1. **Homepage**: Product introduction with demo entry
2. **Role Selection**: Choose organizational perspective
3. **Main Dashboard**: Primary interface with navigation
4. **Report Creation**: Modal-based form with voice/text input
5. **Org Visualization**: Hierarchical team view
6. **Chat Interface**: Q&A sidebar for leaders

### Key User Flows

**Individual Report Creation Flow**:
1. Select Engineer role
2. Click "New Report" button
3. Choose date/time (default: current)
4. Record voice or type text content
5. Review and edit transcription
6. Submit report

**Manager Aggregation Flow**:
1. Select Manager+ role
2. View team member reports
3. Trigger report aggregation
4. Review and edit aggregated summary
5. Submit upward or enable auto-submission
6. Ask questions via chat interface

### Visibility Rules
- **Downward Visibility**: Full access to all subordinate reports
- **Lateral Visibility**: Summary-level access to peer reports
- **Upward Visibility**: No access to superior's individual activities

## Demo Configuration

### Organizational Structure (37 total users)
```
CTO (1)
├── VP Engineering (1) 
│   ├── Director Frontend (1)
│   │   ├── Manager UI Team (1)
│   │   │   └── Engineers (3)
│   │   └── Manager UX Team (1)
│   │       └── Engineers (3)
│   └── Director Backend (1)
│       ├── Manager API Team (1)
│       │   └── Engineers (3)
│       └── Manager Platform Team (1)
│           └── Engineers (3)
└── VP Product (1)
    ├── Director Product Management (1)
    │   ├── Manager Consumer Products (1)
    │   │   └── Engineers (3)
    │   └── Manager Enterprise Products (1)
    │       └── Engineers (3)
    └── Director Design (1)
        ├── Manager Design Systems (1)
        │   └── Engineers (3)
        └── Manager Research (1)
            └── Engineers (3)
```

### Demo Content
- **Static user profiles** with realistic names and roles
- **Pre-generated reports** for demonstration purposes
- **Sample projects** (3-4 per team) with realistic context
- **Historical data** covering recent time periods

## Success Criteria

### MVP Success Metrics
1. **Functional Demonstration**: All core features working in demo environment
2. **User Experience**: Intuitive navigation across all role types
3. **AI Quality**: Accurate transcription and meaningful summarization
4. **Performance**: Responsive interface with <2 second load times
5. **Stakeholder Feedback**: Positive reception from demo audiences

### Post-MVP Considerations
- Real authentication and user management
- Advanced scheduling and automation
- Slack integration for notifications
- Advanced analytics and reporting
- Mobile application development

## Development Timeline

### Phase 1: Foundation (Week 1)
- Static demo data creation
- Basic React interface setup
- Role selection implementation

### Phase 2: Core Features (Week 2)
- Voice recording and transcription
- Report creation and storage
- Basic organizational hierarchy display

### Phase 3: Intelligence (Week 3)
- AI summarization integration
- Chat interface implementation
- Final demo polish and testing

## Risk Assessment

### Technical Risks
- **AI Service Dependencies**: Reliance on OpenAI API availability
- **Audio Recording**: Browser compatibility and permission issues
- **Performance**: Serverless function limitations

### Mitigation Strategies
- Implement error handling and fallback options
- Test across multiple browsers and devices
- Optimize API calls and implement caching where appropriate

## Conclusion

LastNext24 MVP represents a focused demonstration of hierarchical reporting capabilities, emphasizing voice-first input and AI-powered insights. The product addresses real organizational pain points while maintaining simplicity suitable for rapid development and effective demonstration to stakeholders.