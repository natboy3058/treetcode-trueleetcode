
import { useState } from "react";
import { Problem, Submission } from "@/lib/problems";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeEditor from "@/components/CodeEditor";
import { formatRelative } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ProblemDescriptionProps {
  problem: Problem;
  selectedLanguage: "javascript" | "python";
  submissions: Submission[];
}

const QuestionContent = ({ problem }: { problem: Problem }) => (
  <>
    <div className="flex items-start justify-between mb-4">
      <h1 className="text-3xl font-bold text-foreground leading-tight">{problem.title}</h1>
      <Badge
        className={`
          shrink-0 ml-4 px-3 py-1 text-sm font-medium
          ${problem.difficulty === "Easy" && "bg-green-600 hover:bg-green-600 text-white"}
          ${problem.difficulty === "Medium" && "bg-yellow-500 hover:bg-yellow-500 text-white"}
          ${problem.difficulty === "Hard" && "bg-red-600 hover:bg-red-600 text-white"}
        `}
      >
        {problem.difficulty}
      </Badge>
    </div>
    
    <div className="mt-6 text-base text-foreground/90 prose prose-base max-w-none [&_p]:mb-4 [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800 [&_em]:text-muted-foreground [&_em]:italic leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{problem.description}</ReactMarkdown>
    </div>
    
    <Separator className="my-8" />

    {problem.examples.map((example, index) => (
      <div key={index} className="mb-6">
        <p className="font-semibold text-lg mb-3 text-foreground">Example {index + 1}:</p>
        <Card className="bg-muted/30 border-muted-foreground/20">
          <CardContent className="p-5">
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-sm text-muted-foreground mb-1">Input:</p>
                <p className="font-mono text-sm bg-background p-3 rounded border break-words">
                  {example.input}
                </p>
              </div>
              <div>
                <p className="font-semibold text-sm text-muted-foreground mb-1">Output:</p>
                <p className="font-mono text-sm bg-background p-3 rounded border break-words">
                  {example.output}
                </p>
              </div>
              {example.explanation && (
                <div>
                  <p className="font-semibold text-sm text-muted-foreground mb-1">Explanation:</p>
                  <p className="text-sm leading-relaxed break-words">
                    {example.explanation}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    ))}
    
    <Separator className="my-8" />

    <div>
      <p className="font-semibold text-lg mb-4 text-foreground">Constraints:</p>
      <ul className="list-disc list-inside space-y-2 pl-4">
        {problem.constraints.map((constraint, index) => (
          <li key={index} className="font-mono text-sm break-words leading-relaxed">{constraint}</li>
        ))}
      </ul>
    </div>
  </>
);

const getStatusClass = (status: Submission["status"]) => {
  switch (status) {
    case "Accepted":
      return "text-green-500";
    case "Wrong Answer":
      return "text-red-500";
    case "Error":
      return "text-yellow-500";
    default:
      return "text-foreground";
  }
};

const SubmissionsContent = ({ submissions }: { submissions: Submission[] }) => {
  if (submissions.length === 0) {
    return <p>You have not made any submissions for this problem yet.</p>;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {submissions.map((submission) => (
        <AccordionItem value={submission.id} key={submission.id}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full pr-4">
              <span className={`font-semibold ${getStatusClass(submission.status)}`}>
                {submission.status}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatRelative(new Date(submission.timestamp), new Date())}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2">
              <div className="text-xs">
                <Badge variant="outline">{submission.language}</Badge>
              </div>
              <div className="h-64 border rounded-md overflow-hidden">
                <CodeEditor
                  code={submission.code}
                  language={submission.language}
                  readOnly
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

const SolutionContent = ({ problem }: { problem: Problem }) => {
  if (!problem.solutionInfo || !problem.codeVariants.some(v => v.solution)) {
    return (
      <div className="p-4 text-muted-foreground h-full flex items-center justify-center">
        Solution is not available for this problem yet.
      </div>
    );
  }

  const defaultTab = problem.codeVariants.find(v => v.language === problem.defaultLanguage && v.solution)
    ? problem.defaultLanguage
    : problem.codeVariants.find(v => v.solution)?.language || "";

  if (!defaultTab) {
     return (
      <div className="p-4 text-muted-foreground h-full flex items-center justify-center">
        Solution is not available for this problem yet.
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 shrink-0">
          {problem.solutionInfo!.approachTitle}
        </h2>
        <Tabs defaultValue={defaultTab} className="w-full flex-grow flex flex-col">
          <TabsList className="border-b rounded-none bg-card justify-start shrink-0 -mx-4 px-4">
            {problem.codeVariants.map((variant) =>
              variant.solution ? (
                <TabsTrigger
                  key={variant.language}
                  value={variant.language}
                  className="capitalize"
                >
                  {variant.language}
                </TabsTrigger>
              ) : null
            )}
          </TabsList>

          {problem.codeVariants.map((variant) =>
            variant.solution ? (
              <TabsContent
                key={variant.language}
                value={variant.language}
                className="mt-4 flex-grow"
              >
                <div className="h-96 mb-6 border rounded-md overflow-hidden">
                  <CodeEditor
                    code={variant.solution}
                    language={variant.language}
                    readOnly
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Time & Space Complexity
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>
                      Time complexity:{" "}
                      <code className="bg-muted font-mono px-2 py-1 rounded-md">
                        {problem.solutionInfo!.timeComplexity}
                      </code>
                    </li>
                    <li>
                      Space complexity:{" "}
                      <code className="bg-muted font-mono px-2 py-1 rounded-md">
                        {problem.solutionInfo!.spaceComplexity}
                      </code>
                    </li>
                  </ul>
                </div>
              </TabsContent>
            ) : null
          )}
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default function ProblemDescription({ problem, selectedLanguage, submissions }: ProblemDescriptionProps) {
  return (
    <div className="h-full bg-card border-r border-border">
      <Tabs defaultValue="question" className="h-full flex flex-col">
        <TabsList className="px-4 border-b rounded-none bg-card justify-start shrink-0 h-12">
          <TabsTrigger value="question" className="px-4 py-2">Question</TabsTrigger>
          <TabsTrigger value="solution" className="px-4 py-2">Solution</TabsTrigger>
          <TabsTrigger value="submissions" className="px-4 py-2">Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="question" className="flex-1 mt-0 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-6">
              <QuestionContent problem={problem} />
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="solution" className="flex-1 mt-0 min-h-0">
          <SolutionContent problem={problem} />
        </TabsContent>
        <TabsContent value="submissions" className="flex-1 mt-0 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-6">
              <SubmissionsContent submissions={submissions} />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
