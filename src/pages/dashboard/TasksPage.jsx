import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CheckSquare, 
  Search, 
  Plus, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Filter, 
  LayoutList, 
  Kanban as KanbanIcon,
  Building2,
  Calendar
} from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import { Input } from '../../components/shared/Input';
import { Select } from '../../components/shared/Select';
import { Textarea } from '../../components/shared/Textarea';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { dashboardService } from '../../services/dashboardService';

export function TasksPage() {
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  // New Task Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventId, setEventId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assignedTo, setAssignedTo] = useState('Folashade Adeleke');

  const { data: events = [] } = useQuery({
    queryKey: ['dashboard', 'events'],
    queryFn: () => dashboardService.getEvents(),
  });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['dashboard', 'tasks', priorityFilter, eventFilter],
    queryFn: () => dashboardService.getTasks({ priority: priorityFilter, eventId: eventFilter }),
  });

  const createTaskMutation = useMutation({
    mutationFn: (data) => dashboardService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'tasks'] });
      setModalOpen(false);
      resetForm();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, newStatus }) => dashboardService.updateTaskStatus(taskId, newStatus),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dashboard', 'tasks'] }),
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEventId('');
    setDueDate('');
    setPriority('medium');
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!title || !eventId || !dueDate) return;

    createTaskMutation.mutate({
      title,
      description,
      eventId,
      dueDate,
      priority,
      assignedTo,
    });
  };

  const kanbanColumns = [
    { id: 'pending', title: 'Pending Review', color: 'border-sand-300' },
    { id: 'in_progress', title: 'In Execution', color: 'border-blue-300' },
    { id: 'completed', title: 'Completed', color: 'border-emerald-300' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-obsidian-950">
            Master Planning Checklist & Tasks
          </h1>
          <p className="text-xs text-obsidian-600 mt-1">
            Operational action items across active celebrations, vendor deliverables, and protocol approvals.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="bg-sand-200/80 p-0.5 rounded-sm flex items-center">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-sm text-xs flex items-center transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-obsidian-950 shadow-sm' : 'text-obsidian-600 hover:text-obsidian-950'
              }`}
              title="Kanban Board View"
            >
              <KanbanIcon className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-sm text-xs flex items-center transition-colors ${
                viewMode === 'list' ? 'bg-white text-obsidian-950 shadow-sm' : 'text-obsidian-600 hover:text-obsidian-950'
              }`}
              title="List View"
            >
              <LayoutList className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <Button variant="gold" size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Create Task</span>
          </Button>
        </div>
      </div>

      <Card>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="w-full py-2 px-3 bg-sand-50 border border-sand-300 rounded-sm text-xs text-obsidian-900 focus:outline-none focus:border-gold-500"
            >
              <option value="all">All Events</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:w-64">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full py-2 px-3 bg-sand-50 border border-sand-300 rounded-sm text-xs text-obsidian-900 focus:outline-none focus:border-gold-500"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* View Mode: KANBAN BOARD */}
        {isLoading ? (
          <LoadingSkeleton variant="card" count={3} />
        ) : viewMode === 'kanban' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kanbanColumns.map((col) => {
              const colTasks = tasks.filter((t) => t.status === col.id);
              return (
                <div key={col.id} className="bg-sand-50/80 p-4 rounded-sm border border-sand-300 space-y-4">
                  <div className="flex items-center justify-between border-b border-sand-300/80 pb-2">
                    <span className="font-serif text-sm font-bold text-obsidian-950">
                      {col.title}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sand-200 text-obsidian-800">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3 min-h-[300px]">
                    {colTasks.length === 0 ? (
                      <p className="text-[11px] text-obsidian-400 text-center py-8 font-light">
                        No tasks in this lane.
                      </p>
                    ) : (
                      colTasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-white p-4 rounded-sm border border-sand-200 shadow-sm space-y-3 hover:border-gold-400 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <Badge status={task.priority} />
                            <span className="text-[10px] text-obsidian-500 font-mono">
                              Due: {task.due_date}
                            </span>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-obsidian-950">
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-[11px] text-obsidian-600 font-light mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                          </div>

                          <div className="pt-2 border-t border-sand-100 flex items-center justify-between text-[11px]">
                            <span className="text-gold-700 font-medium truncate max-w-[140px]">
                              {task.event_title}
                            </span>

                            {/* Status Advancement Selector */}
                            <select
                              value={task.status}
                              onChange={(e) =>
                                updateStatusMutation.mutate({
                                  taskId: task.id,
                                  newStatus: e.target.value,
                                })
                              }
                              className="text-[10px] bg-sand-100 border border-sand-300 rounded px-1.5 py-0.5 font-medium text-obsidian-800"
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* View Mode: LIST */
          <div className="space-y-3">
            {tasks.map((task) => {
              const isCompleted = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`flex items-start justify-between p-4 rounded-sm border transition-colors ${
                    isCompleted ? 'bg-sand-50/50 border-sand-200 opacity-60' : 'bg-white border-sand-300 hover:border-gold-400'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({
                          taskId: task.id,
                          newStatus: isCompleted ? 'pending' : 'completed',
                        })
                      }
                      className="mt-0.5 text-obsidian-400 hover:text-emerald-600 transition-colors"
                    >
                      <CheckCircle2
                        className={`w-5 h-5 ${isCompleted ? 'text-emerald-600 fill-emerald-100' : ''}`}
                      />
                    </button>
                    <div className="space-y-1">
                      <p className={`text-xs font-semibold ${isCompleted ? 'line-through text-obsidian-500' : 'text-obsidian-950'}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-[11px] text-obsidian-600 font-light">{task.description}</p>
                      )}
                      <div className="flex items-center space-x-3 text-[11px] text-obsidian-500">
                        <span className="font-medium text-gold-700">{task.event_title}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-gold-600" />
                          Due {task.due_date}
                        </span>
                        <span>•</span>
                        <span>Assigned: {task.assigned_to}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge status={task.priority} />
                    <Badge status={task.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Modal: Create Task */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Operational Task"
        size="md"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={handleCreateTask}
              loading={createTaskMutation.isPending}
            >
              Add Task
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateTask} className="space-y-4 text-xs text-obsidian-700">
          <Input
            label="Task Action Item"
            required
            placeholder="e.g. Confirm Sommelier Wine Pairing Menu"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Select
            label="Associated Event Commission"
            required
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          >
            <option value="">Select confirmed event...</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Due Date"
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <Select
              label="Priority Level"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="critical">Critical</option>
            </Select>
          </div>

          <Select
            label="Assigned Lead"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <option value="Folashade Adeleke">Folashade Adeleke (Creative Director)</option>
            <option value="Tunde Bakare">Tunde Bakare (Operations Director)</option>
            <option value="Chiamaka Nwosu">Chiamaka Nwosu (Senior Event Architect)</option>
            <option value="Zainab Balogun">Zainab Balogun (Guest Coordinator)</option>
          </Select>

          <Textarea
            label="Task Details & Action Description"
            rows={2}
            placeholder="Enter technical details, contacts, or delivery guidelines..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
