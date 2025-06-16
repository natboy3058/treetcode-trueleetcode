
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProblems } from "@/lib/problems";
import EmailSignup from "@/components/EmailSignup";

const problems = getProblems();

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-600 hover:bg-green-600 text-white";
    case "Medium":
      return "bg-yellow-500 hover:bg-yellow-500 text-white";
    case "Hard":
      return "bg-red-600 hover:bg-red-600 text-white";
    default:
      return "bg-gray-500 hover:bg-gray-500 text-white";
  }
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Welcome to Treetcode
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Solve Leetcode-style coding problems based on real-life data and scenarios. 
            Challenge yourself with problems that mirror actual industry use cases.
          </p>
          <EmailSignup />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {problems.map((problem) => (
            <Link key={problem.id} to={`/problems/${problem.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg font-semibold leading-tight">
                      {problem.title}
                    </CardTitle>
                    <Badge className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm line-clamp-3">
                    {problem.description.split('\n')[0].replace(/\*([^*]+)\*/g, '$1')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{problem.testCases.length} test cases</span>
                    <span className="capitalize">{problem.defaultLanguage}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground border-t pt-8">
          <p>
            Built by{" "}
            <a 
              href="https://nat3058.github.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 underline font-medium"
            >
              Nathan N.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
