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
      },
      {
        language: "python",
        starterCode: `def generateParenthesis(n):
    # Write your code here
    return []
`,
        starterFunctionName: "generateParenthesis",
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
