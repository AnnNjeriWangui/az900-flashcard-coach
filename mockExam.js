// mockExam.js

export class MockExamSimulator {
  constructor(questions, timeLimitMinutes = 30) {
    this.questions = questions; // Array of { id, domain, question, options, answerIndex, explanation }
    this.timeLimit = timeLimitMinutes * 60; // in seconds
    this.timer = null;
    this.timeRemaining = this.timeLimit;
    this.userAnswers = {}; // { questionId: selectedOptionIndex }
    this.currentIndex = 0;
  }

  startExam(onTick, onComplete) {
    this.timeRemaining = this.timeLimit;
    this.userAnswers = {};
    this.currentIndex = 0;

    this.timer = setInterval(() => {
      this.timeRemaining--;
      if (onTick) onTick(this.formatTime(this.timeRemaining));

      if (this.timeRemaining <= 0) {
        this.stopExam();
        if (onComplete) onComplete(this.generateScorecard());
      }
    }, 1000);
  }

  stopExam() {
    if (this.timer) clearInterval(this.timer);
  }

  selectAnswer(questionId, optionIndex) {
    this.userAnswers[questionId] = optionIndex;
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  generateScorecard() {
    let correctCount = 0;
    const domainStats = {}; // { domainName: { total: 0, correct: 0 } }

    this.questions.forEach((q) => {
      if (!domainStats[q.domain]) {
        domainStats[q.domain] = { total: 0, correct: 0 };
      }
      domainStats[q.domain].total++;

      const isCorrect = this.userAnswers[q.id] === q.answerIndex;
      if (isCorrect) {
        correctCount++;
        domainStats[q.domain].correct++;
      }
    });

    const scaledScore = Math.round((correctCount / this.questions.length) * 1000);
    const passed = scaledScore >= 700;

    const domainBreakdown = {};
    for (const [domain, stats] of Object.entries(domainStats)) {
      domainBreakdown[domain] = {
        scorePercent: Math.round((stats.correct / stats.total) * 100),
        correct: stats.correct,
        total: stats.total
      };
    }

    return {
      score: scaledScore,
      passed,
      totalQuestions: this.questions.length,
      correctCount,
      domainBreakdown
    };
  }
}
