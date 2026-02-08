import { create } from "zustand";
import { Task, TaskCreate, TaskUpdate, taskApi } from "./auth";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (task: TaskCreate) => Promise<Task>;
  updateTask: (id: string, task: TaskUpdate) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskComplete: (id: string, isCompleted: boolean) => Promise<Task>;
}

export const useTasks = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskApi.getAll();
      set({ tasks, isLoading: false });
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to fetch tasks";
      set({ error, isLoading: false });
      throw error;
    }
  },

  createTask: async (task: TaskCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await taskApi.create(task);
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        isLoading: false,
      }));
      return newTask;
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to create task";
      set({ error, isLoading: false });
      throw error;
    }
  },

  updateTask: async (id: string, task: TaskUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await taskApi.update(id, task);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
        isLoading: false,
      }));
      return updatedTask;
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to update task";
      set({ error, isLoading: false });
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await taskApi.delete(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        isLoading: false,
      }));
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to delete task";
      set({ error, isLoading: false });
      throw error;
    }
  },

  toggleTaskComplete: async (id: string, isCompleted: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await taskApi.toggleComplete(id, isCompleted);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
        isLoading: false,
      }));
      return updatedTask;
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to toggle task";
      set({ error, isLoading: false });
      throw error;
    }
  },
}));
