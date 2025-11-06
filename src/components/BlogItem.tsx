import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const BlogItem = ({ blog, currentUser, onEdit, onDelete }: any) => {
  const isOwnerOrCoOwner = () => {
    if (!currentUser) return false;
    if (blog.ownerId === currentUser.id) return true;
    if (blog.coOwners && blog.coOwners.some((u: any) => u.id === currentUser.id)) return true;
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
