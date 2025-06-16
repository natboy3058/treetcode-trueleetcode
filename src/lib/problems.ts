
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
