import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import api from '../services/api.service';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editProject?: any;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSuccess, editProject }) => {
  const [formData, setFormData] = useState({
    name: '',
    baseUrl: '',
    description: '',
    method: 'GET',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (editProject) {
      setFormData({
        name: editProject.name || '',
        baseUrl: editProject.baseUrl || '',
        description: editProject.description || '',
        method: editProject.method || 'GET',
        tags: editProject.tags || [],
      });
    } else {
      setFormData({
        name: '',
        baseUrl: '',
        description: '',
        method: 'GET',
        tags: [],
      });
    }
  }, [editProject, isOpen]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (editProject) {
        await api.patch(`/projects/${editProject.id}`, formData);
      } else {
        await api.post('/projects', formData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error al guardar el proyecto", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Ocurrió un error inesperado al intentar guardar el proyecto.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-slate-900/50">
          <h2 className="font-mono text-lg text-white uppercase tracking-tighter">
            {editProject ? 'Modificar Nodo Objetivo' : 'Inicializar Nuevo Objetivo'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-neon-red/10 border border-neon-red/30 p-3 rounded flex items-start gap-3 mb-2">
              <div className="text-neon-red font-mono text-[10px] uppercase">
                [ERROR]: {error}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono text-slate-500">Nombre del Proyecto</label>
            <input
              required
              className="w-full bg-black/40 border border-border rounded p-2 text-sm text-white focus:border-neon-green outline-none font-mono"
              placeholder="PROD-API-GWAY"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono text-slate-500">URL Base / Endpoint</label>
            <input
              required
              type="url"
              className="w-full bg-black/40 border border-border rounded p-2 text-sm text-white focus:border-neon-green outline-none font-mono"
              placeholder="https://api.example.com/v1"
              value={formData.baseUrl}
              onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-500">Método HTTP</label>
              <select
                className="w-full bg-black/40 border border-border rounded p-2 text-sm text-white focus:border-neon-green outline-none font-mono appearance-none"
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-500">Etiquetas (Presiona Enter)</label>
              <input
                className="w-full bg-black/40 border border-border rounded p-2 text-sm text-white focus:border-neon-green outline-none font-mono"
                placeholder="prod, auth, core"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[32px]">
            {formData.tags.map((tag, idx) => (
              <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-neon-green/10 border border-neon-green/30 rounded text-[10px] font-mono text-neon-green">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-white">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono text-slate-500">Descripción</label>
            <textarea
              className="w-full bg-black/40 border border-border rounded p-2 text-sm text-white focus:border-neon-green outline-none font-mono h-20 resize-none"
              placeholder="Monitoreo del clúster de autenticación principal..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-border text-slate-400 font-mono text-xs uppercase hover:bg-slate-800 transition-colors rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 bg-neon-green/10 border border-neon-green text-neon-green font-mono text-xs uppercase hover:bg-neon-green/20 transition-all rounded flex items-center justify-center gap-2 neon-glow-green"
            >
              {isLoading ? 'Procesando...' : (
                <>
                  <Save size={14} />
                  {editProject ? 'Actualizar Enlace' : 'Confirmar Nodo'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
