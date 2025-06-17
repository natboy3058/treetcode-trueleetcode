
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { problemManifests } from "@/data/problems";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmailSignup from "@/components/EmailSignup";

export default function Index() {
  const problems = problemManifests; // No need for useState/useEffect, it's a static import

  const getDifficultyClass = (difficulty: "Easy" | "Medium" | "Hard") => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-600 hover:bg-green-700";
      case "Medium":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "Hard":
        return "bg-red-600 hover:bg-red-700";
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Problems</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60%]">Title</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell>
                    <Link
                      to={`/problems/${problem.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {problem.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getDifficultyClass(problem.difficulty)} text-primary-foreground`}
                    >
                      {problem.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    -
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <EmailSignup />
      </div>
      
      {/*
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          Built by{" "}
          <a 
            href="https://nat3058.github.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Nathan N.
          </a>
        </p>
      </div>
      */}
     <footer className="border-t pt-6">
      <div className="container flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
        <p className="text-sm text-muted-foreground">
          {/* {new Date().getFullYear()} Treetcode. All rights reserved. */}
        </p>
        <p className="text-sm text-muted-foreground">
          Built by{" "}
          <a
            href="https://nat3058.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-500 hover:text-blue-700 transition-colors"
          >
            <span>Nathan N.</span> <span className="text-xs">↗</span>
          </a>
        </p>
      </div>
     </footer>
    </div>
  );
}
