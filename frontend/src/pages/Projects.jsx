import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  Plus,
  Folder,
  Calendar,
  Users,
  ArrowRight,
  Loader2,
  Filter,
  MoreVertical
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const [newProject, setNewProject] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ title: '', description: '' });
      fetchProjects();
      toast.success('Project created');
    } catch (error) {
      toast.error('Error creating project');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary-600" size={40} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Active Repositories</h1>
          <p className="text-sm text-slate-500 font-medium">Manage and track your project containers.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-all">
            <Filter size={16} /> Filter
          </button>
          {user?.role === 'Admin' && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary-600/20 active:scale-95"
            >
              <Plus size={18} /> New Project
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <Folder size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium italic">No projects found. Create one to get started.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="bg-white dark:bg-[#101828] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col hover:border-primary-500/50 transition-all shadow-sm hover:shadow-xl hover:shadow-primary-500/5 group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-600 border border-primary-100 dark:border-primary-500/20">
                  <Folder size={20} />
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{project.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 flex-1 font-medium">{project.description}</p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-[#101828] bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[8px] font-black uppercase">
                      {i}
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[#101828] bg-primary-600 text-white flex items-center justify-center text-[8px] font-black">
                    +{project.members?.length || 0}
                  </div>
                </div>
                <Link
                  to={`/projects/${project._id}`}
                  className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-primary-600 hover:text-white transition-all shadow-sm group-hover:scale-110"
                >
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#101828] rounded-3xl p-8 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-6">Initialize New Project</h2>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Project Label</label>
                <input
                  required
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all font-medium"
                  placeholder="e.g. Marketing Launch 2024"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Internal Notes</label>
                <textarea
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all h-24 font-medium"
                  placeholder="Describe the scope and objectives..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
