import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

type Course = 'Starter' | 'Main Course' | 'Dessert';

interface MenuItem {
  id: string;
  dishName: string;
  description: string;
  course: Course;
  price: string;
}

// Generate unique ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export default function App() {
  const [screen, setScreen] = useState<'home' | 'add' | 'edit' | 'view' | 'stats'>('home');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form fields
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState<Course>('Main Course');
  const [price, setPrice] = useState('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState<Course | ''>('');

  // ===== Filtered & Sorted Items =====
  const displayedItems = useMemo(() => {
    let items = [...menuItems];
    if (searchQuery.trim()) {
      items = items.filter(item =>
        item.dishName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (filterCourse) {
      items = items.filter(item => item.course === filterCourse);
    }
    return items;
  }, [menuItems, searchQuery, filterCourse]);

  // ===== Statistics =====
  const stats = useMemo(() => {
    const starters = menuItems.filter(i => i.course === 'Starter');
    const mains = menuItems.filter(i => i.course === 'Main Course');
    const desserts = menuItems.filter(i => i.course === 'Dessert');

    const avgPrice = (items: MenuItem[]) => {
      if (items.length === 0) return '0.00';
      const total = items.reduce((sum, i) => sum + parseFloat(i.price), 0);
      return (total / items.length).toFixed(2);
    };

    return {
      total: menuItems.length,
      starters: { count: starters.length, avgPrice: avgPrice(starters) },
      mains: { count: mains.length, avgPrice: avgPrice(mains) },
      desserts: { count: desserts.length, avgPrice: avgPrice(desserts) },
    };
  }, [menuItems]);

  // ===== Validation =====
  const validateForm = () => {
    if (!dishName.trim()) {
      Alert.alert('Error', 'Please enter a dish name.');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description.');
      return false;
    }
    if (!price.trim() || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid positive price.');
      return false;
    }
    return true;
  };

  // ===== Add New Item =====
  const saveNewItem = () => {
    if (!validateForm()) return;

    const newItem: MenuItem = {
      id: generateId(),
      dishName: dishName.trim(),
      description: description.trim(),
      course,
      price: parseFloat(price).toFixed(2),
    };

    setMenuItems(prev => [...prev, newItem]);
    clearForm();
    Alert.alert('Success', 'Menu item added!');
  };

  // ===== Load Item for Editing =====
  const startEditing = (item: MenuItem) => {
    setEditingItem(item);
    setDishName(item.dishName);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(item.price);
    setScreen('edit');
  };

  // ===== Update Existing Item =====
  const updateItem = () => {
    if (!editingItem || !validateForm()) return;

    setMenuItems(prev =>
      prev.map(item =>
        item.id === editingItem.id
          ? {
              ...item,
              dishName: dishName.trim(),
              description: description.trim(),
              course,
              price: parseFloat(price).toFixed(2),
            }
          : item
      )
    );

    clearForm();
    Alert.alert('Success', 'Menu item updated!');
  };

  // ===== Delete Item =====
  const deleteItem = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMenuItems(prev => prev.filter(item => item.id !== id));
            if (editingItem?.id === id) {
              clearForm();
            }
            Alert.alert('Deleted', 'Item removed from menu.');
          },
        },
      ]
    );
  };

  // ===== Reset Form =====
  const clearForm = () => {
    setDishName('');
    setDescription('');
    setCourse('Main Course');
    setPrice('');
    setEditingItem(null);
    setSearchQuery('');
    setFilterCourse('');
    setScreen('home');
  };

  // ===== Clear Search/Filter =====
  const clearSearchAndFilter = () => {
    setSearchQuery('');
    setFilterCourse('');
  };

  // ===== Reusable Component: Menu Item Card =====
  const MenuItemCard = ({ item, showActions = false }: { item: MenuItem; showActions?: boolean }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.dishName}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>
      <View style={styles.cardRow}>
        <Text style={styles.cardCourse}>{item.course}</Text>
        <Text style={styles.cardPrice}>R{item.price}</Text>
      </View>
      {showActions && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editBtn} onPress={() => startEditing(item)}>
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteItem(item.id)}>
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // ===== NAVIGATION: Home Screen =====
  if (screen === 'home') {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Chef's Menu Manager</Text>
        <Text style={styles.subheading}>Total Items: {menuItems.length}</Text>

        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setScreen('add')}>
            <Text style={styles.primaryBtnText}>Add New Dish</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => setScreen('view')}>
            <Text style={styles.secondaryBtnText}> View & Manage Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => setScreen('stats')}>
            <Text style={styles.secondaryBtnText}> Menu Statistics</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ===== NAVIGATION: Add Screen =====
  if (screen === 'add') {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Add New Menu Item</Text>

        <Text style={styles.label}>Dish Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Grilled Salmon"
          value={dishName}
          onChangeText={setDishName}
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={styles.input}
          placeholder="Brief description of the dish"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Course *</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={course} onValueChange={setCourse}>
            <Picker.Item label="Starter" value="Starter" />
            <Picker.Item label="Main Course" value="Main Course" />
            <Picker.Item label="Dessert" value="Dessert" />
          </Picker>
        </View>

        <Text style={styles.label}>Price (R) *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 85.00"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={saveNewItem}>
          <Text style={styles.primaryBtnText}>Save Menu Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={clearForm}>
          <Text style={styles.cancelBtnText}>← Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ===== NAVIGATION: Edit Screen =====
  if (screen === 'edit') {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Edit Menu Item</Text>

        <Text style={styles.label}>Dish Name *</Text>
        <TextInput style={styles.input} value={dishName} onChangeText={setDishName} />

        <Text style={styles.label}>Description *</Text>
        <TextInput style={styles.input} value={description} onChangeText={setDescription} />

        <Text style={styles.label}>Course *</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={course} onValueChange={setCourse}>
            <Picker.Item label="Starter" value="Starter" />
            <Picker.Item label="Main Course" value="Main Course" />
            <Picker.Item label="Dessert" value="Dessert" />
          </Picker>
        </View>

        <Text style={styles.label}>Price (R) *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={updateItem}>
          <Text style={styles.primaryBtnText}>Update Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={clearForm}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ===== NAVIGATION: View/Search/Filter Screen =====
  if (screen === 'view') {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Menu Items</Text>

        {/* Search */}
        <TextInput
          style={styles.input}
          placeholder="🔍 Search by dish name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Filter by Course */}
        <Text style={styles.label}>Filter by Course:</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={filterCourse} onValueChange={setFilterCourse}>
            <Picker.Item label="All Courses" value="" />
            <Picker.Item label="Starter" value="Starter" />
            <Picker.Item label="Main Course" value="Main Course" />
            <Picker.Item label="Dessert" value="Dessert" />
          </Picker>
        </View>

        {/* Clear Search & Filter */}
        {(searchQuery || filterCourse) && (
          <TouchableOpacity style={styles.clearBtn} onPress={clearSearchAndFilter}>
            <Text style={styles.clearBtnText}>✕ Clear Search & Filter</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.resultCount}>Showing {displayedItems.length} of {menuItems.length} items</Text>

        <FlatList
          data={displayedItems}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <MenuItemCard item={item} showActions />}
          contentContainerStyle={styles.listContent}
        />

        <TouchableOpacity style={styles.cancelBtn} onPress={clearForm}>
          <Text style={styles.cancelBtnText}>← Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ===== NAVIGATION: Statistics Screen =====
  if (screen === 'stats') {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>📊 Menu Statistics</Text>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Menu Items</Text>
          <Text style={styles.statValueLarge}>{stats.total}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Starters</Text>
          <Text style={styles.statValue}>{stats.starters.count} item(s)</Text>
          <Text style={styles.statAvg}>Avg Price: R{stats.starters.avgPrice}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Main Courses</Text>
          <Text style={styles.statValue}>{stats.mains.count} item(s)</Text>
          <Text style={styles.statAvg}>Avg Price: R{stats.mains.avgPrice}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Desserts</Text>
          <Text style={styles.statValue}>{stats.desserts.count} item(s)</Text>
          <Text style={styles.statAvg}>Avg Price: R{stats.desserts.avgPrice}</Text>
        </View>

        <TouchableOpacity style={styles.cancelBtn} onPress={clearForm}>
          <Text style={styles.cancelBtnText}>← Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return null;
}

// ===== STYLES =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  subheading: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#444',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  navButtons: {
    gap: 15,
    marginTop: 10,
  },
  primaryBtn: {
    backgroundColor: '#2e8b57',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    backgroundColor: '#4a90e2',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelBtn: {
    marginTop: 20,
    padding: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#666',
    fontSize: 15,
  },
  clearBtn: {
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  clearBtnText: {
    color: '#555',
    fontWeight: '600',
  },
  resultCount: {
    textAlign: 'right',
    color: '#777',
    marginVertical: 10,
  },
  listContent: {
    gap: 12,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2e8b57',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cardCourse: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e8b57',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  editBtn: {
    backgroundColor: '#ff9500',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  deleteBtn: {
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  statValueLarge: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2e8b57',
    marginTop: 5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statAvg: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});