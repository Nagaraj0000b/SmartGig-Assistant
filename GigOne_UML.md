# GigOne - UML Class Diagram

## System Architecture Overview

The GigOne system is a voice-first personal assistant for gig economy workers that analyzes daily earnings, sentiment, and environmental factors to provide personalized recommendations.

```mermaid
classDiagram
    %% Core User Entity
    class User {
        -String userId
        -String name
        -String phoneNumber
        -String language
        -Date registrationDate
        +login()
        +logout()
        +updateProfile()
    }

    %% Voice Interface Layer
    class VoiceInterface {
        -String sessionId
        -Date timestamp
        -String audioFormat
        +recordAudio()
        +playPrompt()
        +endSession()
    }

    %% NLP Processing Layer
    class SpeechToText {
        -String apiProvider
        -String language
        +convertAudioToText(audio: Binary): String
        +detectLanguage(audio: Binary): String
    }

    class EntityExtractor {
        -List~Pattern~ patterns
        +extractEarnings(text: String): Float
        +extractKeywords(text: String): List~String~
        +extractContext(text: String): String
    }

    class SentimentAnalyzer {
        -String model
        -Float threshold
        +analyzeSentiment(text: String): Float
        +classifyMood(sentiment: Float): String
    }

    %% Data Models
    class DailyLog {
        -String logId
        -String userId
        -Date date
        -Float earnings
        -Float sentiment
        -List~String~ keywords
        -String rawText
        -String audioUrl
        +save()
        +update()
        +delete()
    }

    class ContextData {
        -String contextId
        -String logId
        -Float temperature
        -String weatherCondition
        -String trafficLevel
        -String airQuality
        -Date fetchedAt
        +fetchWeatherData()
        +fetchTrafficData()
    }

    %% External API Integration
    class WeatherAPI {
        -String apiKey
        -String endpoint
        +getCurrentWeather(location: String): WeatherData
        +getForecast(location: String, days: Integer): List~WeatherData~
    }

    class TrafficAPI {
        -String apiKey
        -String endpoint
        +getTrafficConditions(location: String): TrafficData
        +getPredictedTraffic(location: String, time: DateTime): TrafficData
    }

    %% Machine Learning Layer
    class RecommendationEngine {
        -String modelPath
        -Float confidenceThreshold
        +predictSuccessProbability(userData: List~DailyLog~, forecast: ContextData): Float
        +generateRecommendation(probability: Float, context: ContextData): Recommendation
        +trainModel(historicalData: List~DailyLog~)
    }

    class Recommendation {
        -String recommendationId
        -String userId
        -Date generatedAt
        -String advice
        -Float successProbability
        -String reasoning
        -List~String~ actionItems
        +display()
        +markAsRead()
    }

    %% Analytics and Insights
    class AnalyticsEngine {
        -String userId
        +calculateAverageEarnings(period: String): Float
        +identifyPatterns(logs: List~DailyLog~): List~Pattern~
        +detectBurnoutRisk(recentLogs: List~DailyLog~): Float
        +generateInsights(): List~Insight~
    }

    class Pattern {
        -String patternId
        -String type
        -String description
        -Float confidence
        -List~String~ triggers
    }

    class Insight {
        -String insightId
        -String category
        -String message
        -Date generatedAt
    }

    %% Relationships
    User "1" --> "0..*" DailyLog: creates
    User "1" --> "1" VoiceInterface: uses
    User "1" --> "0..*" Recommendation: receives

    VoiceInterface "1" --> "1" SpeechToText: processes through
    SpeechToText "1" --> "1" EntityExtractor: passes text to
    SpeechToText "1" --> "1" SentimentAnalyzer: passes text to

    EntityExtractor "1" --> "1" DailyLog: populates
    SentimentAnalyzer "1" --> "1" DailyLog: populates

    DailyLog "1" --> "1" ContextData: has

    ContextData "1" --> "1" WeatherAPI: fetches from
    ContextData "1" --> "1" TrafficAPI: fetches from

    RecommendationEngine "1" --> "0..*" DailyLog: analyzes
    RecommendationEngine "1" --> "1" ContextData: considers
    RecommendationEngine "1" --> "1" Recommendation: generates

    AnalyticsEngine "1" --> "0..*" DailyLog: processes
    AnalyticsEngine "1" --> "0..*" Pattern: identifies
    AnalyticsEngine "1" --> "0..*" Insight: generates
```

## System Component Diagram

```mermaid
graph TB
    subgraph "User Layer"
        A[Gig Worker]
    end

    subgraph "Interface Layer"
        B[Voice Interface]
        C[Web Application UI]
    end

    subgraph "NLP Processing Layer"
        D[Speech-to-Text Service]
        E[Entity Extractor]
        F[Sentiment Analyzer]
    end

    subgraph "Data Layer"
        G[(Database)]
        H[Daily Logs]
        I[Context Data]
    end

    subgraph "External Services"
        J[Weather API]
        K[Traffic API]
    end

    subgraph "Intelligence Layer"
        L[ML Recommendation Engine]
        M[Analytics Engine]
    end

    subgraph "Output Layer"
        N[Recommendations]
        O[Insights Dashboard]
    end

    A -->|Voice Input| B
    B --> C
    B -->|Audio| D
    D -->|Text| E
    D -->|Text| F
    E -->|Earnings, Keywords| H
    F -->|Sentiment Score| H
    H --> G
    I --> G
    J -->|Weather Data| I
    K -->|Traffic Data| I
    H --> L
    I --> L
    H --> M
    L --> N
    M --> O
    N --> C
    O --> C
    C -->|Display| A
```

## Sequence Diagram: Daily Log Creation Flow

