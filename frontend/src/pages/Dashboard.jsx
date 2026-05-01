import { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/tasks/stats');
        setStats(data);
      } catch (error) {
        toast.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary-600" size={40} />
    </div>
  );

  const cards = [
    { title: 'Total Assignments', value: stats?.totalTasks || 0, icon: BarChart3, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-500/10' },
    { title: 'Completed Tasks', value: stats?.completedTasks || 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { title: 'Active Work', value: stats?.pendingTasks || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { title: 'Overdue items', value: stats?.overdueTasks || 0, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Project Metrics</h1>
          <p className="text-sm text-slate-500 font-medium">Real-time status of your work environment.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
          <TrendingUp size={14} className="text-emerald-600" />
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-wider">Live System</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white dark:bg-[#101828] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md hover:border-primary-500/20 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                <card.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 mb-1">{card.title}</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white leading-none">{card.value}</h3>
              <div className="text-[10px] font-bold text-emerald-600 mb-1">Active</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#101828] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Activity Log</h2>
          <button className="text-xs font-bold text-primary-600 hover:underline">View All History</button>
        </div>
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200 dark:border-slate-700">
             <Clock className="text-slate-400" size={24} />
          </div>
          <p className="text-sm font-medium text-slate-500 italic max-w-xs mx-auto">No recent activities to display. New events will appear here as they happen.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
