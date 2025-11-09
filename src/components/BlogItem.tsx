import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { storage } from '../utils/storage';

const BlogItem = ({ blog, currentUser, onEdit, onDelete }: any) => {
  const isOwnerOrCoOwner = () => {
   //console.log(" blog: ", blog);
   //console.log("currentUserEmail : ", currentUser);
   //console.log("blog.owners : ", blog.owners);
    
    if (!currentUser) return false;
    if (Array.isArray(blog.owners)) {
      return blog.owners.some((owner: any) => owner.email === currentUser.email);
  }
    return false;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{blog.title}</Text>
      <Text numberOfLines={2}>{blog.details}</Text>
      <View style={styles.actionRow}>
        {isOwnerOrCoOwner() && (
          <>
            <Button title="Edit" onPress={onEdit} />
            <Button title="Delete" onPress={onDelete} />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 12, borderWidth: 1, borderColor: '#ddd', marginBottom: 8, borderRadius: 6 },
  title: { fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8, gap: 8 },
});

export default BlogItem;
