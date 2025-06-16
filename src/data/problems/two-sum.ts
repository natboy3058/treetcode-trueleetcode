
import { Problem } from '@/lib/problems';

export const twoSumProblem: Problem = {
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
};
