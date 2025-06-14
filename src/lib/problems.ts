import _ from 'lodash';

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: any;
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
      { input: 1, expected: ["()"] },
      { input: 2, expected: ["(())", "()()"] },
      {
        input: 3,
        expected: ["((()))", "(()())", "(())()", "()(())", "()()()"],
      },
      { input: 4, expected: ["(((())))","((()()))","((())())","((()))()","(()(()))","(()()())","(()())()","(())(())","(())()()","()((()))","()(()())","()(())()","()()(())","()()()()"] },
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

// Solution comparison needs to be flexible for arrays where order doesn't matter.
export const compareSolutions = (userResult: any, expectedResult: any) => {
  if (Array.isArray(userResult) && Array.isArray(expectedResult)) {
    // For this specific problem, the order of parentheses combinations doesn't matter.
    return _.isEqual(userResult.sort(), expectedResult.sort());
  }
  return _.isEqual(userResult, expectedResult);
};
