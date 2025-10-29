import { ASTNode } from "@/lib/parser";
import { Card } from "@/components/ui/card";
import { Network } from "lucide-react";

interface TreeVisualizationProps {
  tree: ASTNode;
}

const TreeNode = ({ node, depth = 0 }: { node: ASTNode; depth?: number }) => {
  const isLeaf = node.type === 'number';
  const indent = depth * 40;
  
  return (
    <div className="relative" style={{ marginLeft: `${indent}px` }}>
      <div className="flex items-center gap-2 mb-2">
        {depth > 0 && (
          <div className="absolute -left-6 top-3 w-6 h-0.5 bg-primary/30" />
        )}
        <div 
          className={`
            px-4 py-2 rounded-lg border-2 font-mono text-sm
            ${isLeaf 
              ? 'bg-success/10 border-success text-success' 
              : 'bg-accent/10 border-accent text-accent'
            }
          `}
        >
          {isLeaf ? (
            <span>{typeof node.value === 'number' || typeof node.value === 'string' ? node.value : 'value'}</span>
          ) : (
            <span className="font-bold">{node.operator}</span>
          )}
        </div>
      </div>
      
      {!isLeaf && (
        <div className="space-y-2">
          {node.left && (
            <div className="relative">
              <div className="absolute left-0 top-0 w-0.5 h-full bg-primary/20" />
              <TreeNode node={node.left} depth={depth + 1} />
            </div>
          )}
          {node.right && (
            <div className="relative">
              <div className="absolute left-0 top-0 w-0.5 h-full bg-primary/20" />
              <TreeNode node={node.right} depth={depth + 1} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const TreeVisualization = ({ tree }: TreeVisualizationProps) => {
  return (
    <Card className="p-6 bg-code-bg border-code-border overflow-x-auto">
      <div className="flex items-center gap-2 mb-6">
        <Network className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Visual Parse Tree</h3>
      </div>
      <div className="min-w-max">
        <TreeNode node={tree} />
      </div>
      <div className="mt-6 pt-4 border-t border-border flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-accent/10 border-2 border-accent" />
          <span className="text-muted-foreground">Operators</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success/10 border-2 border-success" />
          <span className="text-muted-foreground">Numbers</span>
        </div>
      </div>
    </Card>
  );
};