```mermaid
sequenceDiagram
    actor Worker as Gig Worker
    participant App as Web App
    participant Voice as Voice Interface
    participant STT as Speech-to-Text
    participant Entity as Entity Extractor
    participant Sentiment as Sentiment Analyzer
    participant Weather as Weather API
    participant Traffic as Traffic API
    participant DB as Database
    participant ML as Recommendation Engine

    Worker->>App: Opens app after shift
    App->>Voice: Initialize voice session
    Voice->>Worker: "Aaj ka din kaisa tha?"
    Worker->>Voice: Records voice response
    Voice->>STT: Send audio data
    STT->>STT: Convert to text
    STT-->>Voice: Return transcribed text

    par Process in Parallel
        Voice->>Entity: Extract entities
        Entity->>Entity: Extract earnings, keywords
        Entity-->>Voice: {earnings: 500, keywords: ["hot", "tired"]}
    and
        Voice->>Sentiment: Analyze sentiment
        Sentiment->>Sentiment: Calculate sentiment score
        Sentiment-->>Voice: {sentiment: -0.6, mood: "negative"}
    end

    Voice->>Weather: Fetch today's weather
    Weather-->>Voice: {temp: 41°C, condition: "heatwave"}

    Voice->>Traffic: Fetch traffic data
    Traffic-->>Voice: {level: "moderate"}

    Voice->>DB: Save DailyLog with ContextData
    DB-->>Voice: Log saved successfully

    Voice->>ML: Request recommendation
    ML->>DB: Fetch historical logs
    DB-->>ML: User's past 14 days data
    ML->>ML: Analyze patterns & predict
    ML-->>Voice: Generate recommendation

    Voice->>App: Display results
    App->>Worker: Show recommendation
```

## Use Case Diagram

```mermaid
graph LR
    subgraph "GigOne System"
        UC1[Record Daily Log]
        UC2[Analyze Sentiment]
        UC3[Extract Earnings]
        UC4[Fetch Weather Data]
        UC5[Generate Recommendation]
        UC6[View Historical Data]
        UC7[View Insights]
        UC8[Manage Profile]
    end

    Worker((Gig Worker))
    System((System))
    WeatherService((Weather API))

    Worker --> UC1
    Worker --> UC6
    Worker --> UC7
    Worker --> UC8

    UC1 --> UC2
    UC1 --> UC3
    UC1 --> UC4

    UC2 --> System
    UC3 --> System
    UC4 --> WeatherService

    System --> UC5
    System --> UC6
    System --> UC7
```

## Data Flow Diagram (Level 0 - Context Diagram)

```mermaid
graph TB
    Worker[Gig Worker] -->|Voice Input| GigOne[GigOne System]
    GigOne -->|Recommendations & Insights| Worker

    Weather[Weather Service] -->|Weather Data| GigOne
    Traffic[Traffic Service] -->|Traffic Data| GigOne
```

## Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ DAILY_LOG : creates
    USER ||--o{ RECOMMENDATION : receives
    USER {
        string userId PK
        string name
        string phoneNumber
        string language
        date registrationDate
    }

    DAILY_LOG ||--|| CONTEXT_DATA : has
    DAILY_LOG {
        string logId PK
        string userId FK
        date date
        float earnings
        float sentiment
        string keywords
        string rawText
    }

    CONTEXT_DATA {
        string contextId PK
        string logId FK
        float temperature
        string weatherCondition
        string trafficLevel
        date fetchedAt
    }

    RECOMMENDATION ||--o{ DAILY_LOG : analyzes
    RECOMMENDATION {
        string recommendationId PK
        string userId FK
        date generatedAt
        string advice
        float successProbability
        string reasoning
    }

    DAILY_LOG ||--o{ PATTERN : generates
    PATTERN {
        string patternId PK
        string type
        string description
        float confidence
    }

    PATTERN ||--o{ INSIGHT : produces
    INSIGHT {
        string insightId PK
        string category
        string message
        date generatedAt
    }
```

## Key Design Principles

### 1. **Voice-First Architecture**

- All user input flows through the `VoiceInterface` class
- Supports Hinglish (Hindi + English) mixed language input
- Optimized for low-literacy users

### 2. **Separation of Concerns**

- **NLP Layer**: Handles all text processing (STT, entity extraction, sentiment)
- **Data Layer**: Manages persistent storage
- **Intelligence Layer**: ML models and analytics
- **Integration Layer**: External API communications

### 3. **Context Awareness**

- Every `DailyLog` is linked to `ContextData`
- Correlates subjective (sentiment) with objective (weather) data

### 4. **Recommendation Engine**

- Analyzes historical patterns
- Considers forecasted conditions
- Provides actionable advice with reasoning

### 5. **Scalability Considerations**

- Single-user system initially
- Database design supports multi-user expansion
- API integrations abstracted for easy provider switches

## Technology Stack (Implied from Design)

| Component              | Technology                         |
| ---------------------- | ---------------------------------- |
| **Speech-to-Text**     | OpenAI Whisper / Google Speech API |
| **Sentiment Analysis** | VADER / TextBlob                   |
| **Entity Extraction**  | Regex / spaCy                      |
| **ML Framework**       | Scikit-learn / TensorFlow          |
| **Database**           | PostgreSQL / MongoDB               |
| **Backend**            | Python (Flask/FastAPI)             |
| **Frontend**           | React / Vue.js (PWA)               |
| **Weather API**        | OpenWeatherMap                     |
| **Traffic API**        | Google Maps / TomTom               |

---

**Created for:** GigOne Project  
**Date:** 2026-02-11  
**Purpose:** System design documentation and implementation reference
