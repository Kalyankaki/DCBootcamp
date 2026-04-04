"use client";

import {
  Cpu,
  MemoryStick,
  HardDrive,
  MonitorPlay,
  Wifi,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import type { Workload } from "@/lib/types";

interface WorkloadCardProps {
  workload: Workload;
  compatible: boolean;
  onAssign?: () => void;
}

const priorityColors: Record<string, string> = {
  low: "bg-slate-600 text-slate-300",
  medium: "bg-blue-500/20 text-blue-400",
  high: "bg-amber-500/20 text-amber-400",
  critical: "bg-red-500/20 text-red-400",
};

export default function WorkloadCard({
  workload,
  compatible,
  onAssign,
}: WorkloadCardProps) {
  return (
    <div
      className={`bg-slate-800 rounded-xl border-2 transition-all duration-300 hover:scale-[1.01] ${
        compatible
          ? "border-emerald-500/30 hover:border-emerald-500/60"
          : "border-red-500/30 hover:border-red-500/50"
      }`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                compatible ? "bg-emerald-500/20" : "bg-red-500/20"
              }`}
            >
              {workload.icon}
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">{workload.name}</h3>
              <p className="text-slate-400 text-xs">{workload.description}</p>
            </div>
          </div>
          <span
            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
              priorityColors[workload.priority] ?? priorityColors.low
            }`}
          >
            {workload.priority}
          </span>
        </div>

        {/* Requirements */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">CPU:</span>
            <span className="text-white font-medium">
              {workload.requiredCPUCores} cores
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <MemoryStick className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400">RAM:</span>
            <span className="text-white font-medium">
              {workload.requiredRAM} GB
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Storage:</span>
            <span className="text-white font-medium">
              {workload.requiredStorage} TB
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Network:</span>
            <span className="text-white font-medium">
              {workload.networkBandwidth} Gbps
            </span>
          </div>
          {workload.requiredGPU && (
            <div className="flex items-center gap-1.5 text-xs col-span-2">
              <MonitorPlay className="w-3.5 h-3.5 text-red-400" />
              <span className="text-slate-400">GPU:</span>
              <span className="text-white font-medium">
                {workload.requiredGPUVRAM ?? 0} GB VRAM required
              </span>
            </div>
          )}
        </div>

        {/* Revenue + Action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-extrabold text-sm">
              ${workload.revenuePerMonth.toLocaleString()}
            </span>
            <span className="text-slate-500 text-xs">/month</span>
          </div>

          <button
            onClick={onAssign}
            disabled={!compatible}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
              compatible
                ? "bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25"
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
            }`}
          >
            {compatible ? (
              <>
                Assign <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              "Incompatible"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
