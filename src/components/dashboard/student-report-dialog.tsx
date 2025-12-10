"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    BrainCircuit,
    Sparkles,
    ShieldCheck,
    Info
} from "lucide-react";
import { MOCK_STUDENT_REPORTS, StudentReport, AdaptivePathModule, ExplainabilityLog } from "@/lib/teacher-data";
import { useCallback, useState, useMemo } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    MarkerType,
    Handle,
    Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

// --- Custom Node Implementation ---
const CustomNode = ({ data }: { data: { label: string; status: string; type: string; onDetailsClick: () => void } }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 border-green-300 text-green-800';
            case 'in-progress': return 'bg-blue-100 border-blue-300 text-blue-800';
            case 'upcoming': return 'bg-gray-100 border-gray-300 text-gray-500';
            case 'skipped': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            default: return 'bg-white border-gray-300';
        }
    };

    const getBadgeColor = (type: string) => {
        switch (type) {
            case 'challenge': return 'bg-purple-100 text-purple-700';
            case 'support': return 'bg-orange-100 text-orange-700';
            default: return 'bg-blue-50 text-blue-700';
        }
    };

    return (
        <div className={`px-4 py-3 rounded-lg border-2 shadow-sm min-w-[200px] ${getStatusColor(data.status)}`}>
            <Handle type="target" position={Position.Top} className="w-3 h-3 bg-gray-400" />

            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <Badge variant="outline" className={`text-[10px] px-1 py-0 ${getBadgeColor(data.type)}`}>
                        {data.type.toUpperCase()}
                    </Badge>
                    {data.status === 'completed' && (
                        <span className="text-[10px] font-bold">100%</span>
                    )}
                </div>

                <span className="font-bold text-sm leading-tight">{data.label}</span>

                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px] mt-1 w-full border border-black/10 hover:bg-black/5"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent drag
                        data.onDetailsClick();
                    }}
                >
                    View Details <Info className="h-3 w-3 ml-1" />
                </Button>
            </div>

            <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-gray-400" />
        </div>
    );
};

const nodeTypes = {
    custom: CustomNode,
};

// --- Dialog Component ---

interface StudentReportDialogProps {
    studentId: string;
    studentName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function StudentReportDialog({
    studentId,
    studentName,
    open,
    onOpenChange
}: StudentReportDialogProps) {
    const report: StudentReport | undefined = MOCK_STUDENT_REPORTS[studentId];
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

    // --- Data Transformation for React Flow ---
    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
        if (!report) return { nodes: [], edges: [] };

        const flowNodes: Node[] = [];
        const flowEdges: Edge[] = [];
        let yPos = 50;
        const xPos = 250;

        report.path.forEach((module, index) => {
            // Find log if any associated with this module (usually 'adapted' or 'assigned')
            // For simplicity in this mock, we link logs to modules if moduleId matches
            const relatedLog = report.explainabilityLogs.find(l => l.moduleId === module.id);

            flowNodes.push({
                id: module.id,
                type: 'custom',
                position: { x: xPos + (module.type === 'support' ? -150 : module.type === 'challenge' ? 150 : 0), y: yPos },
                data: {
                    label: module.title,
                    status: module.status,
                    type: module.type,
                    onDetailsClick: () => {
                        if (relatedLog) setSelectedLogId(relatedLog.id);
                        else setSelectedLogId(null);
                    }
                },
            });

            if (index > 0) {
                flowEdges.push({
                    id: `e-${index - 1}-${index}`,
                    source: report.path[index - 1].id,
                    target: module.id,
                    type: 'smoothstep',
                    markerEnd: { type: MarkerType.ArrowClosed },
                    style: { stroke: '#94a3b8', strokeWidth: 2 },
                    animated: module.status === 'in-progress'
                });
            }

            yPos += 150;
        });

        return { nodes: flowNodes, edges: flowEdges };
    }, [report]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Reset selected log when dialog opens/closes or student changes
    if (!open && selectedLogId !== null) setSelectedLogId(null);

    if (!report) return null;

    const selectedLog = report.explainabilityLogs.find(l => l.id === selectedLogId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-gray-50/50">

                {/* Header */}
                <div className="p-6 border-b bg-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <BrainCircuit className="h-6 w-6 text-primary" />
                            Adaptive Learning Tree: {studentName}
                        </DialogTitle>
                        <DialogDescription className="text-base mt-2 flex items-center justify-between" asChild>
                            <div className="flex items-center justify-between">
                                <span>{report.summary}</span>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Badge variant="secondary" className="gap-1 cursor-help">
                                                <ShieldCheck className="h-3 w-3" /> Encrypted & Audited
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>All automated decisions are logged for ethical auditing.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* content */}
                <div className="flex flex-1 overflow-hidden h-[600px]">

                    {/* Left: Interactive Graph */}
                    <div className="flex-1 border-r bg-white relative">
                        <div className="absolute top-4 left-4 z-10 bg-white/90 p-2 rounded border shadow-sm text-xs">
                            <p className="font-semibold mb-1">Legend</p>
                            <div className="flex gap-2 items-center"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Core</div>
                            <div className="flex gap-2 items-center"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Support</div>
                            <div className="flex gap-2 items-center"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Challenge</div>
                        </div>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            nodeTypes={nodeTypes}
                            fitView
                            attributionPosition="bottom-right"
                        >
                            <Background color="#f1f5f9" gap={16} />
                            <Controls />
                        </ReactFlow>
                    </div>

                    {/* Right: Details / logs */}
                    <div className="w-[350px] bg-white flex flex-col">
                        <div className="p-4 border-b bg-muted/10">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                node_explainability_log.json
                            </h3>
                        </div>
                        <ScrollArea className="flex-1 p-4">
                            {selectedLog ? (
                                <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
                                    <div className="p-3 rounded-lg bg-slate-900 text-slate-50 font-mono text-sm shadow-inner">
                                        <div className="opacity-50 text-xs mb-2">ID: {selectedLog.id}</div>
                                        <div className="mb-2">
                                            <span className="text-green-400">Action:</span> {selectedLog.action}
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-blue-400">Reason:</span> "{selectedLog.reason}"
                                        </div>
                                        <div className="border-t border-slate-700 my-2 pt-2">
                                            <span className="text-purple-400 block mb-1">Factors:</span>
                                            <ul className="list-disc list-inside text-slate-300">
                                                {selectedLog.factors.map(f => <li key={f}>{f}</li>)}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="p-3 rounded-lg border bg-green-50 border-green-100">
                                        <h4 className="font-semibold text-green-800 text-sm mb-1 flex items-center gap-2">
                                            <ShieldCheck className="h-3 w-3" /> Ethical Alignment
                                        </h4>
                                        <p className="text-sm text-green-700 leading-relaxed">
                                            {selectedLog.ethicalAlignment}
                                        </p>
                                    </div>

                                    <div className="text-xs text-muted-foreground text-center pt-4">
                                        Timestamp: {new Date(selectedLog.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-4">
                                    <BrainCircuit className="h-12 w-12 mb-4 opacity-20" />
                                    <p>Select a node that has an adaptation (Support/Challenge) to view its decision log.</p>
                                    <p className="text-xs mt-2 opacity-60">Core nodes typically follow the standard curriculum unless flagged.</p>
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>

                <div className="p-4 border-t bg-white flex justify-end">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close Report</Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}
