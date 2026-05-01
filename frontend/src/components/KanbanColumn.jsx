import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { MoreHorizontal, Plus } from 'lucide-react';

const KanbanColumn = ({ title, tasks, id, onAddTask, showAdd }) => {
  return (
    <div className="flex flex-col w-full min-w-[300px] bg-slate-900/30 rounded-3xl border border-slate-800/50 h-fit max-h-full">
      <div className="p-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-slate-200">{title}</h3>
          <span className="bg-slate-800 text-slate-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-slate-700">
            {tasks.length}
          </span>
        </div>
        <button className="text-slate-500 hover:text-slate-300 transition-colors p-1 hover:bg-slate-800 rounded-lg">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 min-h-[150px] transition-colors duration-200 rounded-b-3xl ${
              snapshot.isDraggingOver ? 'bg-primary-500/5' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} />
            ))}
            {provided.placeholder}
            
            {showAdd && (
              <button
                onClick={() => onAddTask(id)}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-slate-800 text-slate-500 hover:border-primary-500/50 hover:text-primary-400 hover:bg-primary-500/5 transition-all group"
              >
                <Plus size={18} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">Add Task</span>
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
