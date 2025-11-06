import React from 'react';
import { View, Text, FlatList, ActivityIndicator, Button, StyleSheet } from 'react-native';
import { useBlogViewModel } from '../viewmodels/useBlogViewModel';
import { useAuth } from '../viewmodels/useAuth';
import BlogItem from '../components/BlogItem';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const HomeScreen: React.FC = () => {
  const { blogs, loading, fetchBlogs, deleteBlog } = useBlogViewModel();
  const { user, logout } = useAuth();
  //const navigation = useNavigation();

  type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        {user ? (
          <>
            <Button title="Add Blog" onPress={() => navigation.navigate('AddEditBlog')} />
            <Button title="Logout" onPress={logout} />
          </>
        ) : (
          <>
            <Button title="Login" onPress={() => navigation.navigate('Login')} />
            <Button title="Register" onPress={() => navigation.navigate('Register')} />
          </>
        )}
      </View>

      {loading ? <ActivityIndicator /> : (
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
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
});

export default HomeScreen;
