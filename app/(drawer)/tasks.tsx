import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, TextInput } from 'react-native';
import { useAuth } from '../../context/auth';
import { Task } from '../../types';

export default function TasksScreen() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddTask, setShowAddTask] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: new Date(),
        priority: 'Urgent and important' as 'Not urgent but important' | 'Not urgent and fast' | 'Urgent and important' | 'Upcoming event' | 'Important but not urgent',
        category: '',
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'tasks'),
            where('userId', '==', user.uid),   //To be changed to username or custom display
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const taskList: Task[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                taskList.push({
                    id: doc.id,
                    title: data.title,
                    description: data.description || '',
                    dueDate: data.dueDate.toDate(),
                    completed: data.completed,
                    priority: data.priority,
                    category: data.category || '',
                    userId: data.userId,
                    createdAt: data.createdAt.toDate(),
                });
            });
            setTasks(taskList);
            setLoading(false);
        });
        return unsubscribe;
    }, [user]);

    //Add new task not modal but it's fine *subject to change*
    const handleAddTask = async () => {
        if (!user || !newTask.title.trim()) return;

        try {
            await addDoc(collection(db, 'tasks'), {
                title: newTask.title,
                description: newTask.description,
                dueDate: Timestamp.fromDate(newTask.dueDate),
                completed: false,
                priority: newTask.priority,
                category: newTask.category,
                userId: user.uid,
                createdAt: Timestamp.fromDate(new Date())
            });

            setNewTask({
                title: '',
                description: '',
                dueDate: new Date(),
                priority: 'Urgent and important',
                category: '',
            });
            setShowAddTask(false);
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const toggleTaskComplete = async (taskId: string, completed: boolean) => {
        try {
            await updateDoc(doc(db, 'tasks', taskId), {
                completed: !completed
            });
        } catch (error) {
            console.error('error updating task:', error);
        }
    };

    const deleteTask = async (taskId: string) => {
        try {
            await deleteDoc(doc(db, 'tasks', taskId));
        } catch (error) {
            console.error('error deleting task:', error);
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-IN' , {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const onDateChange = (event: any, selectedDate: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setNewTask({...newTask, dueDate: selectedDate});
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="rgb(28, 28, 92)" />
            </View>
        );
    }

    return (
        //All container views or Ui for tasks
    )
}