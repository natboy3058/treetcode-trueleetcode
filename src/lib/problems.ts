
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
