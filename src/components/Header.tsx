
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/treetcode-logo.png" 
            alt="Treetcode Logo" 
            className="h-8 w-8"
          />
          <div className="flex flex-col">
            <span className="font-bold text-xl text-foreground">Treetcode</span>
            <span className="text-xs text-muted-foreground -mt-1">Leetcode but with true real life data</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
