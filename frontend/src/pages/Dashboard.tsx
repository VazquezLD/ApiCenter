import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api.service';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import { LogOut, Plus, Server, Search } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      const data = Array.isArray(response.data) 
        ? response.data 
        : (response.data.projects || []);
      setProjects(data);
    } catch (err) {
      console.error("Error al obtener proyectos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("[ADVERTENCIA]: ¿Confirmar la eliminación permanente de este nodo?")) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (err) {
        console.error("Error al eliminar", err);
      }
    }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.baseUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Server className="text-neon-green w-6 h-6" />
              <span className="text-xl font-mono tracking-tighter text-white font-bold">API<span className="text-neon-green">CENTER</span></span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-400 border-r border-border pr-6 mr-2">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                OPERADOR: <span className="text-white uppercase">{user?.name}</span>
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 text-slate-400 hover:text-neon-red transition-colors font-mono text-xs uppercase"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-mono text-white flex items-center gap-2 uppercase tracking-tight">
              Panel de Control <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">ROOT</span>
            </h1>
            <p className="text-slate-500 font-mono text-xs mt-1">Estado: Monitoreando {projects.length} nodos activos en el clúster.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar nodos..."
                className="bg-black/50 border border-border rounded pl-9 pr-4 py-2 text-xs font-mono text-white focus:border-neon-green outline-none w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={handleCreate}
              className="flex items-center gap-2 bg-neon-green/10 border border-neon-green text-neon-green px-4 py-2 rounded font-mono text-xs uppercase hover:bg-neon-green/20 transition-all neon-glow-green whitespace-nowrap"
            >
              <Plus size={16} />
              Nuevo Objetivo
            </button>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-card/50 border border-border animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onRefresh={fetchProjects}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-lg bg-black/20">
            <Server className="w-12 h-12 text-slate-700 mb-4" />
            <p className="text-slate-500 font-mono">NO SE DETECTARON OBJETIVOS ACTIVOS</p>
            <button onClick={handleCreate} className="mt-4 text-neon-green hover:underline font-mono text-sm uppercase">Inicializar primer nodo</button>
          </div>
        )}
      </main>

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProjects}
        editProject={editingProject}
      />
    </div>
  );
};

export default Dashboard;
