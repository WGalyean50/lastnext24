# LastNext24 MVP User Interface Analysis

## Overall Design Philosophy
- **Style**: Simple, clean interface (MVP-focused)
- **Color Scheme**: White and blue as primary colors
- **Technology**: React frontend
- **Target**: Demo of hierarchical reporting concept

## Key UI Components

### 1. Homepage
- **Title**: "LastNext24"
- **Tagline**: "Rapid Reporting Made Easy"
- **Primary CTA**: Blue button labeled "Enter Demo Version"
- **Flow**: Homepage → Demo selection → Main application

### 2. Role Selection System
- **Location**: Top right dropdown
- **Label**: "Choose Role"
- **Options**: Engineer, Manager, Director, VP, CTO
- **Functionality**: Determines user's view and permissions within org hierarchy

### 3. Main Navigation Layout

#### Left Sidebar (MVP Simplified)
- **Previous Reports**: Simple dropdown (no complex date ranges for MVP)
- **Basic Navigation**: Minimal options to keep MVP focused

#### Top Right Actions
- **"New Report" Button**: Blue button, always visible
- **Auto-submit**: Simple toggle (MVP can default to manual submit)

### 4. Report Creation Modal
**Components**:
- **Title Field**: Optional report title input
- **Date/Time Selector**: "Current date time" button or custom date picker with optional time
- **Content Input**: 
  - Text box with prompt: "What did you do today? What will you do tomorrow?"
  - "Transcribe" button to activate microphone
  - Real-time transcription display in text box for editing
- **Actions**: Submit button

### 5. Organizational View ("Org View") - MVP Simple
**Structure**:
- **Format**: Basic text outline (simple indentation)
- **Hierarchy Display**:
  ```
  CTO
    VP 1 ⌄
      Director 1 ⌄
        Manager 1 ⌄
          Engineer 1: "Daily report..."
          Engineer 2: "Daily report..."
  ```
- **Interactive Elements**: Simple expand/collapse (basic carets)
- **Content Display**: "Role: Name" + report text

### 6. Visibility Rules
- **Downward**: Full visibility of subordinate levels
- **Lateral**: Limited - can see peer's summary but not their org details
- **Example**: VP can see other VP's reports but not their directors' individual reports

### 7. Chat Interface (MVP Basic)
**Location**: Right side of leader views
**Functionality**:
- Simple question input
- Basic LLM responses:
  - Simple summary
  - Basic quotes (minimal attribution for MVP)

### 8. Time Frame Controls (MVP Minimal)
**Options**: Today, Yesterday (keep simple for MVP)
**Purpose**: Basic time filtering
**Location**: Adjacent to main content area

### 9. Report Aggregation Interface
**For Leaders** (Manager+):
- **Display**: Aggregated reports from direct reports
- **Actions**: 
  - Edit capability for additions/modifications
  - Submit button for upward reporting
  - "Generate Report" button for LLM summarization

## Technical Requirements

### Demo Mode Structure (MVP)
**Small Organizational Hierarchy**:
- 1 CTO
- 2 VPs (each under CTO)
- 2 Directors (each under VP) = 4 total
- 2 Managers (each under Director) = 8 total  
- 3 Engineers (each under Manager) = 24 total

**Static Content**: Simple pre-generated dummy reports (Claude-generated, not real-time)

### Integration Points (MVP)
- **OpenAI Whisper**: Voice transcription (core feature)
- **GPT-4O**: Basic report aggregation
- **Supabase**: Simple data storage (no complex persistence for MVP)
- **No Slack integration in MVP** (future feature)

## User Experience Flow

### Individual Contributor Flow
1. Select "Engineer" role
2. Click "New Report" → Modal opens
3. Provide title (optional) and date
4. Record voice or type text
5. Edit transcription if needed
6. Submit report

### Manager Flow
1. Select management role level
2. View aggregated reports from direct reports
3. Edit/add to aggregated content
4. Ask questions via chat interface
5. Submit upward or enable auto-submit
6. Access historical reports via sidebar

### Navigation Patterns
- **Hierarchical Browsing**: Click carets to expand/collapse org levels
- **Historical Access**: Use sidebar options for past reports
- **Cross-functional Queries**: Use chat interface for organizational insights
- **Time-based Filtering**: Use time frame buttons for period-specific views

## MVP Design Considerations
- **Demo-First**: Built to demonstrate concept, not production-ready
- **Simple Implementation**: Basic functionality over advanced features
- **Static Data**: Pre-generated reports for demo purposes
- **Core Features Only**: Voice recording, text editing, basic hierarchy view
- **Minimal Complexity**: Keep UI simple and focused on key user flows