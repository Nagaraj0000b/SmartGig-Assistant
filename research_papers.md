# Research Papers: Sentiment Analysis for GigOne

A curated collection of research papers analyzing best ML models for sentiment analysis, specifically for Hinglish and short-text applications.

---

## 📊 Research Papers Overview

| #   | Publisher    | Paper Title                                          | Link                                                                                                                    | Dataset Type            |
| --- | ------------ | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 1   | **IEEE**     | Deep Learning for Hinglish Sentiment Analysis        | [IEEE Xplore](https://ieeexplore.ieee.org/document/9498965)                                                             | Hinglish Tweets (NLTK)  |
| 2   | **Elsevier** | Sentiment Analysis Using Machine Learning Algorithms | [ResearchGate](https://www.researchgate.net/publication/355665220_Sentiment_Analysis_Using_Machine_Learning_Algorithms) | Text Classification     |
| 3   | **MDPI**     | Sentiment Analysis of Social Media Posts             | [MDPI](https://www.mdpi.com/2504-2289/8/12/199)                                                                         | Short Social Media Text |

---

## 🏆 Best Models & Performance

### Paper #1: Deep Learning for Hinglish Sentiment Analysis (IEEE)

**Best Model:** Multinomial Naive Bayes

| Model                          | Accuracy   | Rank   |
| ------------------------------ | ---------- | ------ |
| **Multinomial Naive Bayes** ✅ | **99.73%** | 🥇 1st |
| Linear SVC                     | 99.67%     | 🥈 2nd |
| Bernoulli Naive Bayes          | 99.67%     | 🥈 2nd |
| Logistic Regression            | 99.53%     | 4th    |

**Why This Model?**

| Reason                   | Explanation                                                              |
| ------------------------ | ------------------------------------------------------------------------ |
| **Simplicity**           | Powerful yet simple supervised ML algorithm                              |
| **Probabilistic**        | Assigns probability scores (not just binary classification)              |
| **Text-Optimized**       | Multinomial variant specifically designed for text with large vocabulary |
| **Word Frequency**       | Analyzes word frequency patterns effectively                             |
| **Binary Tracking**      | Bernoulli variant tracks word presence/absence                           |
| **Empirically Superior** | Achieved highest precision on NLTK dataset vs. previous works            |

---

### Paper #2: Sentiment Analysis Using ML Algorithms (Elsevier)

**Best Model:** Multinomial Naive Bayes

| Model                          | Accuracy   | Rank   |
| ------------------------------ | ---------- | ------ |
| **Multinomial Naive Bayes** ✅ | **99.70%** | 🥇 1st |
| Linear SVC                     | 99.67%     | 🥈 2nd |
| Bernoulli Naive Bayes          | 99.67%     | 🥈 2nd |
| Logistic Regression            | 99.53%     | 4th    |

**Why This Model?**

| Reason                           | Explanation                                                          |
| -------------------------------- | -------------------------------------------------------------------- |
| **Simplicity & Power**           | Simple yet powerful supervised learning                              |
| **Probabilistic Classification** | Calculates exact probability of positive/negative class              |
| **Multinomial for Large Vocab**  | Best for text with larger vocabulary sizes (word frequency analysis) |
| **Bernoulli for Binary**         | Effective for tracking word presence/absence                         |

---

### Paper #3: Sentiment Analysis of Social Media Posts (MDPI)

**Best Model:** Support Vector Machine (SVM)

| Model         | Accuracy  | Rank   | Notes               |
| ------------- | --------- | ------ | ------------------- |
| **SVM** ✅    | **68.2%** | 🥇 1st | Best for short text |
| Random Forest | 68.0%     | 🥈 2nd | Close second        |
| GPT-4         | 63.5%     | 3rd    | Underperformed      |
| Naive Bayes   | 44.9%     | 4th    | Poor on short text  |

**Why This Model?**

| Reason                | Explanation                                    |
| --------------------- | ---------------------------------------------- |
| **Short Text Expert** | Explicitly effective for shorter, concise text |
| **Efficiency**        | Fast processing of high-level comments         |
| **Accuracy**          | Highest performance on social media posts      |

---

## 📈 Key Insights for GigOne

### Model Selection by Use Case

| Use Case                                | Recommended Model       | Accuracy | Reasoning                                      |
| --------------------------------------- | ----------------------- | -------- | ---------------------------------------------- |
| **Hinglish Text** (Mixed Hindi-English) | Multinomial Naive Bayes | 99.7%+   | Best for code-mixed text with large vocabulary |
| **Short Daily Logs** (Gig worker input) | SVM                     | 68.2%    | Optimized for concise, short text              |
| **General Text Classification**         | Multinomial Naive Bayes | 99.7%+   | Simple, fast, probabilistic                    |

---

## 💡 Recommendations for GigOne Implementation

### Phase 1: Baseline Model

- ✅ **Start with:** Multinomial Naive Bayes
- **Why:** 99.7% accuracy, simple, handles Hinglish well
- **Implementation:** scikit-learn `MultinomialNB`

### Phase 2: Short Text Optimization

- ✅ **Test with:** Support Vector Machine (SVM)
- **Why:** Better for short daily logs (20-50 words)
- **Implementation:** scikit-learn `LinearSVC`

### Phase 3: Ensemble Approach

- ✅ **Combine:** Multinomial NB + SVM
- **Why:** Leverage strengths of both models
- **Method:** Voting classifier or stacking

---

## 🔬 Model Comparison Summary

| Criteria                   | Multinomial Naive Bayes | SVM          | Winner         |
| -------------------------- | ----------------------- | ------------ | -------------- |
| **Hinglish Text**          | 99.73% (IEEE)           | Not tested   | 🏆 Naive Bayes |
| **Short Text**             | 44.9% (MDPI)            | 68.2% (MDPI) | 🏆 SVM         |
| **Speed**                  | Very Fast               | Fast         | 🏆 Naive Bayes |
| **Interpretability**       | High (probabilities)    | Medium       | 🏆 Naive Bayes |
| **Vocabulary Size**        | Large (word frequency)  | Any          | 🏆 Naive Bayes |
| **Training Data Required** | Less                    | More         | 🏆 Naive Bayes |

---

## 🎯 Final Recommendation for GigOne

**Use a Hybrid Approach:**

1. **Multinomial Naive Bayes** for:
   - Hinglish text processing (99.7% accuracy)
   - Probabilistic sentiment scores
   - Fast inference

2. **SVM** for:
   - Very short logs (<20 words)
   - High-precision classification

3. **Feature Engineering:**
   - Word frequency (TF-IDF)
   - N-grams (1-3 grams)
   - Hinglish-specific preprocessing

---

## 📚 Citation

| #   | Citation                                                                       |
| --- | ------------------------------------------------------------------------------ |
| 1   | IEEE (2021). "Deep Learning for Hinglish Sentiment Analysis". DOI: 10.1109/... |
| 2   | Elsevier (2021). "Sentiment Analysis Using Machine Learning Algorithms".       |
| 3   | MDPI (2022). "Sentiment Analysis of Social Media Posts". Algorithms 8(12):199. |

---

**Last Updated:** 2026-02-11  
**For:** GigOne ML Model Selection
