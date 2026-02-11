// ============================================
// GigOne - Voice Assistant for Gig Workers
// ============================================

class GigOneApp {
    constructor() {
        this.userId = 'user123';
        this.currentTranscript = '';
        this.isRecording = false;
        this.recognition = null;
        // hi-IN works better for Hinglish - picks up English numbers/words
        this.currentLanguage = 'hi-IN';
        this.supportedLanguages = ['hi-IN', 'en-IN'];

        
        this.init();
    }

    init() {
        this.setupVoiceRecognition();
        this.attachEventListeners();
        this.loadData();
        this.updateUI();
    }

    // ============================================
    // Voice Recognition Setup
    // ============================================
    setupVoiceRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showToast('⚠️ Voice recognition not supported in this browser. Please use Chrome or Edge.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        
        // Always set language for better recognition
        // en-IN handles Hinglish (mixed Hindi-English) best
        this.recognition.lang = this.currentLanguage;

        this.recognition.onstart = () => {
            this.isRecording = true;
            document.getElementById('recordingStatus').textContent = '🎤 Listening...';
            document.getElementById('micButton').classList.add('recording');
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                this.currentTranscript += finalTranscript;
            }

            const displayText = this.currentTranscript + (interimTranscript ? '<i style="color: #a0aec0;">' + interimTranscript + '</i>' : '');
            document.getElementById('transcriptText').innerHTML = displayText || 'Your words will appear here...';
            
            // Enable submit button if we have content
            document.getElementById('submitButton').disabled = !this.currentTranscript.trim();
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            this.stopRecording();
            
            if (event.error === 'no-speech') {
                this.showToast('No speech detected. Please try again.');
            } else if (event.error === 'not-allowed') {
                this.showToast('⚠️ Microphone access denied. Please allow microphone access.');
            } else {
                this.showToast('Error: ' + event.error);
            }
        };

