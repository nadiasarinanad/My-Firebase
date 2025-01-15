import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TodoItem from '../components/TodoItem';
import {
  addTodo,
  deleteData,
  fetchData,
  updateCompleted,
} from '../firebase/firestore';

const HomeScreen = () => {
  const [todos, setTodos] = useState<any>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const loadTodos = async () => {
    try {
      const result = await fetchData();
      console.log(result);
      setTodos(result);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Judul tugas tidak boleh kosong');
      return;
    }

    try {
      await addTodo(title, description);
      loadTodos();
      setTitle('');
      setDescription('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding todo:', error);
      Alert.alert('Error', 'Gagal menambahkan tugas');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteData(id);
      loadTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      await updateCompleted(id, currentStatus);
      loadTodos();
    } catch (error) {
      console.error('Error updating todo status:', error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            marginBottom: 16,
            backgroundColor: '#f8f9fa',
            padding: 16,
            borderRadius: 8,
          }}>
          <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>
            Daftar Tugas ({todos.length})
          </Text>
        </View>
        {todos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada tugas</Text>
            <Text style={styles.emptySubtext}>
              Tambahkan tugas baru dengan menekan tombol di bawah
            </Text>
          </View>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TodoItem
                todo={item}
                onDelete={() => handleDeleteTodo(item.id)}
                onToggleComplete={() =>
                  handleToggleComplete(item.id, item.completed)
                }
              />
            )}
          />
        )}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Tambah Tugas</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          console.log('Modal closed');
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}></View>

        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            paddingHorizontal: 14,
            paddingVertical: 16,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 16,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>Tambah Tugas</Text>
            <TouchableOpacity
              style={{
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={() => setModalVisible(false)}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>
                ❌
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              marginBottom: 8,
              color: '#6c757d',
            }}>
            Judul
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ced4da',
              borderRadius: 4,
              padding: 10,
              marginBottom: 12,
            }}
            value={title}
            onChangeText={text => setTitle(text)}
          />
          <Text
            style={{
              marginBottom: 8,
              color: '#6c757d',
            }}>
            Deskripsi
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ced4da',
              borderRadius: 4,
              padding: 10,
              marginBottom: 12,
            }}
            value={description}
            onChangeText={text => setDescription(text)}
          />

          <TouchableOpacity
            style={{
              backgroundColor: '#28a745',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 16,
            }}
            onPress={handleAddTodo}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>
              Simpan
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6c757d',
  },
  emptySubtext: {
    marginTop: 8,
    color: '#6c757d',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;
