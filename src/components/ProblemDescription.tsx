
import { Problem } from "@/lib/problems";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeEditor from "@/components/CodeEditor";

interface ProblemDescriptionProps {
  problem: Problem;
  selectedLanguage: "javascript" | "python";
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
    <p className="mt-4 text-sm text-foreground/80">{problem.description}</p>
    
    <Separator className="my-6" />

    {problem.examples.map((example, index) => (
      <div key={index} className="mb-4">
        <p className="font-semibold text-sm">Example {index + 1}:</p>
        <Card className="mt-2 bg-background">
          <CardContent className="p-4">
            <p className="font-mono text-xs">
              <strong>Input:</strong> {example.input}
            </p>
            <p className="font-mono text-xs mt-2">
              <strong>Output:</strong> {example.output}
            </p>
            {example.explanation && (
              <p className="font-mono text-xs mt-2">
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
          <li key={index} className="font-mono text-xs">{constraint}</li>
        ))}
      </ul>
    </div>
  </>
);

export default function ProblemDescription({ problem, selectedLanguage }: ProblemDescriptionProps) {
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
        <TabsContent value="solution" className="flex-grow h-0 overflow-hidden">
           {solutionVariant?.solution ? (
              <CodeEditor 
                code={solutionVariant.solution} 
                language={selectedLanguage} 
                readOnly 
              />
            ) : (
              <div className="p-4">No solution available for this language yet.</div>
            )}
        </TabsContent>
        <TabsContent value="submissions" className="p-4 overflow-y-auto flex-grow">
          <p>You have not made any submissions for this problem yet.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
