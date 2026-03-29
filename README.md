# Weather Activity Ranking

A scalable web application that ranks outdoor and indoor activities based on 7-day weather forecasts. Built with React, Node.js, GraphQL, and TypeScript.

## 🎯 Overview

This application helps users discover the most suitable activities for any location based on current weather conditions and forecasts. It analyzes meteorological data from OpenMeteo API and provides intelligent activity recommendations for:

- **Skiing** - Based on temperature, snowfall, wind conditions
- **Surfing** - Considers temperature, precipitation, and wave conditions
- **Outdoor Sightseeing** - Optimized for pleasant weather conditions
- **Indoor Sightseeing** - Best during adverse weather periods

## 🏗️ Architecture

### Backend (Node.js + GraphQL + TypeScript)

```
backend/
├── src/
│   ├── clients/           # External API integrations
│   │   └── open-meteo-client.ts
│   ├── config/            # Activity scoring configurations
│   │   └── activities-config.ts
│   ├── schema/            # GraphQL schema definition
│   │   ├── typeDefs.ts
│   │   └── resolvers.ts
│   ├── services/          # Business logic layer
│   │   ├── coordinates-service.ts
│   │   ├── ranking-service.ts
│   │   └── recommendation-service.ts
│   └── types/             # TypeScript type definitions
```

### Frontend (React + TypeScript + Vite)

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components (shadcn/ui)
│   │   ├── header.tsx
│   │   ├── body.tsx
│   │   └── location-combobox.tsx
│   ├── lib/              # Utilities and configurations
│   │   └── apollo.ts     # GraphQL client setup
│   └── types/            # Frontend type definitions
```

## 🧠 Technical Decisions

### 1. **GraphQL API Design**

- **Why**: Enables precise data fetching, reducing over-fetching common with REST APIs
- **Implementation**: Apollo Server with strongly typed resolvers
- **Benefits**: Type safety, flexible queries, single endpoint

### 2. **Service Layer Architecture**

```typescript
CoordinatesService  -> Location geocoding
RankingService     -> Weather-based scoring algorithm
RecommendationService -> Orchestrates data flow
```

- **Why**: Clear separation of concerns, testable business logic
- **Benefits**: Maintainable, extensible, follows SOLID principles

### 3. **Configuration-Driven Scoring**

```typescript
// activities-config.ts - Declarative activity parameters
SKIING: {
	parameters: [
		{ name: "snowfall_sum", weight: 4.0, optimal_value: 7 },
		{ name: "temperature_2m_max", weight: 2.0, optimal_value: -2 },
	];
}
```

- **Why**: Easy to adjust scoring without code changes, data-driven approach
- **Benefits**: Business logic externalized, maintainable by non-developers

### 4. **Weather Data Normalization**

- Custom normalization algorithm converts raw weather values to 0-1 scores
- Weighted scoring system for different weather parameters
- Handles missing data gracefully with fallback values

### 5. **Frontend State Management**

- React hooks for local state management
- Apollo Client for GraphQL state management and caching
- **Why**: Kept simple - no Redux needed for this scope

### 6. **UI/UX Choices**

- **shadcn/ui + Tailwind CSS**: Modern, accessible component library
- **Responsive Design**: Works across devices
- **Real-time Search**: Debounced location search for better UX

## 🤖 AI-Assisted Development

### How AI Was Used:

1. **Architecture Planning**: GPT-4 helped design the service layer structure and GraphQL schema
2. **Code Generation**: Generated boilerplate for GraphQL resolvers and TypeScript types
3. **Configuration Data**: AI assisted in defining realistic weather parameter ranges for activities
4. **Testing Strategy**: Suggested unit test scenarios and mocking patterns
5. **Documentation**: Helped structure comprehensive JSDoc comments

### AI Judgment Applied:

- **Accepted**: Architecture suggestions, boilerplate generation, test patterns
- **Modified**: Weather parameter weights (adjusted based on domain knowledge)
- **Rejected**: Over-engineered patterns suggested for this scope (e.g., event sourcing)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Development

```bash
# Start both backend and frontend concurrently
npm run dev

# Or start individually:
npm run backend  # GraphQL server at http://localhost:4000
npm run frontend # React app at http://localhost:5173
```

### Testing

```bash
# Backend tests
cd backend
npm test

# Run specific test files
npm test -- ranking-service.test.ts
```

## 📊 API Usage

### GraphQL Queries

**Get Location Coordinates:**

```graphql
query LocationCoordinates($location: String!) {
	locationCoordinates(location: $location) {
		results {
			name
			latitude
			longitude
			country
		}
	}
}
```

**Get Activity Rankings:**

```graphql
query ActivityRanking($latitude: Float!, $longitude: Float!) {
	coordinatesActivityRanking(latitude: $latitude, longitude: $longitude) {
		latitude
		longitude
		dailyRankings {
			date
			activities {
				activity
				score
			}
		}
	}
}
```

## ⚠️ Limitations & Trade-offs

### Omitted Features (Due to 2-3 Hour Constraint):

1. **User Authentication** - Would implement JWT-based auth for personalized preferences
2. **Persistent Storage** - Currently stateless; would add Redis for caching and PostgreSQL for user data
3. **Advanced Error Handling** - Basic error handling implemented; needs comprehensive error boundaries and retry logic
4. **Performance Optimization** - No query optimization, caching, or rate limiting implemented
5. **Mobile-First Design** - Responsive but not optimized for mobile gestures
6. **Accessibility** - Basic keyboard navigation; needs full WCAG 2.1 compliance
7. **Internationalization** - English only; would add i18n for global usage
8. **Advanced Weather Features** - No historical data analysis or machine learning predictions

### Technical Shortcuts & Fixes:

1. **In-Memory Configuration**:
   - _Current_: Activity configs hardcoded in TypeScript
   - _Fix_: Move to database with admin interface for real-time updates

2. **Simplistic Scoring Algorithm**:
   - _Current_: Linear normalization with basic weighting
   - _Fix_: Implement machine learning model trained on user feedback

3. **No API Rate Limiting**:
   - _Current_: Direct OpenMeteo API calls without rate limiting
   - _Fix_: Implement Redis-based rate limiting and request queuing

4. **Basic Error Handling**:
   - _Current_: Simple try/catch with generic messages
   - _Fix_: Comprehensive error taxonomy with user-friendly messages

5. **Missing Integration Tests**:
   - _Current_: Unit tests only
   - _Fix_: Add end-to-end tests with Playwright/Cypress

## 🎯 Production Readiness Roadmap

To make this production-ready, I would implement:

- **Infrastructure**: Docker containerization, Kubernetes deployment
- **Monitoring**: APM tools (DataDog/NewRelic), structured logging
- **Security**: Input validation, rate limiting, CORS configuration
- **Performance**: Database indexing, GraphQL query complexity analysis
- **Quality**: Pre-commit hooks, automated testing pipeline, SonarQube
- **Documentation**: OpenAPI docs, architectural decision records

---

**Built by**: Maurício Futer Charchat  
**Tech Stack**: React 19, Node.js, Apollo GraphQL, TypeScript, Vite, Tailwind CSS  
**APIs**: OpenMeteo Weather & Geocoding APIs