        this.recognition.onend = () => {
            if (this.isRecording) {
                // Restart if still recording (continuous mode)
                try {
                    this.recognition.start();
                } catch (e) {
                    console.log('Recognition restart failed', e);
                }
            }
        };
    }

    // ============================================
    // Recording Controls
    // ============================================
    toggleRecording() {
        if (!this.recognition) {
            this.showToast('⚠️ Voice recognition not available');
            return;
        }

        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    startRecording() {
        this.currentTranscript = '';
        document.getElementById('transcriptText').innerHTML = 'Listening...';
        document.getElementById('submitButton').disabled = true;
        
        try {
            // Always set language for consistent recognition
            this.recognition.lang = this.currentLanguage;
            this.recognition.start();
            document.getElementById('micButton').querySelector('.mic-text').textContent = 'Recording...';
        } catch (e) {
            console.error('Failed to start recording', e);
            this.showToast('Failed to start recording. Please try again.');
        }
    }

    stopRecording() {
        this.isRecording = false;
        if (this.recognition) {
            this.recognition.stop();
        }
        document.getElementById('recordingStatus').textContent = '✓ Recording stopped';
        document.getElementById('micButton').classList.remove('recording');
        document.getElementById('micButton').querySelector('.mic-text').textContent = 'Tap to Speak';
    }

    // ============================================
    // Sentiment Analysis
    // ============================================
    analyzeSentiment(text) {
        const positiveWords = [
            'good', 'great', 'excellent', 'happy', 'joy', 'love', 'wonderful', 'amazing', 'fantastic',
            'अच्छा', 'खुश', 'बढ़िया', 'मस्त', 'शानदार', 'अच्छे', 'सुखद', 'प्रसन्न'
        ];
        
        const negativeWords = [
            'bad', 'terrible', 'awful', 'sad', 'angry', 'hate', 'difficult', 'hard', 'tired', 'exhausted',
            'बुरा', 'गुस्सा', 'थका', 'मुश्किल', 'परेशान', 'दुखी', 'गर्मी', 'तकलीफ', '힘들'
        ];

        const lowerText = text.toLowerCase();
        let score = 0;
        
        positiveWords.forEach(word => {
            if (lowerText.includes(word)) score += 0.3;
        });
        
        negativeWords.forEach(word => {
            if (lowerText.includes(word)) score -= 0.3;
        });

        // Normalize score to [-1, 1]
        score = Math.max(-1, Math.min(1, score));
        
        return {
            score: score,
            mood: score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral'
        };
    }

    // ============================================
    // Entity Extraction
    // ============================================
    extractEarnings(text) {
        // Pattern matching for earnings in rupees
        const patterns = [
            /(?:₹|rs\.?|rupees?)\s*(\d+)/i,
            /(\d+)\s*(?:₹|rs\.?|rupees?)/i,
            /(?:kamaaya|earned|kamaye|income)\s*(?:₹|rs\.?)?\s*(\d+)/i,
            /(\d+)\s*(?:kamaaya|earned|kamaye)/i
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                return parseFloat(match[1]);
            }
        }

        return 0;
    }

    extractKeywords(text) {
        const keywords = [];
        const importantWords = [
            'hot', 'cold', 'rain', 'traffic', 'tired', 'happy', 'sad', 'busy', 'slow',
            'garmi', 'thandi', 'barish', 'traffic', 'thaka', 'khush', 'dukhi', 'व्यस्त'
        ];

        const lowerText = text.toLowerCase();
        importantWords.forEach(word => {
            if (lowerText.includes(word)) {
                keywords.push(word);
            }
        });

        return keywords;
    }

    // ============================================
    // Mock Context Data
    // ============================================
    getMockContextData() {
        const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Heatwave', 'Pleasant'];
        const traffic = ['Light', 'Moderate', 'Heavy'];
        
        return {
            temperature: Math.floor(Math.random() * 20) + 25, // 25-45°C
            weatherCondition: conditions[Math.floor(Math.random() * conditions.length)],
            trafficLevel: traffic[Math.floor(Math.random() * traffic.length)],
            airQuality: Math.floor(Math.random() * 100) + 50
        };
    }

    // ============================================
    // Daily Log Management
    // ============================================
    submitDailyLog() {
        if (!this.currentTranscript.trim()) {
            this.showToast('⚠️ Please record something first');
            return;
        }

        const sentiment = this.analyzeSentiment(this.currentTranscript);
        const earnings = this.extractEarnings(this.currentTranscript);
        const keywords = this.extractKeywords(this.currentTranscript);
        const contextData = this.getMockContextData();

        const dailyLog = {
            logId: 'log_' + Date.now(),
            userId: this.userId,
            date: new Date().toISOString(),
            earnings: earnings,
            sentiment: sentiment.score,
            mood: sentiment.mood,
            keywords: keywords,
            rawText: this.currentTranscript.trim(),
            ...contextData
        };

        // Save to localStorage
        this.saveDailyLog(dailyLog);

        // Generate recommendation
        const recommendation = this.generateRecommendation(dailyLog);

        // Show recommendation
        this.displayRecommendation(dailyLog, recommendation);

        // Update analytics
        this.updateUI();

        this.showToast('✅ Daily log saved successfully!');
    }

    saveDailyLog(log) {
        const logs = this.getDailyLogs();
        logs.push(log);
        localStorage.setItem('gigone_logs', JSON.stringify(logs));
    }

    getDailyLogs() {
        const logs = localStorage.getItem('gigone_logs');
        return logs ? JSON.parse(logs) : [];
    }

    // ============================================
    // Recommendation Engine
    // ============================================
    generateRecommendation(currentLog) {
        const logs = this.getDailyLogs();
        const recentLogs = logs.slice(-7); // Last 7 days
        
        const avgEarnings = recentLogs.reduce((sum, log) => sum + log.earnings, 0) / (recentLogs.length || 1);
        const avgSentiment = recentLogs.reduce((sum, log) => sum + log.sentiment, 0) / (recentLogs.length || 1);
        
        const recommendations = [];
        
        // Earnings-based recommendation
        if (currentLog.earnings > avgEarnings * 1.2) {
            recommendations.push({
                type: 'positive',
                title: '🎉 Excellent Performance!',
                message: `You earned ₹${currentLog.earnings} today, which is ${Math.round((currentLog.earnings / avgEarnings - 1) * 100)}% more than your average. Keep up the great work!`
            });
        } else if (currentLog.earnings < avgEarnings * 0.7) {
            recommendations.push({
                type: 'warning',
                title: '💡 Below Average Day',
                message: `Today's earnings (₹${currentLog.earnings}) are lower than usual. Consider reviewing your schedule or trying different peak hours.`
            });
        }

        // Sentiment-based recommendation
        if (currentLog.sentiment < -0.3 && avgSentiment < -0.2) {
            recommendations.push({
                type: 'warning',
                title: '⚠️ Burnout Alert',
                message: 'Your recent logs show increasing stress. Consider taking a rest day to recharge. Your wellbeing matters!'
            });
        }

        // Weather-based recommendation
        if (currentLog.temperature > 38) {
            recommendations.push({
                type: 'warning',
                title: '🌡️ Heat Advisory',
                message: `It's ${currentLog.temperature}°C today. Stay hydrated, take frequent breaks in shade, and avoid peak afternoon hours (12-3 PM).`
            });
        }

        // Traffic-based recommendation
        if (currentLog.trafficLevel === 'Heavy') {
            recommendations.push({
                type: 'warning',
                title: '🚗 Heavy Traffic',
                message: 'Traffic is heavy today. Plan routes carefully and allow extra time for deliveries.'
            });
        }

        // Default positive recommendation
        if (recommendations.length === 0) {
            recommendations.push({
                type: 'positive',
                title: '✨ Keep Going!',
                message: `You earned ₹${currentLog.earnings} today. Stay consistent and you'll reach your goals!`
            });
        }

        return {
            recommendationId: 'rec_' + Date.now(),
            userId: this.userId,
            generatedAt: new Date().toISOString(),
            recommendations: recommendations,
            successProbability: this.calculateSuccessProbability(currentLog, recentLogs)
        };
    }

    calculateSuccessProbability(currentLog, recentLogs) {
        let probability = 0.5;
        
        // Positive sentiment increases probability
        if (currentLog.sentiment > 0) probability += 0.2;
        
        // Good earnings
        const avgEarnings = recentLogs.reduce((sum, log) => sum + log.earnings, 0) / (recentLogs.length || 1);
        if (currentLog.earnings > avgEarnings) probability += 0.2;
        
        // Good weather
        if (currentLog.temperature < 35 && currentLog.weatherCondition !== 'Rainy') probability += 0.1;
        
        return Math.min(0.95, Math.max(0.1, probability));
    }

    displayRecommendation(log, recommendation) {
        // Hide voice section, show recommendation
        document.getElementById('voiceSection').style.display = 'none';
        document.getElementById('recommendationSection').style.display = 'block';

        const content = document.getElementById('recommendationContent');
        let html = `
            <div class="rec-item positive">
                <h4>📊 Today's Summary</h4>
                <p>
                    <strong>Earnings:</strong> ₹${log.earnings}<br>
                    <strong>Mood:</strong> ${this.getMoodEmoji(log.mood)} ${log.mood.charAt(0).toUpperCase() + log.mood.slice(1)}<br>
                    <strong>Weather:</strong> ${log.weatherCondition}, ${log.temperature}°C<br>
                    <strong>Success Probability:</strong> ${Math.round(recommendation.successProbability * 100)}%
                </p>
            </div>
        `;

        recommendation.recommendations.forEach(rec => {
            html += `
                <div class="rec-item ${rec.type}">
                    <h4>${rec.title}</h4>
                    <p>${rec.message}</p>
                </div>
            `;
        });

        content.innerHTML = html;
    }

    getMoodEmoji(mood) {
        const emojis = {
            positive: '😊',
            neutral: '😐',
            negative: '😔'
        };
        return emojis[mood] || '😐';
    }

    // ============================================
    // Analytics
    // ============================================
    updateAnalytics() {
        const logs = this.getDailyLogs();
        const recent7Days = logs.slice(-7);

        if (recent7Days.length === 0) {
            return;
        }

        // Average earnings
        const avgEarnings = recent7Days.reduce((sum, log) => sum + log.earnings, 0) / recent7Days.length;
        document.getElementById('avgEarnings').textContent = '₹' + Math.round(avgEarnings);

        // Total earnings
        const totalEarnings = recent7Days.reduce((sum, log) => sum + log.earnings, 0);
        document.getElementById('totalEarnings').textContent = '₹' + totalEarnings;

        // Best day
        const bestLog = recent7Days.reduce((max, log) => log.earnings > max.earnings ? log : max, recent7Days[0]);
        const bestDate = new Date(bestLog.date);
        document.getElementById('bestDay').textContent = bestDate.toLocaleDateString('en-IN', { weekday: 'short' });

        // Mood trend
        const avgSentiment = recent7Days.reduce((sum, log) => sum + log.sentiment, 0) / recent7Days.length;
        const moodText = avgSentiment > 0.2 ? '📈 Positive' : avgSentiment < -0.2 ? '📉 Needs Care' : '➡️ Stable';
        document.getElementById('moodTrend').textContent = moodText;

        // Insights
        const insights = this.generateInsights(recent7Days);
        const insightsList = document.getElementById('insightsList');
        
        if (insights.length > 0) {
            let html = '<h4>💡 Patterns Detected</h4>';
            insights.forEach(insight => {
                html += `<div class="insight-item">${insight}</div>`;
            });
            insightsList.innerHTML = html;
        }
    }

    generateInsights(logs) {
        const insights = [];
        
        // High earner days
        const avgEarnings = logs.reduce((sum, log) => sum + log.earnings, 0) / logs.length;
        const highDays = logs.filter(log => log.earnings > avgEarnings * 1.2);
        if (highDays.length > 0) {
            insights.push(`🎯 You earn more on average when your mood is positive.`);
        }

        // Weather impact
        const hotDays = logs.filter(log => log.temperature > 38);
        if (hotDays.length > 2) {
            insights.push(`🌡️ Hot weather days (${hotDays.length} days) tend to be more challenging.`);
        }

        // Consistency check
        const earningsVariance = logs.reduce((sum, log) => sum + Math.pow(log.earnings - avgEarnings, 2), 0) / logs.length;
        if (earningsVariance < avgEarnings * 0.5) {
            insights.push(`📊 Your earnings are consistent. Great job maintaining steady performance!`);
        }

        return insights;
    }

    // ============================================
    // History Management
    // ============================================
    updateHistory() {
        const logs = this.getDailyLogs();
        const historyList = document.getElementById('historyList');
        
        if (logs.length === 0) {
            historyList.innerHTML = '<p class="empty-state">No previous logs found. Start recording your daily experiences!</p>';
            return;
        }

        const recent7 = logs.slice(-7).reverse();
        let html = '';

        recent7.forEach(log => {
            const date = new Date(log.date);
            const dateStr = date.toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
            });

            html += `
                <div class="history-item ${log.mood}">
                    <div class="history-date">${dateStr} - ${this.getMoodEmoji(log.mood)}</div>
                    <div class="history-text">${log.rawText.substring(0, 150)}${log.rawText.length > 150 ? '...' : ''}</div>
                    <div class="history-meta">
                        <span>💰 ₹${log.earnings}</span>
                        <span>🌡️ ${log.temperature}°C</span>
                        <span>🌤️ ${log.weatherCondition}</span>
                    </div>
                </div>
            `;
        });

        historyList.innerHTML = html;
    }

    updateTodaySummary() {
        const logs = this.getDailyLogs();
        const today = new Date().toDateString();
        const todayLogs = logs.filter(log => new Date(log.date).toDateString() === today);

        const summary = document.getElementById('todaySummary');
        
        if (todayLogs.length === 0) {
            summary.innerHTML = '<p>No logs recorded yet today.</p>';
            return;
        }

        const totalEarnings = todayLogs.reduce((sum, log) => sum + log.earnings, 0);
        const avgSentiment = todayLogs.reduce((sum, log) => sum + log.sentiment, 0) / todayLogs.length;
        const mood = avgSentiment > 0.2 ? 'positive' : avgSentiment < -0.2 ? 'negative' : 'neutral';

        summary.innerHTML = `
            <div class="history-item ${mood}">
                <h4>Today's Overview ${this.getMoodEmoji(mood)}</h4>
                <p><strong>Total Earnings:</strong> ₹${totalEarnings}</p>
                <p><strong>Logs Recorded:</strong> ${todayLogs.length}</p>
                <p><strong>Overall Mood:</strong> ${mood.charAt(0).toUpperCase() + mood.slice(1)}</p>
            </div>
        `;
    }

    // ============================================
    // UI Management
    // ============================================
    updateUI() {
        this.updateAnalytics();
        this.updateHistory();
        this.updateTodaySummary();
    }

    loadData() {
        // Load any saved preferences
        const savedLang = localStorage.getItem('gigone_language');
        if (savedLang) {
            this.currentLanguage = savedLang;
            document.getElementById('languageSelect').value = savedLang;
        }
    }

    resetVoiceSection() {
        document.getElementById('voiceSection').style.display = 'block';
        document.getElementById('recommendationSection').style.display = 'none';
        this.currentTranscript = '';
        document.getElementById('transcriptText').innerHTML = 'Your words will appear here...';
        document.getElementById('submitButton').disabled = true;
        document.getElementById('recordingStatus').textContent = '';
    }

    // ============================================
    // Event Listeners
    // ============================================
    attachEventListeners() {
        // Mic button
        document.getElementById('micButton').addEventListener('click', () => {
            this.toggleRecording();
        });

        // Submit button
        document.getElementById('submitButton').addEventListener('click', () => {
            this.stopRecording();
            this.submitDailyLog();
        });

        // Continue button
        document.getElementById('continueButton').addEventListener('click', () => {
            this.resetVoiceSection();
        });

        // Language selector
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            localStorage.setItem('gigone_language', e.target.value);
            
            // Always set language
            if (this.recognition) {
                this.recognition.lang = e.target.value;
            }
            
            let langName = e.target.value === 'hi-IN' ? 'Hindi (picks up English words)' : 'English only';
            this.showToast('Language: ' + langName);
        });

        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.dataset.tab;
                
                // Update active states
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                button.classList.add('active');
                document.getElementById(tab + 'Tab').classList.add('active');
            });
        });
    }

    // ============================================
    // Utilities
    // ============================================
    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// ============================================
// Initialize App
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    window.gigOneApp = new GigOneApp();
    console.log('🎙️ GigOne initialized successfully!');
});
