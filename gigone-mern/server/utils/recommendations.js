/**
 * Recommendation Engine
 * Generates personalized recommendations based on sentiment and patterns
 */

const generateRecommendations = (sentiment, earnings, recentLogs = []) => {
  const recommendations = [];
  
  // Based on sentiment
  if (sentiment.mood === 'negative') {
    recommendations.push('📅 Consider taking a short break to recharge');
    
    if (sentiment.hasStressIndicators) {
      recommendations.push('🧘 Your wellbeing matters! Please rest if needed');
      recommendations.push('💬 Talk to someone you trust about how you feel');
    }
  }
  
  if (sentiment.mood === 'positive') {
    recommendations.push('🎉 Great work today! Keep this momentum going');
  }
  
  // Based on earnings
  if (earnings > 0) {
    if (earnings >= 500) {
      recommendations.push(`💰 Excellent earnings today! (₹${earnings})`);
    } else if (earnings < 200

) {
      recommendations.push('💡 Try working during peak hours (12-2 PM, 7-9 PM)');
    }
  }
  
  // Analyze recent patterns
  if (recentLogs.length >= 3) {
    const negativeDays = recentLogs.filter(log => log.sentiment.mood === 'negative').length;
    
    if (negativeDays >= 2) {
      recommendations.push('⚠️ Multiple tough days detected. Consider a rest day');
    }
  }
  
  // General tips
  recommendations.push('🌤️ Check weather before starting your shift');
  recommendations.push('🗺️ Plan your routes to avoid traffic');
  
  return recommendations.slice(0, 5); // Return top 5
};

module.exports = { generateRecommendations };
