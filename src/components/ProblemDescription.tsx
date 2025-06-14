
import { Problem } from "@/lib/problems";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProblemDescriptionProps {
  problem: Problem;
}

export default function ProblemDescription({ problem }: ProblemDescriptionProps) {
  return (
    <div className="p-4 h-full overflow-y-auto bg-card">
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
    </div>
  );
}
