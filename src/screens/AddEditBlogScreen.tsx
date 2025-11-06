import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useBlogViewModel } from '../viewmodels/useBlogViewModel';
import { Formik } from 'formik';
import * as Yup from 'yup';

const BlogSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  details: Yup.string().required('Description is required'),
});

const AddEditBlogScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { blog } = route.params || {};
  const { addBlog, updateBlog, getAllUsers } = useBlogViewModel();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const u = await getAllUsers();
        setUsers(u);
      } catch (e) {
        // handle
      }
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 12 }}>
      <Formik
        initialValues={{
          title: blog?.title || '',
          details: blog?.details || '',
          coOwnerIds: blog?.coOwners ? blog.coOwners.map((u:any) => u.id) : [],
        }}
        validationSchema={BlogSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            if (blog?.id) {
              await updateBlog(blog.id, values);
            } else {
              await addBlog(values);
            }
            navigation.goBack();
          } catch (e) {
            console.error(e);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isSubmitting }) => (
          <View>
            <Text>Title</Text>
            <TextInput style={styles.input} value={values.title} onChangeText={handleChange('title')} onBlur={handleBlur('title')} />
            {/*{touched.title && errors.title && <Text style={{ color: 'red' }}>{errors.title}</Text>}*/}
            {touched.title && typeof errors.title === 'string' && (<Text style={{ color: 'red' }}>{errors.title}</Text>)}

            <Text>Description</Text>
            <TextInput style={[styles.input, { height: 120 }]} value={values.details} onChangeText={handleChange('details')} onBlur={handleBlur('details')} multiline />
            {/*{touched.details && errors.details && <Text style={{ color: 'red' }}>{errors.details}</Text>}*/}
            {touched.details && typeof errors.details === 'string' && (<Text style={{ color: 'red' }}>{errors.details}</Text>)}
            <Text>Co-owners</Text>
            {/* Multi-select simple approach using Picker: select one by one */}
            <View>
              <Picker
                selectedValue={''}
                onValueChange={(val) => {
                  if (!values.coOwnerIds.includes(val)) {
                    setFieldValue('coOwnerIds', [...values.coOwnerIds, val]);
                  }
                }}
              >
                <Picker.Item label="Select co-owner..." value={''} />
                {users.map((u) => <Picker.Item key={u.id} label={`${u.firstName} ${u.lastName}`} value={u.id} />)}
              </Picker>

              <View style={{ marginVertical: 8 }}>
                {values.coOwnerIds.map((id: string) => {
                  const u = users.find(x => x.id === id);
                  if (!u) return null;
                  return (
                    <View key={id} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 6 }}>
                      <Text>{u.firstName} {u.lastName}</Text>
                      <Button title="Remove" onPress={() => setFieldValue('coOwnerIds', values.coOwnerIds.filter((c: string) => c !== id))} />
                    </View>
                  );
                })}
              </View>
            </View>

            <Button title={blog?.id ? 'Update Blog' : 'Add Blog'} onPress={handleSubmit as any} disabled={isSubmitting} />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginBottom: 8 },
});

export default AddEditBlogScreen;
