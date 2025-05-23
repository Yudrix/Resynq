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
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top}}>
            <View className="px-4 py-6">
                <Text className="text-2xl font-bold mb-2">Tasks</Text>
                <Text className="textgray-600 mb-4">Manage your scheduled tasks with ease</Text>
            </View>

            <FlatList
                data={tasks}
                keyExtractor:{(item) => item.id}
                className="px-4"
                ListEmptyComponent={
                    <View className={`mb-3 p-4 rounded-lg border ${item.completed ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-300'}`}>
                      <View className="flex-row justify-between items-center">
                        <TouchableOpacity
                            onPress={() => toggleTaskComplete(item.id, item.completed)}
                            className="flex-row items-center flex-1"
                            >
                                <View className={`w-4 h-6 rounded-full border mr-3 items-center justify-center ${item.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}>
                                    {item.completed && <Ionicons name="checkmark" size={16} color="black" />}

                                </View>
                                <View className="flex-1">
                                    <Text className={`font-semibold ${item.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                        {item.title}
                                    </Text>
                                    {item.description ? (
                                        <Text className={`text-sm mt-1 ${item.completed ? 'text-gray-500' : 'text-gray-600'}`}>
                                            {item.description}
                                        </Text>
                                    ) : null}
                                    <View className="flex-row items-center mt-2">
                                        <Ionicons name="calendar-outline" size={14} color=" #666" />
                                        <Text className="text-xs text-gray-500 ml-1">{formatDate(item.dueDate)}</Text>
                                    
                                        <View className={`ml-2 px-2 py-0.5 rounded-full ${
                                            item.priority === 'Urgent and important' ? 'bg-red-100 text-red-800' :
                                            item.priority === 'Not urgent but important' ? 'bg-yellow-100 text-yellow-800' :
                                            item.priority === 'Not urgent and fast' ? 'bg-green-100 text-green-800' :
                                            item.priority === 'Upcoming event' ? 'bg-blue-100 text-blue-800' :
                                            item.priority === 'Important but not urgent' ? 'bg-purple-100 text-purple-800' : ''
                                        }`}>
                                            <Text className="text-xs font-semibold">
                                                {item.priority}
                                            </Text>
                                    </View>
                                </View>
                              </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => deleteTask(item.id)} className="p-2">
                                <Ionicons name="trash-outline" size={20} color=" #F43F5E" />
                            </TouchableOpacity>
                        </View>  
                    </View>    
                   )}
                  />
                  
                  {!showAddTask && (
                  <TouchableOpacity 
                    className="absolute right-6 bottom-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-md"
                    onPress={() = setShowAddTask(true)} >
                        <Ionicons name="add" size={30} color="white" />
                    </TouchableOpacity> )}

                    {showAddTask && (
                        <View className="absolute bottom-0 left-0 right-0 bg-white p-4 rounded-t-xl shadow-lg"
                        style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }}>
                         <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-bold">Add New Task</Text>
                            <TouchableOpacity onPress={() => setShowAddTask(false)} className="p-2">
                             <Ionicons name="close" size={24} color=" #666" />   
                            </TouchableOpacity>
                         </View>

                         <TextInput
                            className="border border-gray-300 rounded-lg p-3 mb-3"
                            placeholder="Description (optional)"
                            multilinenumberOfLines={2}
                            value={newTask.description}
                            onChangeText={(text) => setNewTask({..newTask, description: text})} />

                         <TouchableOpacity
                          className="border border-gray-300 rounded-lg p-3 mb-3 flex-row items-center justify-between"
                          onPress={() => setShowDatePicker(true)} >
                            
                            <Text className={newTask.dueDate ? "text-black" : "text-gray-500"}>
                               {formatDate(newTask.duedate)} 
                            </Text>
                            <Ionicons name="calendar-outline" size={20} color=" #666" />
                            </TouchableOpacity>   

                            {showDatePicker && (
                                <DateTimePicker
                                    value={newTask.dueDate}
                                    mode="date"
                                    display="default"
                                    onChange={onDateChange} />
                            )}
                            
                             <View className="mb-3">
                                <Text className="font-semibold mb-2">Priority</Text>
                                <View className="flex-row space-x-2">
                                    {['Urgent and important', 'Not urgent but important', 'Not urgent and fast', 'Urgent and important', 'Upcoming event', 'Important but not urgent'].map((priority) => (
                                        <TouchableOpacity
                                            key={priority}
                                            className={`flex-1 py-2 rounded-lg items-center ${
                                                newTask.priority === priority ?
                                                (priority == 'Urgent and important' ? 'bg-red-100' :
                                                 priority == 'Not urgent but important' ? 'bg-yellow-100' :
                                                 priority == 'Not urgent and fast' ? 'bg-green-100' :
                                                 priority == 'Upcoming event' ? 'bg-blue-100' :
                                                 priority == 'Important but not urgent' ? 'bg-purple-100') :
                                                 'bg-gray-100'
                                             }}
                                             onPress={() => setNewTask({...newTask, priority: priority as 'Urgent and important' | 'Not urgent but important' | 'Not urgent and fast' | 'Upcoming event' | 'Important but not urgent'})}
                                             >
                                             <Text className={`
                                                ${newTask.priority === priority ?
                                                    (priority == 'Urgent and important' ? 'text-red-800' :
                                                 priority == 'Not urgent and fast' ? 'text-green-800' :
                                                 priority == 'Not urgent but important' ? 'text-yellow-800' :
                                                    priority == 'Upcoming event' ? 'text-blue-800' :
                                                    priority == 'Important but not urgent' ? 'text-purple-800' : 
                                                    'text-gray-800') :
                                                }
                                            }`}>
                                                {setPriority.charAt(0).toUpperCase() + setPriority.slice(1)}
                                                </Text>
                                        </TouchableOpacity>
                                             
                                    ))}
                                </View>
                             </View>

                             
                        </View>
                    )}

                  
        
    )
}