import { Button } from "@/components/ui/button";
import { Download, FileJson } from "lucide-react";
import { ParseResult, Token } from "@/lib/parser";
import { useToast } from "@/hooks/use-toast";

interface ExportResultsProps {
  expression: string;
  result: ParseResult;
  tokens: Token[];
  evaluation: number | null;
}

export const ExportResults = ({ expression, result, tokens, evaluation }: ExportResultsProps) => {
  const { toast } = useToast();

  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      expression,
      tokens: tokens.map(t => ({ type: t.type, value: t.value, position: t.position })),
      parseResult: {
        success: result.success,
        tree: result.tree || null,
        errors: result.errors || null
      },
      evaluation: evaluation !== null ? evaluation : "N/A"
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parse-result-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Parse results downloaded as JSON",
    });
  };

  return (
    <Button 
      onClick={handleExport} 
      variant="outline"
      className="gap-2"
    >
      <FileJson className="w-4 h-4" />
      Export Results
      <Download className="w-4 h-4" />
    </Button>
  );
};
