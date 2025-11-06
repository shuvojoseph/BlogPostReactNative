import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../viewmodels/useAuth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

const LoginScreen = () => {
  const { login } = useAuth();
  //const navigation = useNavigation();

  type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={{ padding: 12 }}>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await login(values);
            //navigation.navigate('Home' as any);
            navigation.navigate('Home');
          } catch (e) {
            Alert.alert('Invalid credentials');
          } finally { setSubmitting(false); }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
          <>
            <Text>Email</Text>
            <TextInput style={styles.input} value={values.email} onChangeText={handleChange('email')} onBlur={handleBlur('email')} />
            <Text>Password</Text>
            <TextInput style={styles.input} value={values.password} secureTextEntry onChangeText={handleChange('password')} onBlur={handleBlur('password')} />
            <Button title="Login" onPress={handleSubmit as any} disabled={isSubmitting} />
            {/*<Button title="Register" onPress={() => navigation.navigate('Register' as any)} />*/}
          </>
        )}
      </Formik>
    </View>
    
  );
};

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, marginBottom: 8 },
});

export default LoginScreen;
