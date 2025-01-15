// id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, completed INTEGER DEFAULT 0

import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import {firestore} from './config';

export const addTodo = async (title: string, description: string) => {
  try {
    const docRef = await addDoc(collection(firestore, 'todos'), {
      title,
      description,
      completed: false,
      created_at: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

export const fetchData = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, 'todos'));
    const todosArray = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return todosArray;
  } catch (error) {
    console.error('Error fetching documents: ', error);
  }
};

export const updateData = async (id: string) => {
  try {
    const docRef = doc(firestore, 'todos', id);
    await updateDoc(docRef, {
      completed: true,
    });
    console.log('Document updated');
  } catch (error) {
    console.error('Error updating document: ', error);
  }
};

export const updateCompleted = async (id: string, completed: boolean) => {
  try {
    const todoRef = doc(firestore, 'todos', id);
    await updateDoc(todoRef, {
      completed: !completed,
    });
    console.log('Todo updated successfully');
  } catch (error) {
    console.error('Error updating todo: ', error);
    throw error;
  }
};

export const deleteData = async (id: string) => {
  try {
    const docRef = doc(firestore, 'todos', id);
    await deleteDoc(docRef);
    console.log('Document deleted');
  } catch (error) {
    console.error('Error deleting document: ', error);
  }
};
