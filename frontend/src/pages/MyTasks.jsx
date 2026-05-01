import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Loader2, CheckCircle2, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const { data } = await api.get('/tasks/my-tasks');
        setTasks(data);
      } catch (error) {
        console.error('Task load error:', error);
        toast.error('Failed to load your tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchMyTasks();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary-500" size={40} />
    </div>
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'In Progress': return <Clock className="text-amber-500" size={18} />;
      default: return <AlertCircle className="text-slate-400" size={18} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
          <p className="opacity-70">All tasks assigned to you across all projects.</p>
        </div>
        <button 
          onClick={() => {
            setLoading(true);
            const fetchMyTasks = async () => {
              try {
                const { data } = await api.get('/tasks/my-tasks');
                setTasks(data);
              } catch (error) {
                toast.error('Failed to reload tasks');
              } finally {
                setLoading(false);
              }
            };
            fetchMyTasks();
          }}
          className="text-sm bg-slate-500/10 hover:bg-slate-500/20 px-4 py-2 rounded-xl transition-all"
        >
          Refresh
        </button>
      </div>

      <div className="glass overflow-hidden rounded-3xl border border-slate-500/10 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-500/5 border-b border-slate-500/10">
                <th className="px-6 py-4 text-sm font-bold opacity-80">Task Title</th>
                <th className="px-6 py-4 text-sm font-bold opacity-80">Project</th>
                <th className="px-6 py-4 text-sm font-bold opacity-80">Status</th>
                <th className="px-6 py-4 text-sm font-bold opacity-80">Due Date</th>
                <th className="px-6 py-4 text-sm font-bold opacity-80 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-500/10">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center opacity-50 italic">
                    No tasks assigned to you yet.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-500/5 transition-colors group">
                    <td className="px-6 py-4 font-bold">{task.title}</td>
                    <td className="px-6 py-4 opacity-70 text-sm">
                      {task.projectId?.title || <span className="text-rose-400 italic">Project Not Found</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {getStatusIcon(task.status)}
                        <span>{task.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 opacity-70 text-sm">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {task.projectId?._id && (
                        <Link
                          to={`/projects/${task.projectId?._id}`}
                          className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 transition-colors"
                        >
                          <ExternalLink size={18} />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
