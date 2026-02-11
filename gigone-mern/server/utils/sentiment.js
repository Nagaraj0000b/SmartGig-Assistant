/**
 * Sentiment Analysis Utility (from GigOne prototype)
 * Analyzes English text for sentiment and extracts insights
 */

const analyzeSentiment = (text) => {
  const lowerText = text.toLowerCase();
  
  // Positive keywords
  const positiveWords = [
    'good', 'great', 'excellent', 'happy', 'satisfied', 'easy', 'smooth',
    'productive', 'successful', 'earned', 'bonus', 'tip', 'profitable',
    'comfortable', 'safe', 'nice', 'pleasant', 'enjoy', 'love'
  ];
  
  // Negative keywords
  const negativeWords = [
    'bad', 'terrible', 'awful', 'difficult', 'hard', 'tired', 'exhausted',
    'stressful', 'frustrated', 'angry', 'sad', 'worried', 'problem', 'issue',
    'traffic', 'delay', 'cancelled', 'complaint', 'rude', 'unsafe', 'dangerous'
  ];
  
  // Stress indicators
  const stressIndicators = [
    'tired', 'exhausted', 'stressed', 'overwhelming', 'burnt out', 'burnout',
    'pain', 'ache', 'sick', 'ill', 'fatigue', 'too much', 'cant take',
    'breaking point', 'need break', 'need rest'
  ];
  
  // Count positive and negative words
  let positiveCount = 0;
  let negativeCount = 0;
  const foundKeywords = [];
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) {
      positiveCount++;
      foundKeywords.push(word);
    }
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) {
      negativeCount++;
      foundKeywords.push(word);
    }
  });
  
  // Check for stress
  const hasStressIndicators = stressIndicators.some(indicator => 
    lowerText.includes(indicator)
  );
  
  // Calculate sentiment score (-1 to 1)
  const totalWords = positiveCount + negativeCount;
  let score = 0;
  
  if (totalWords > 0) {
    score = (positiveCount - negativeCount) / totalWords;
  }
  
  // Determine mood
  let mood = 'neutral';
  if (score > 0.2) mood = 'positive';
  else if (score < -0.2) mood = 'negative';
  
  // Extract earnings amount
  const earningsMatch = lowerText.match(/(\d+)\s*(rupees?|rs|₹)/i);
  const earnings = earningsMatch ? parseInt(earningsMatch[1]) : 0;
  
  return {
    score,
    mood,
    keywords: foundKeywords,
    hasStressIndicators,
    earnings
  };
};

module.exports = { analyzeSentiment };
