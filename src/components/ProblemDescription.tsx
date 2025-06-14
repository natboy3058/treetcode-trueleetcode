
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

interface ProblemDescriptionProps {
  problem: Problem;
  selectedLanguage: "javascript" | "python";
  submissions: Submission[];
}

const QuestionContent = ({ problem }: { problem: Problem }) => (
  <>
    <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
    <Badge
      className={`
        ${problem.difficulty === "Easy" && "bg-green-600 hover:bg-green-600 text-primary-foreground"}
        ${problem.difficulty === "Medium" && "bg-yellow-500 hover:bg-yellow-500 text-primary-foreground"}
        ${problem.difficulty === "Hard" && "bg-red-600 hover:bg-red-600 text-primary-foreground"}
      `}
    >
      {problem.difficulty}
    </Badge>
    <p className="mt-4 text-sm text-foreground/80 break-words">{problem.description}</p>
    
    <Separator className="my-6" />

    {problem.examples.map((example, index) => (
      <div key={index} className="mb-4">
        <p className="font-semibold text-sm">Example {index + 1}:</p>
        <Card className="mt-2 bg-background">
          <CardContent className="p-4">
            <p className="font-mono text-xs break-words">
              <strong>Input:</strong> {example.input}
            </p>
            <p className="font-mono text-xs mt-2 break-words">
              <strong>Output:</strong> {example.output}
            </p>
            {example.explanation && (
              <p className="font-mono text-xs mt-2 break-words">
                <strong>Explanation:</strong> {example.explanation}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    ))}
    
    <Separator className="my-6" />

    <div>
      <p className="font-semibold text-sm">Constraints:</p>
      <ul className="list-disc list-inside mt-2 space-y-1">
        {problem.constraints.map((constraint, index) => (
          <li key={index} className="font-mono text-xs break-words">{constraint}</li>
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


export default function ProblemDescription({ problem, selectedLanguage, submissions }: ProblemDescriptionProps) {
  const solutionVariant = problem.codeVariants.find(v => v.language === selectedLanguage);
  
  return (
    <div className="h-full flex flex-col bg-card">
      <Tabs defaultValue="question" className="w-full flex-grow flex flex-col">
        <TabsList className="px-2 border-b rounded-none bg-card justify-start shrink-0">
          <TabsTrigger value="question">Question</TabsTrigger>
          <TabsTrigger value="solution">Solution</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>
        <TabsContent value="question" className="p-4 overflow-y-auto flex-grow">
          <QuestionContent problem={problem} />
        </TabsContent>
        <TabsContent value="solution" className="p-4 overflow-y-auto flex-grow">
           {solutionVariant?.solution && problem.solutionInfo ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">{problem.solutionInfo.approachTitle}</h2>
                <div className="h-96 mb-6 border rounded-md overflow-hidden">
                   <CodeEditor 
                    code={solutionVariant.solution} 
                    language={selectedLanguage} 
                    readOnly 
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Time & Space Complexity</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Time complexity: <code className="bg-muted font-mono px-2 py-1 rounded-md">{problem.solutionInfo.timeComplexity}</code></li>
                    <li>Space complexity: <code className="bg-muted font-mono px-2 py-1 rounded-md">{problem.solutionInfo.spaceComplexity}</code></li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-4 text-muted-foreground">
                {solutionVariant?.solution ? 'Solution details are not available for this problem yet.' : 'No solution available for this language yet.'}
              </div>
            )}
        </TabsContent>
        <TabsContent value="submissions" className="p-4 overflow-y-auto flex-grow">
          <SubmissionsContent submissions={submissions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
