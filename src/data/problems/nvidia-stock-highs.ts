
import { Problem } from '@/lib/problems';

export const nvidiaStockHighsProblem: Problem = {
  id: "nvidia-stock-highs",
  title: "NVIDIA and the AI Boom: The Next All-Time High",
  difficulty: "Medium",
  description: "*You are a retail investor who, in early 2024, decided to go all-in on the AI revolution by investing in NVIDIA (NVDA). You've watched with a mix of exhilaration and terror as the stock price has soared to unprecedented levels. Every day, you're glued to the charts, living and breathing the volatility.*\n\n*To bring some quantitative rigor to your emotional rollercoaster, you decide to analyze the stock's recent performance. For any given trading day, you want to calculate exactly how many days you had to wait for the stock to close at a new, higher price. This \"Time-to-New-High\" metric is your way of measuring the momentum of this historic bull run.*\n\n### Problem Description\n\nYou are given an array of floats `prices`, representing the actual, split-adjusted closing prices of NVIDIA (NVDA) stock on consecutive trading days.\n\nYou must return an array `answer` of the same size, where `answer[i]` is the number of days you must wait after day `i` to see a day with a strictly higher closing price. If the stock never reaches a new high in the given dataset, `answer[i]` should be `0`.\n\n### Data Attribution\n\nThe data used in this problem is the actual, historical, split-adjusted closing price for NVIDIA Corp. (NVDA) and is a matter of public financial record.\n\n**Source Link:** [Yahoo Finance NVDA History (May 28 - June 10, 2024)](https://finance.yahoo.com/quote/NVDA/history?period1=1716854400&period2=1718064000)",
  examples: [
    {
      input: "prices = [113.90, 114.83, 110.50, 109.63, 115.00, 116.44, 122.44, 120.99, 120.89, 121.79]",
      output: "[1, 3, 2, 1, 1, 1, 0, 2, 1, 0]",
      explanation: "For answer[1]: The price on day 1 (114.83) is followed by a higher price on day 4 (115.00). The wait is 4 - 1 = 3 days. For answer[4]: The price on day 4 (115.00) is followed by a higher price the very next day (116.44). The wait is 5 - 4 = 1 day. For answer[6]: The price on day 6 (122.44) is the highest in this period. No future day has a higher price, so the wait is 0."
    }
  ],
  constraints: [
    "1 <= prices.length <= 10^5",
    "0.0 <= prices[i] <= 2000.0"
  ],
  defaultLanguage: "javascript",
  codeVariants: [
    {
      language: "javascript",
      starterCode: `/**
 * @param {number[]} prices
 * @return {number[]}
 */
var dailyTemperatures = function(prices) {
    // Write your code here
};`,
      starterFunctionName: "dailyTemperatures",
      solution: `/**
 * @param {number[]} prices
 * @return {number[]}
 */
var dailyTemperatures = function(prices) {
    const n = prices.length;
    const answer = new Array(n).fill(0);
    const stack = [];
    
    for (let i = 0; i < n; i++) {
        while (stack.length > 0 && prices[i] > prices[stack[stack.length - 1]]) {
            const prevIndex = stack.pop();
            answer[prevIndex] = i - prevIndex;
        }
        stack.push(i);
    }
    
    return answer;
};`
    },
    {
      language: "python",
      starterCode: `def dailyTemperatures(prices):
    # Write your code here
    return []
`,
      starterFunctionName: "dailyTemperatures",
      solution: `def dailyTemperatures(prices):
    n = len(prices)
    answer = [0] * n
    stack = []
    
    for i in range(n):
        while stack and prices[i] > prices[stack[-1]]:
            prev_index = stack.pop()
            answer[prev_index] = i - prev_index
        stack.append(i)
    
    return answer
`
    }
  ],
  testCases: [
    { input: [[113.90, 114.83, 110.50, 109.63, 115.00, 116.44, 122.44, 120.99, 120.89, 121.79]], expected: [1, 3, 2, 1, 1, 1, 0, 2, 1, 0] },
    { input: [[113.90, 114.83, 110.50, 109.63]], expected: [1, 0, 0, 0] },
    { input: [[109.63, 115.00, 116.44, 122.44]], expected: [1, 1, 1, 0] },
    { input: [[122.44, 120.99, 120.89, 121.79]], expected: [0, 2, 1, 0] },
    { input: [[115.00]], expected: [0] },
    { input: [[116.44, 122.44, 120.99, 120.89]], expected: [1, 0, 0, 0] },
    { input: [[120.99, 120.89, 121.79]], expected: [2, 1, 0] }
  ],
  solutionInfo: {
    approachTitle: "Monotonic Stack",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)"
  }
};
