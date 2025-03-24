
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Trophy, Medal, Clock, User } from "lucide-react";
import { QuizResult } from "@/context/QuizContext";

interface LeaderboardTableProps {
  results: QuizResult[];
  title?: string;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  results,
  title = "Overall Leaderboard",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Sort results by score and time taken (in case of tie)
  const sortedResults = [...results].sort((a, b) => {
    // First sort by score percentage (descending)
    const scoreA = (a.score / a.maxScore) * 100;
    const scoreB = (b.score / b.maxScore) * 100;
    
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    
    // If scores are equal, sort by time taken (ascending)
    return a.timeTaken - b.timeTaken;
  });

  // Filter results based on search term
  const filteredResults = sortedResults.filter((result) =>
    result.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format time (seconds) as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="glass-panel rounded-lg animate-fade-in">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="relative mt-4 max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search participants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-center">Rank</TableHead>
              <TableHead>Participant</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead className="text-center">Time</TableHead>
              <TableHead className="text-right">Completed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              filteredResults.map((result, index) => (
                <TableRow key={result.id} className="hover-scale">
                  <TableCell className="text-center font-medium">
                    {index === 0 ? (
                      <Trophy className="h-5 w-5 text-amber-500 mx-auto" />
                    ) : index === 1 ? (
                      <Medal className="h-5 w-5 text-slate-400 mx-auto" />
                    ) : index === 2 ? (
                      <Medal className="h-5 w-5 text-amber-700 mx-auto" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      {result.username}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={
                        result.score / result.maxScore >= 0.7
                          ? "bg-green-500/10 text-green-700 hover:bg-green-500/10"
                          : result.score / result.maxScore >= 0.4
                          ? "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10"
                          : "bg-red-500/10 text-red-700 hover:bg-red-500/10"
                      }
                    >
                      {result.score}/{result.maxScore}{" "}
                      {`(${Math.round((result.score / result.maxScore) * 100)}%)`}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(result.timeTaken)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {new Date(result.completedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
