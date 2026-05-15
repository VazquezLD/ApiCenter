import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.service';
import { ChevronLeft, Clock, ShieldCheck, AlertCircle, Calendar, ChevronRight } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullLogs, setFullLogs] = useState<any[]>([]);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, logsRes] = await Promise.all([
          api.get(`/projects`),
          api.get(`/projects/${id}/logs`)
        ]);
        
        const projectsData = Array.isArray(projRes.data) 
          ? projRes.data 
          : (projRes.data.projects || []);

        const currentProject = projectsData.find((p: any) => p.id === id);
        setProject(currentProject);
        
        const chartData = logsRes.data.slice(0, 50).reverse().map((log: any) => ({
          time: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          latency: log.responseTime,
          status: log.statusCode
        }));
        setLogs(chartData);
        setFullLogs(logsRes.data);
      } catch (err) {
        console.error("Error al cargar detalles del proyecto", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center font-mono text-neon-green">
      ANALIZANDO TELEMETRÍA...
    </div>
  );

  if (!project) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-mono text-slate-500">
      <AlertCircle size={48} className="text-neon-red mb-4" />
      OBJETIVO NO ENCONTRADO O ACCESO DENEGADO
      <Link to="/dashboard" className="mt-4 text-neon-green hover:underline">VOLVER A LA BASE</Link>
    </div>
  );

  // Lógica de paginación
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = fullLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(fullLogs.length / logsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-mono text-xs uppercase mb-8">
          <ChevronLeft size={16} />
          Volver al Clúster
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Header Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border p-6 rounded-lg card-gradient">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-mono text-white tracking-tighter uppercase">{project.name}</h1>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neon-green/20 text-neon-green border border-neon-green/30">
                      {project.currentStatus || project.status || 'ACTIVO'}
                    </span>
                  </div>
                  <p className="text-slate-500 font-mono text-sm">{project.baseUrl}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-mono text-slate-600 mb-1">Latencia Actual</p>
                  <p className="text-4xl font-mono text-neon-green">
                    {project.lastResponseTime !== null && project.lastResponseTime !== undefined ? `${project.lastResponseTime}ms` : '---'}
                  </p>
                </div>
              </div>
              
              <div className="mt-8 h-[300px] w-full">
                <p className="text-[10px] uppercase font-mono text-slate-500 mb-4 flex items-center gap-2">
                  <Clock size={12} /> Historial de Latencia en Tiempo Real (Últimos 50 Pings)
                </p>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={logs}>
                    <defs>
                      <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2e2e3a" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      stroke="#475569" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      unit="ms"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#16161e', border: '1px solid #2e2e3a', borderRadius: '4px', fontFamily: 'monospace' }}
                      itemStyle={{ color: '#10b981' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="latency" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorLatency)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* History Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border bg-slate-900/50">
                <h3 className="font-mono text-xs text-white uppercase flex items-center gap-2">
                  <ShieldCheck size={14} className="text-neon-green" /> Registro de Actividad Reciente
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-black/20 text-slate-500 uppercase border-b border-border">
                    <tr>
                      <th className="px-6 py-3 font-medium">Marca de Tiempo</th>
                      <th className="px-6 py-3 font-medium">Código de Estado</th>
                      <th className="px-6 py-3 font-medium">Tiempo de Respuesta</th>
                      <th className="px-6 py-3 font-medium">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {currentLogs.map((log: any) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-slate-400">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded text-neon-green">
                            {log.statusCode}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          {log.responseTime}ms
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-neon-green">
                            {log.isOnline ? 'ÉXITO' : 'FALLO'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {currentLogs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-slate-500 font-mono">
                          No se encontraron registros de actividad.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-border bg-black/20 flex items-center justify-between font-mono text-[10px] uppercase text-slate-500">
                  <div className="flex items-center gap-2">
                    Mostrando <span className="text-white">{indexOfFirstLog + 1}</span> a <span className="text-white">{Math.min(indexOfLastLog, fullLogs.length)}</span> de <span className="text-white">{fullLogs.length}</span> registros
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-1 border border-border rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`w-6 h-6 border rounded transition-colors ${currentPage === i + 1 ? 'border-neon-green text-neon-green bg-neon-green/10' : 'border-border text-slate-500 hover:bg-slate-800'}`}
                      >
                        {i + 1}
                      </button>
                    )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}

                    <button 
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-1 border border-border rounded hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-card border border-border p-6 rounded-lg">
              <h3 className="font-mono text-xs text-slate-500 uppercase mb-4">Metadatos del Nodo</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-slate-600 uppercase mb-1">Método</p>
                  <p className="text-white font-mono text-sm bg-slate-800/50 inline-block px-2 py-0.5 rounded">{project.method}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-600 uppercase mb-1">Descripción</p>
                  <p className="text-slate-400 font-mono text-sm">{project.description || 'Sin descripción proporcionada.'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-600 uppercase mb-1">Creado el</p>
                  <div className="flex items-center gap-2 text-slate-400 font-mono text-sm">
                    <Calendar size={14} />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border p-6 rounded-lg border-l-4 border-l-neon-green">
              <h3 className="font-mono text-xs text-slate-500 uppercase mb-4">Resumen de Disponibilidad</h3>
              <div className="text-center py-4">
                <p className="text-4xl font-mono text-white">99.9%</p>
                <p className="text-[10px] text-slate-600 uppercase mt-1">Índice de Salud Global</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
