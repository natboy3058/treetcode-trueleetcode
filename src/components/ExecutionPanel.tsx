
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TestCase } from "@/lib/problems";

interface ExecutionResult {
    input: any;
    expected: any;
    actual: any;
    passed: boolean;
    runtime: string;
}

interface ExecutionPanelProps {
  testCases: TestCase[];
  results: ExecutionResult[];
  onRun: () => void;
  onSubmit: () => void;
  isExecuting: boolean;
}

export default function ExecutionPanel({ testCases, results, onRun, onSubmit, isExecuting }: ExecutionPanelProps) {
  const [activeTab, setActiveTab] = useState("testcase");

  if (results.length > 0 && activeTab !== "result") {
      setActiveTab("result");
  } else if (results.length === 0 && activeTab !== "testcase") {
      setActiveTab("testcase");
  }

  return (
    <div className="flex flex-col h-full bg-card">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <TabsList className="bg-card">
          <TabsTrigger value="testcase">Testcases</TabsTrigger>
          <TabsTrigger value="result" disabled={results.length === 0}>Result</TabsTrigger>
        </TabsList>
        <TabsContent value="testcase" className="flex-grow overflow-y-auto p-2">
          {testCases.map((tc, index) => (
             <div key={index} className="mb-2">
              <p className="font-semibold text-sm">Case {index + 1}</p>
              <Card className="mt-1 bg-background">
                <CardContent className="p-2 text-xs font-mono">
                  Input: {JSON.stringify(tc.input)}
                </CardContent>
              </Card>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="result" className="flex-grow overflow-y-auto p-2">
           {results.map((result, index) => (
            <Card key={index} className={`mb-2 border-l-4 ${result.passed ? 'border-green-500' : 'border-red-500'}`}>
              <CardContent className="p-2">
                <p className={`font-semibold text-sm ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
                  Case {index + 1}: {result.passed ? 'Passed' : 'Failed'}
                </p>
                <div className="text-xs font-mono mt-2 bg-background p-2 rounded space-y-1">
                  <p><strong>Input:</strong> {JSON.stringify(result.input)}</p>
                  <p><strong>Expected:</strong> {JSON.stringify(result.expected)}</p>
                  <p><strong>Got:</strong> {JSON.stringify(result.actual)}</p>
                </div>
              </CardContent>
            </Card>
           ))}
        </TabsContent>
      </Tabs>
      <div className="p-2 border-t border-border flex justify-end items-center gap-2">
        <Button variant="outline" onClick={onRun} disabled={isExecuting}>
          {isExecuting ? 'Running...' : 'Run'}
        </Button>
        <Button className="bg-green-600 hover:bg-green-700 text-primary-foreground" onClick={onSubmit} disabled={isExecuting}>
          {isExecuting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </div>
  );
}
