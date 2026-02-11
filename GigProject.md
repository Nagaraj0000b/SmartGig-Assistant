

---

# **PROJECT REPORT: GigOne**

**A Context-Aware Personal Assistant for Gig Economy Workers**

## **1\. Abstract**

The Indian gig economy is expanding rapidly, yet workers on platforms like Swiggy, Zomato, and Uber face significant challenges regarding income instability and physical burnout. Currently, workers lack data-driven tools to manage their own well-being and often make work decisions based on rumors or intuition. This project proposes **"GigOne,"** a voice-first web application that acts as a personal digital manager. By utilizing active dialogue to record daily earnings and sentiment, and correlating this with external factors like Weather and Traffic, the system provides personalized recommendations to optimize both earnings and mental health.

## **2\. Introduction**

### **2.1 Problem Statement**

Gig workers operate in an environment of extreme information asymmetry. While platforms use sophisticated algorithms to maximize their own efficiency, workers lack a unified tool to track their personal performance and health.

* **The "Burnout" Blind Spot:** Workers often push through fatigue to meet targets, not realizing that working while exhausted leads to slower delivery times and lower effective earnings.  
* **Lack of Historical Insight:** A worker might not realize that they consistently feel "angry" or "stressed" on specific days (e.g., rainy Tuesdays) or in specific zones.  
* **Manual Tracking Fatigue:** Existing solutions require typing data into spreadsheets, which is impossible for a rider on a bike.

### **2.2 Project Objective**

To build a **Single-User Recommendation System** that:

1. **Listens:** Uses a voice-bot interface to interview the worker daily about their earnings and mood.  
2. **Analyzes:** Correlates the worker's subjective feeling (Sentiment) with objective data (Earnings, Weather).  
3. **Advises:** Suggests whether to work, rest, or switch strategies for the next day to prevent burnout.

## **3\. Proposed Solution**

### **3.1 The Core Concept: "Active Dialogue"**

GigOne does not passively track data. It acts as a companion. instead of filling a form, the user has a 30-second conversation with the app at the end of the day.

* **System:** "How was the day? How much did you earn?"  
* **User:** "Traffic was terrible, I have a headache. But I made 800 rupees."  
* **System:** Logs Sentiment (Negative), Context (Traffic), and Earnings (₹800).

### **3.2 Key Features**

* **Voice-First Interface:** Optimized for Hinglish (Hindi \+ English) speakers, removing literacy barriers.  
* **Interactive Earning Log:** Earnings are captured verbally during the chat, eliminating manual data entry.  
* **Context Awareness:** Automatically fetches real-time Weather and Traffic data to understand *why* the user might be stressed.  
* **Smart Recommendation:** Uses Machine Learning to predict the "Success Probability" of working tomorrow based on past logs.

## **4\. System Design & Architecture**

## 

## 

### **4.1 Data Flow Logic**

The system follows a linear pipeline:

1. **Input:** User records a voice log via the app interface.  
2. **Processing (NLP Layer):**  
   * **Speech-to-Text:** Converts audio to text (using OpenAI Whisper or Google Speech API).  
   * **Entity Extraction:** Identifies the earning amount (e.g., "800") and keywords (e.g., "Rain", "Police").  
   * **Sentiment Analysis:** Assigns a mood score from \-1.0 (Negative) to \+1.0 (Positive).  
3. **Context Integration:** The system fetches API data for tomorrow’s weather forecast.  
4. **Decision (ML Layer):** The Recommendation Engine compares the user's historical mood/earnings against the forecast to generate advice.

## **5\. Methodology (How it Works)**

### **Step 1: Data Collection (The Conversation)**

The user opens the app after their shift.

* **App Prompt:** "Aaj ka din kaisa tha aur kitni kamai hui?" (How was your day and earnings?)  
* **User Response:** "Bohat garmi thi aaj, thak gaya hu. 500 rupay banaye." (It was very hot, I am tired. Made 500 rupees.)

### **Step 2: Feature Extraction**

The system processes the text to extract parameters:

| Parameter | Value | Source |
| :---- | :---- | :---- |
| **Sentiment** | Negative (-0.6) | Voice Analysis (VADER) |
| **Earnings** | ₹500 | Entity Extraction (Regex) |
| **Keywords** | "Heat", "Tired" | Text Mining |
| **Weather History** | 41°C (Heatwave) | Weather API (Historical) |

### **Step 3: Prediction Logic (The Algorithm)**

The ML model looks at the user's history.

* *Query:* "Tomorrow is 42°C. How does this user perform in high heat?"  
* *History:* "User usually reports Low Earnings (\<₹600) and High Stress during heatwaves."  
* *Conclusion:* High risk of burnout.

### **Step 4: Output**

The system generates a recommendation:

*"Tomorrow will be very hot (42°C). Your history shows you earn less in this heat and get tired. Recommendation: Take a rest day tomorrow and work the evening shift on Friday instead."*

## **6\. Feasibility & Constraints**

### **6.1 Operational Feasibility**

* **Low Friction:** The "Voice-First" approach makes it easy for tired workers to use the app.  
* **Hardware:** It is a lightweight web app that works on any basic smartphone used by gig workers.

### **6.2 Constraints**

* **Data Accuracy:** The system relies on the user truthfully reporting their earnings verbally.  
* **Cold Start Problem:** The AI needs about 7-14 days of data before it can give accurate personalized advice.

## **7\. Future Scope**

* **Dialect Support:** Expanding the NLP model to understand regional dialects beyond standard Hindi/English.  
* **Wearable Integration:** Future versions could fetch heart rate data from smartwatches to detect physical stress objectively.

## **8\. Conclusion**

GigOne addresses a critical gap in the gig economy: the lack of worker-centric tools. By shifting the focus from "Platform Efficiency" to "Worker Well-being," and using a simple conversational interface to track earnings and mood, this project demonstrates how Machine Learning can assist workers in making smarter, healthier career decisions.

