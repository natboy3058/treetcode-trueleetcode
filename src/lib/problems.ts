
import _ from 'lodash';

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: any[];
  expected: any;
}

export interface CodeVariant {
  language: "javascript" | "python";
  starterCode: string;
  starterFunctionName: string;
  solution?: string;
}

export interface SolutionInfo {
  approachTitle: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  examples: Example[];
  constraints: string[];
  codeVariants: CodeVariant[];
  defaultLanguage: "javascript" | "python";
  testCases: TestCase[];
  solutionInfo?: SolutionInfo;
}

export interface ExecutionResult {
  input: any;
  expected: any;
  actual: any;
  passed: boolean;
  runtime: string;
}

export interface Submission {
  id: string;
  code: string;
  language: "javascript" | "python";
  status: "Accepted" | "Wrong Answer" | "Error";
  timestamp: number;
  results: ExecutionResult[];
}

export const problems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]"
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    defaultLanguage: "javascript",
    codeVariants: [
      {
        language: "javascript",
        starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your code here
};`,
        starterFunctionName: "twoSum",
        solution: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
};`
      },
      {
        language: "python",
        starterCode: `def twoSum(nums, target):
    # Write your code here
    return []
`,
        starterFunctionName: "twoSum",
        solution: `def twoSum(nums, target):
    numMap = {}
    n = len(nums)

    for i in range(n):
        complement = target - nums[i]
        if complement in numMap:
            return [numMap[complement], i]
        numMap[nums[i]] = i

    return []  # No solution found
`
      }
    ],
    testCases: [
        { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
        { input: [[3, 2, 4], 6], expected: [1, 2] },
        { input: [[3, 3], 6], expected: [0, 1] },
        { input: [[-1,-2,-3,-4,-5], -8], expected: [2,4] },
    ],
    solutionInfo: {
        approachTitle: "Hash Map (One-pass)",
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)"
    }
  },
  {
    id: "generate-parentheses",
    title: "Generate Parentheses",
    difficulty: "Medium",
    description:
      "You are given an integer n. Return all well-formed parentheses strings that you can generate with n pairs of parentheses.",
    examples: [
      {
        input: "n = 1",
        output: '["()"]',
      },
      {
        input: "n = 3",
        output: '["((()))","(()())","(())()","()(())","()()()"]',
      },
    ],
    constraints: ["1 <= n <= 8"],
    defaultLanguage: "python",
    codeVariants: [
      {
        language: "javascript",
        starterCode: `/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
    // Write your code here
};`,
        starterFunctionName: "generateParenthesis",
        solution: `/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
    const result = [];
    
    function backtrack(s, left, right) {
        if (s.length === 2 * n) {
            result.push(s);
            return;
        }
        
        if (left < n) {
            backtrack(s + '(', left + 1, right);
        }
        
        if (right < left) {
            backtrack(s + ')', left, right + 1);
        }
    }
    
    backtrack('', 0, 0);
    return result;
};`
      },
      {
        language: "python",
        starterCode: `def generateParenthesis(n):
    # Write your code here
    return []
`,
        starterFunctionName: "generateParenthesis",
        solution: `def generateParenthesis(n):
    ans = []
    def backtrack(S, left, right):
        if len(S) == 2 * n:
            ans.append("".join(S))
            return
        if left < n:
            S.append("(")
            backtrack(S, left + 1, right)
            S.pop()
        if right < left:
            S.append(")")
            backtrack(S, left, right + 1)
            S.pop()
    backtrack([], 0, 0)
    return ans
`
      },
    ],
    testCases: [
      { input: [1], expected: ["()"] },
      { input: [2], expected: ["(())", "()()"] },
      {
        input: [3],
        expected: ["((()))", "(()())", "(())()", "()(())", "()()()"],
      },
      { input: [4], expected: ["(((())))","((()()))","((())())","((()))()","(()(()))","(()()())","(()())()","(())(())","(())()()","()((()))","()(()())","()(())()","()()(())","()()()()"] },
    ],
    solutionInfo: {
      approachTitle: "Backtracking",
      timeComplexity: "O(4^n / n^(3/2))",
      spaceComplexity: "O(n)",
    },
  },
  {
    id: "nba-team-trade",
    title: "NBA Team Trade Execution",
    difficulty: "Easy",
    description: "You are the General Manager of an NBA team. The trade deadline is approaching, and you have just been granted a **Traded Player Exception (TPE)** worth a specific amount of money.\n\nA TPE allows a team to acquire players in a trade without sending back matching salaries. You are in talks with another team and are looking to acquire two of their role players to bolster your roster.\n\nTo make the trade legal under league rules, the combined salaries of the two players you receive must be exactly equal to your TPE.\n\nYour task is to analyze the other team's player salaries and find a pair whose combined salary perfectly matches your available TPE. Return the indices of the two players that make the trade work.\n\n**Data:**\n\nThe `salaries` array corresponds to the 2023-2024 season salary (in USD) for the following players on the Golden State Warriors, in order:\n\n`[Klay Thompson, Draymond Green, Andrew Wiggins, Chris Paul, Kevon Looney, Gary Payton II]`\n\nYou can verify these salaries on **[Spotrac's Golden State Warriors 2023-24 Salary Cap page](https://www.spotrac.com/nba/golden-state-warriors/cap/2023/)**",
    examples: [
      {
        input: "salaries = [43219440, 22222222, 24256786, 30800000, 7500000, 8300000], trade_exception_value = 51519440",
        output: "[0, 5]",
        explanation: "The salary of Klay Thompson (index 0) is $43,219,440. The salary of Gary Payton II (index 5) is $8,300,000. Their combined salary is 43219440 + 8300000 = 51519440, which is a perfect match for the trade exception."
      },
      {
        input: "salaries = [43219440, 22222222, 24256786, 30800000, 7500000, 8300000], trade_exception_value = 29722222",
        output: "[1, 4]",
        explanation: "The salary of Draymond Green (index 1) is $22,222,222. The salary of Kevon Looney (index 4) is $7,500,000. Their sum is 22222222 + 7500000 = 29722222."
      }
    ],
    constraints: [
      "2 <= salaries.length <= 15",
      "1000000 <= salaries[i] <= 50000000", 
      "2000000 <= trade_exception_value <= 100000000",
      "All inputs are 64-bit integers.",
      "Only one valid answer exists."
    ],
    defaultLanguage: "javascript",
    codeVariants: [
      {
        language: "javascript",
        starterCode: `/**
 * @param {number[]} salaries
 * @param {number} trade_exception_value
 * @return {number[]}
 */
var nbaTeamTrade = function(salaries, trade_exception_value) {
    // Write your code here
};`,
        starterFunctionName: "nbaTeamTrade",
        solution: `/**
 * @param {number[]} salaries
 * @param {number} trade_exception_value
 * @return {number[]}
 */
var nbaTeamTrade = function(salaries, trade_exception_value) {
    const map = new Map();
    for (let i = 0; i < salaries.length; i++) {
        const complement = trade_exception_value - salaries[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(salaries[i], i);
    }
};`
      },
      {
        language: "python",
        starterCode: `def nbaTeamTrade(salaries, trade_exception_value):
    # Write your code here
    return []
`,
        starterFunctionName: "nbaTeamTrade",
        solution: `def nbaTeamTrade(salaries, trade_exception_value):
    salaryMap = {}
    n = len(salaries)

    for i in range(n):
        complement = trade_exception_value - salaries[i]
        if complement in salaryMap:
            return [salaryMap[complement], i]
        salaryMap[salaries[i]] = i

    return []  # No solution found
`
      }
    ],
    testCases: [
      { input: [[43219440, 22222222, 24256786, 30800000, 7500000, 8300000], 51519440], expected: [0, 5] },
      { input: [[43219440, 22222222, 24256786, 30800000, 7500000, 8300000], 29722222], expected: [1, 4] },
      { input: [[10000000, 15000000, 5000000], 15000000], expected: [0, 2] },
      { input: [[20000000, 30000000, 10000000, 18000000], 28000000], expected: [2, 3] },
      { input: [[45000000, 5000000, 12000000, 23000000, 6000000, 11000000], 51000000], expected: [0, 4] },
      { input: [[48000000, 32000000, 14000000, 21000000, 4000000, 9000000], 52000000], expected: [0, 4] },
      { input: [[10000000, 12000000, 30000000, 25000000, 15000000], 42000000], expected: [1, 2] },
      { input: [[5000000, 15000000, 25000000, 35000000, 45000000, 8000000, 12000000, 18000000, 22000000, 28000000, 32000000, 38000000, 42000000, 48000000, 2000000], 50000000], expected: [1, 3] },
      { input: [[12345678, 23456789, 17654322, 34567890], 41111111], expected: [1, 2] },
      { input: [[15000000, 5000000, 10000000, 20000000, 25000000], 40000000], expected: [0, 4] },
      { input: [[5000000, 10000000, 40000000, 15000000, 20000000], 50000000], expected: [1, 2] },
      { input: [[10000000, 11000000], 21000000], expected: [0, 1] }
    ],
    solutionInfo: {
      approachTitle: "Hash Map (One-pass)",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)"
    }
  },
  {
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
  }
];

export const getProblem = (id: string) => {
  return problems.find((p) => p.id === id);
};

export const getProblems = () => {
    return problems;
}

// Solution comparison needs to be flexible for arrays where order doesn't matter.
export const compareSolutions = (userResult: any, expectedResult: any) => {
  if (Array.isArray(userResult) && Array.isArray(expectedResult)) {
    // For this specific problem, the order of parentheses combinations doesn't matter.
    if (userResult.every(item => typeof item === 'string')) {
       return _.isEqual(userResult.sort(), expectedResult.sort());
    }
    // For problems like Two Sum, order might matter.
    return _.isEqual(userResult.sort(), expectedResult.sort());
  }
  return _.isEqual(userResult, expectedResult);
};
