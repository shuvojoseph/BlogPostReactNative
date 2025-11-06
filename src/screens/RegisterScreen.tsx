import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../viewmodels/useAuth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

type RegisterNavProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Required'),
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
});

const RegisterScreen: React.FC = () => {
  const { register } = useAuth();
  const navigation = useNavigation<RegisterNavProp>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Formik
        initialValues={{ email: '', password: '', firstName: '', lastName: '' }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await register(values);
            Alert.alert('Success', 'Registration successful. Please login.');
            navigation.navigate('Login');
          } catch (err: any) {
            console.error('Register error', err);
            const message = err?.response?.data?.message || err?.message || 'Register failed';
            Alert.alert('Error', message);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View>
            <Text>First Name</Text>
            <TextInput style={styles.input} onChangeText={handleChange('firstName')} onBlur={handleBlur('firstName')} value={values.firstName} />
            {touched.firstName && typeof errors.firstName === 'string' && <Text style={styles.error}>{errors.firstName}</Text>}

            <Text>Last Name</Text>
            <TextInput style={styles.input} onChangeText={handleChange('lastName')} onBlur={handleBlur('lastName')} value={values.lastName} />
            {touched.lastName && typeof errors.lastName === 'string' && <Text style={styles.error}>{errors.lastName}</Text>}

            <Text>Email</Text>
            <TextInput style={styles.input} keyboardType="email-address" autoCapitalize="none" onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email} />
            {touched.email && typeof errors.email === 'string' && <Text style={styles.error}>{errors.email}</Text>}

            <Text>Password</Text>
            <TextInput style={styles.input} secureTextEntry onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password} />
            {touched.password && typeof errors.password === 'string' && <Text style={styles.error}>{errors.password}</Text>}

            <View style={styles.button}>
              <Button onPress={handleSubmit as any} title={isSubmitting ? 'Registering...' : 'Register'} disabled={isSubmitting} />
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  error: { color: 'red', marginBottom: 8 },
  button: { marginTop: 12 },
});

export default RegisterScreen;