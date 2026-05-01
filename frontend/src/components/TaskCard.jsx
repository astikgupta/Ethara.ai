import { Draggable } from '@hello-pangea/dnd';
import { Calendar, User, Clock } from 'lucide-react';
import { format } from 'date-fns';

const TaskCard = ({ task, index }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-slate-800/80 border border-slate-700/50 p-4 rounded-2xl mb-3 shadow-sm hover:border-primary-500/50 transition-all ${
            snapshot.isDragging ? 'shadow-2xl shadow-primary-500/20 scale-[1.02] border-primary-500 ring-2 ring-primary-500/20' : ''
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-semibold text-slate-100 leading-snug">{task.title}</h4>
          </div>
          
          <p className="text-sm text-slate-400 mb-4 line-clamp-2">{task.description}</p>
          
          <div className="flex flex-wrap gap-3 mt-auto">
            {task.assignedTo && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-900/50 px-2 py-1 rounded-lg border border-slate-800">
                <User size={12} className="text-primary-400" />
                <span className="truncate max-w-[80px]">{task.assignedTo.name}</span>
              </div>
            )}
            
            {task.dueDate && (
              <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg border ${
                isOverdue 
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                  : 'bg-slate-900/50 text-slate-500 border-slate-800'
              }`}>
                <Calendar size={12} className={isOverdue ? 'text-rose-400' : 'text-slate-500'} />
                <span>{format(new Date(task.dueDate), 'MMM d')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
