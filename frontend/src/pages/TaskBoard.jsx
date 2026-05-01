import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import api from '../utils/api';
import KanbanColumn from '../components/KanbanColumn';
import { Loader2, Plus, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const TaskBoard = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'Todo',
    assignedTo: '',
    dueDate: ''
  });

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      const [taskRes, projectRes, userRes] = await Promise.all([
        api.get(`/tasks/project/${projectId}`),
        api.get(`/projects`),
        api.get(`/auth/users`)
      ]);
      
      setTasks(taskRes.data);
      setProject(projectRes.data.find(p => p._id === projectId));
      setUsers(userRes.data);
    } catch (error) {
      toast.error('Failed to load board data');
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const updatedTasks = Array.from(tasks);
    const taskIndex = updatedTasks.findIndex(t => t._id === draggableId);
    updatedTasks[taskIndex].status = destination.droppableId;
    setTasks(updatedTasks);

    try {
      await api.put(`/tasks/${draggableId}/status`, { status: destination.droppableId });
    } catch (error) {
      toast.error('Failed to update task status');
      fetchData();
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, projectId });
      toast.success('Task created!');
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', status: 'Todo', assignedTo: '', dueDate: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await api.put(`/projects/${projectId}/members`, { members: [userId] });
      toast.success('Member added!');
      fetchData();
    } catch (error) {
      toast.error('Failed to add member');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-primary-500" size={40} />
    </div>
  );

  const columns = {
    'Todo': tasks.filter(t => t.status === 'Todo'),
    'In Progress': tasks.filter(t => t.status === 'In Progress'),
    'Done': tasks.filter(t => t.status === 'Done'),
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold">{project?.title}</h1>
            <span className="px-3 py-1 rounded-full bg-slate-500/10 opacity-70 text-xs font-bold border border-slate-500/20">
              Project Board
            </span>
          </div>
          <p className="opacity-70">{project?.description}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3 mr-2">
            {project?.members?.slice(0, 5).map((member) => (
              <div 
                key={member._id} 
                className="w-10 h-10 rounded-full border-2 border-[var(--bg-app)] bg-primary-600 flex items-center justify-center text-xs font-bold text-white"
                title={member.name}
              >
                {member.name.charAt(0)}
              </div>
            ))}
            {project?.members?.length > 5 && (
              <div className="w-10 h-10 rounded-full border-2 border-[var(--bg-app)] bg-slate-500 flex items-center justify-center text-xs font-bold text-white">
                +{project.members.length - 5}
              </div>
            )}
          </div>
          
          {user?.role === 'Admin' && (
            <button 
              onClick={() => setShowMemberModal(true)}
              className="p-2.5 rounded-xl bg-slate-500/10 border border-slate-500/20 opacity-70 hover:opacity-100 transition-all"
              title="Add Team Member"
            >
              <Users size={20} />
            </button>
          )}
          
          {user?.role === 'Admin' && (
            <button
              onClick={() => {
                setNewTask({ ...newTask, status: 'Todo' });
                setShowTaskModal(true);
              }}
              className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary-600/20"
            >
              <Plus size={18} /> New Task
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 min-h-[600px]">
            {Object.entries(columns).map(([id, colTasks]) => (
              <KanbanColumn
                key={id}
                id={id}
                title={id}
                tasks={colTasks}
                onAddTask={(status) => {
                  setNewTask({ ...newTask, status });
                  setShowTaskModal(true);
                }}
                showAdd={user?.role === 'Admin'}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass w-full max-w-lg p-8 rounded-3xl animate-in zoom-in-95 duration-200 relative">
            <button onClick={() => setShowTaskModal(false)} className="absolute right-6 top-6 opacity-60 hover:opacity-100">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium opacity-80">Title</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-500/5 border border-slate-500/20 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary-500/50 outline-none"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium opacity-80">Description</label>
                <textarea
                  className="w-full bg-slate-500/5 border border-slate-500/20 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary-500/50 outline-none h-24"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium opacity-80">Assign To</label>
                  <select
                    className="w-full bg-slate-500/10 border border-slate-500/20 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary-500/50 outline-none text-[var(--text-app)]"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  >
                    <option value="" className="bg-[var(--bg-app)] text-[var(--text-app)]">Select User</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id} className="bg-[var(--bg-app)] text-[var(--text-app)]">
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium opacity-80">Due Date</label>
                  <input
                    type="date"
                    className="w-full bg-slate-500/5 border border-slate-500/20 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary-500/50 outline-none"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-500/20 rounded-xl font-bold hover:bg-slate-500/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary-600/20"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMemberModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass w-full max-w-md p-8 rounded-3xl animate-in zoom-in-95 duration-200 relative">
            <button onClick={() => setShowMemberModal(false)} className="absolute right-6 top-6 opacity-60 hover:opacity-100">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">Add Team Member</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {users.map(u => (
                <div key={u._id} className="flex justify-between items-center p-3 rounded-2xl bg-slate-500/5 border border-slate-500/20">
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-xs opacity-50">{u.email}</p>
                  </div>
                  {project?.members?.find(m => m._id === u._id) ? (
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">Member</span>
                  ) : (
                    <button
                      onClick={() => handleAddMember(u._id)}
                      className="p-2 rounded-lg bg-primary-600/10 text-primary-400 hover:bg-primary-600 hover:text-white transition-all"
                    >
                      <Plus size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
