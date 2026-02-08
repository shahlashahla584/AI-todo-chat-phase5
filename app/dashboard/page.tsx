"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/lib/auth";
import { useTasks } from "@/src/lib/tasks";
import { useRouter } from "next/navigation";
import TaskCreation from "@/src/components/TaskCreation";
import ReminderNotification from "@/src/components/ReminderNotification";
import RecurringTask from "@/src/components/RecurringTask";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    toggleTaskComplete,
    deleteTask,
  } = useTasks();

  const [activeTab, setActiveTab] = useState("tasks");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    fetchTasks();
  }, [isAuthenticated, fetchTasks, router]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsCreating(true);
    await createTask({
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim() || undefined,
      is_completed: false,
    });
    setNewTaskTitle("");
    setNewTaskDescription("");
    setIsCreating(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 bg-slate-950">
        Redirecting to login...
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 min-h-screen text-white">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-[-120px] right-[-120px] w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-120px] left-[-120px] w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        {/* Welcome */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold">
            Advanced Dashboard
          </h1>
          <p className="text-slate-300 mt-2 text-lg">
            Welcome back, {user?.email} • Manage your tasks with advanced features
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="Total Tasks" value={tasks.length} color="indigo" />
          <StatCard
            title="Completed"
            value={tasks.filter((t) => t.is_completed).length}
            color="green"
          />
          <StatCard
            title="Pending"
            value={tasks.filter((t) => !t.is_completed).length}
            color="sky"
          />
          <StatCard
            title="Due Soon"
            value={tasks.filter(t => {
              if (!t.due_date) return false;
              const dueDate = new Date(t.due_date);
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              return dueDate >= today && dueDate <= tomorrow;
            }).length}
            color="yellow"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/20">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'tasks' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('tasks')}
          >
            My Tasks
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'advanced' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400'}`}
            onClick={() => setActiveTab('advanced')}
          >
            Advanced Features
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'tasks' && (
          <div className="space-y-8">
            {/* Create Task */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Create Task</h2>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <input
                  type="text"
                  placeholder="Task title"
                  className="w-full border border-white/20 bg-white/10 rounded-md px-3 py-2 text-white placeholder-slate-400"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  disabled={isCreating}
                />
                <textarea
                  placeholder="Task description (optional)"
                  rows={3}
                  className="w-full border border-white/20 bg-white/10 rounded-md px-3 py-2 text-white placeholder-slate-400"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  disabled={isCreating}
                />
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition shadow-lg"
                >
                  {isCreating ? "Creating..." : "Add Task"}
                </button>
              </form>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-red-600/30 bg-red-600/10 text-red-400 p-4">
                {error}
              </div>
            )}

            {/* Tasks List */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>

              {isLoading ? (
                <p className="text-slate-300">Loading...</p>
              ) : tasks.length === 0 ? (
                <p className="text-slate-400">No tasks yet</p>
              ) : (
                <ul className="space-y-3">
                  {tasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex justify-between items-start border border-white/10 rounded-xl p-4 hover:bg-white/10 transition"
                    >
                      <div className="flex gap-3">
                        <input
                          type="checkbox"
                          checked={task.is_completed}
                          onChange={() =>
                            toggleTaskComplete(task.id, !task.is_completed)
                          }
                          className="mt-1 accent-sky-400"
                        />
                        <div>
                          <p
                            className={`font-medium ${
                              task.is_completed
                                ? "line-through text-slate-500"
                                : "text-white"
                            }`}
                          >
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-sm text-slate-300">
                              {task.description}
                            </p>
                          )}
                          {task.due_date && (
                            <p className="text-xs text-yellow-400 mt-1">
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </p>
                          )}
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(task.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-400 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Task Creation Component */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/30 to-indigo-900/20 backdrop-blur-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-indigo-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold">Create Smart Task</h2>
                </div>
                <TaskCreation onTaskCreated={undefined} />
              </div>

              {/* Reminder Notification Component */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/30 to-purple-900/20 backdrop-blur-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold">Manage Reminders</h2>
                </div>
                <ReminderNotification />
              </div>
            </div>

            {/* Recurring Task Component */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/30 to-cyan-900/20 backdrop-blur-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold">Recurring Tasks</h2>
              </div>
              <RecurringTask />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* 🔹 Small reusable stat card */
function StatCard({
  title,
  value,
  color = "indigo",
}: {
  title: string;
  value: number;
  color?: "indigo" | "sky" | "green" | "yellow";
}) {
  const colorClasses = {
    indigo: "text-indigo-400",
    sky: "text-sky-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-lg text-center">
      <div className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</div>
      <div className="text-sm text-slate-300 mt-1">{title}</div>
    </div>
  );
}
