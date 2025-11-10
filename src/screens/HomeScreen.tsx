import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useBlogViewModel } from '../viewmodels/useBlogViewModel';
import { useAuth } from '../viewmodels/useAuth';
import BlogItem from '../components/BlogItem';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const HomeScreen: React.FC = () => {
  const { blogs, loading, fetchBlogs, deleteBlog } = useBlogViewModel();
  const { user, logout } = useAuth();

  type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          {user ? `Welcome, ${user.firstName || user.email}` : 'Welcome to BlogApp'}
        </Text>
        <View style={styles.actionsRow}>
          {user ? (
            <>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddEditBlog')}>
                <Text style={styles.buttonText}>Add Blog</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logout}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={blogs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BlogItem
              blog={item}
              currentUser={user}
              onEdit={() => navigation.navigate('AddEditBlog' as any, { blog: item })}
              onDelete={async () => {
                await deleteBlog(item.id);
              }}
            />
          )}
          refreshing={loading}
          onRefresh={fetchBlogs}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { marginBottom: 16 },
  welcomeText: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#333' },
  actionsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutButton: { backgroundColor: '#FF3B30' },
  buttonText: { color: '#fff', fontWeight: '600' },
});

export default HomeScreen;