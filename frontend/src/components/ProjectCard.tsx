import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ExternalLink, RefreshCw, Trash2, Edit3, Tag } from 'lucide-react';
import api from '../services/api.service';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    baseUrl: string;
    status: string;
    lastResponseTime: number | null;
    tags: string[];
  };
  onRefresh: () => void;
  onEdit: (project: any) => void;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onRefresh, onEdit, onDelete }) => {
  // Intentar usar currentStatus del backend o caer en status original
  const displayStatus = (project as any).currentStatus || project.status || 'desconocido';
  const isHealthy = displayStatus === 'online' || displayStatus === 'ACTIVO';

  const handleCheckNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.post(`/projects/${project.id}/check`);
      onRefresh();
    } catch (err) {
      console.error("Error en chequeo manual", err);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden group hover:border-neon-green/30 transition-all card-gradient">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isHealthy ? 'bg-neon-green animate-pulse neon-glow-green' : 'bg-neon-green/50'}`} />
            <h3 className="font-mono text-lg text-white group-hover:text-neon-green transition-colors truncate max-w-[150px]">
              {project.name}
            </h3>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(project)} className="p-1 hover:text-neon-green text-slate-500">
              <Edit3 size={16} />
            </button>
            <button onClick={() => onDelete(project.id)} className="p-1 hover:text-neon-red text-slate-500">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <ExternalLink size={14} />
            <span className="truncate">{project.baseUrl}</span>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase font-mono text-slate-600 mb-1">Latencia</p>
              <p className="text-xl font-mono text-neon-green">
                {project.lastResponseTime !== null && project.lastResponseTime !== undefined ? `${project.lastResponseTime}ms` : '---'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-mono text-slate-600 mb-1">Estado</p>
              <p className="text-sm font-mono uppercase text-neon-green">
                {displayStatus}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-6">
          {project.tags && project.tags.map((tag, idx) => (
            <span key={idx} className="flex items-center gap-1 px-2 py-0.5 bg-slate-800/50 border border-slate-700 rounded text-[10px] font-mono text-slate-400">
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Link
            to={`/projects/${project.id}`}
            className="flex items-center justify-center gap-2 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-300 transition-colors"
          >
            <Activity size={14} />
            Detalles
          </Link>
          <button
            onClick={handleCheckNow}
            className="flex items-center justify-center gap-2 py-2 bg-neon-green/5 hover:bg-neon-green/10 border border-neon-green/30 hover:border-neon-green rounded text-xs font-mono text-neon-green transition-all"
          >
            <RefreshCw size={14} />
            Ping
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
