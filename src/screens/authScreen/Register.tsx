import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../../firebase/config';

const RegisterScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password tidak boleh kosong!');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Registrasi berhasil!');
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal registrasi!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        onPress={handleRegister}
        style={{
          backgroundColor: 'blue',
          padding: 12,
          borderRadius: 8,
          marginTop: 8,
          width: '100%',
        }}>
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 'bold',
          }}>
          Register
        </Text>
      </TouchableOpacity>
      <Text
        style={styles.loginText}
        onPress={() => navigation.navigate('Login')}>
        Sudah punya akun? Login
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 16},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  loginText: {
    color: 'blue',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default RegisterScreen;
