import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../viewmodels/useAuth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Required'),
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
});

const RegisterScreen: React.FC = () => {
  const { register } = useAuth();
  const navigation = useNavigation<NavProp>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Formik
        initialValues={{ email: '', password: '', firstName: '', lastName: '' }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await register(values);
            Alert.alert('Success', 'Registration successful. Please login.');
            navigation.navigate('Login');
          } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Register failed';
            Alert.alert('Error', message);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <>
            <TextInput style={styles.input} placeholder="First Name" onChangeText={handleChange('firstName')} onBlur={handleBlur('firstName')} value={values.firstName} />
            {touched.firstName && errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}

            <TextInput style={styles.input} placeholder="Last Name" onChangeText={handleChange('lastName')} onBlur={handleBlur('lastName')} value={values.lastName} />
            {touched.lastName && errors.lastName && <Text style={styles.error}>{errors.lastName}</Text>}

            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email} />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password} />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSubmit as any} disabled={isSubmitting}>
              <Text style={styles.buttonText}>{isSubmitting ? 'Registering...' : 'Register'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Already have an account? Login</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '700', color: '#333', marginBottom: 20, textAlign: 'center' },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    marginBottom: 10,
  },
  error: { color: 'red', fontSize: 12, marginBottom: 8 },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center', fontWeight: '600' },
  link: { color: '#007AFF', textAlign: 'center', marginTop: 16 },
});

export default RegisterScreen;