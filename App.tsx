import React, { useState } from 'react';
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

type MenuItem = {
  id: string;
  dishName: string;
  description: string;
  course: Course;
  price: string;
};

export default function App() {
  const [screen, setScreen] = useState('home');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState<Course>('Main Course');
  const [price, setPrice] = useState('');

  const saveMenuItem = () => {
    if (!dishName.trim()) {
      Alert.alert('Error', 'Please enter a dish name.');
      return;
    }
    if (!price.trim()) {
      Alert.alert('Error', 'Please enter a price.');
      return;
    }
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid positive price.');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      dishName: dishName.trim(),
      description: description.trim() || 'No description provided.',
      course,
      price: parseFloat(price).toFixed(2),
    };

    setMenuItems([...menuItems, newItem]);

    Alert.alert('Success', `${dishName} has been added to the menu!`);

    setDishName('');
    setDescription('');
    setCourse('Main Course');
    setPrice('');
  };

  const cancelForm = () => {
    setDishName('');
    setDescription('');
    setCourse('Main Course');
    setPrice('');
    setScreen('home');
  };

  const renderItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemName}>{item.dishName}</Text>
      <Text style={styles.itemCourse}>{item.course}</Text>
      <Text style={styles.itemDesc}>{item.description}</Text>
      <Text style={styles.itemPrice}>R{item.price}</Text>
    </View>
  );

  const renderHome = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.appTitle}>Menu Manager</Text>
      <Text style={styles.welcome}>Welcome!</Text>
      <Text style={styles.subtitle}>Manage and view restaurant menu items.</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setScreen('add')}
        >
          <Text style={styles.primaryButtonText}>ADD MENU ITEM</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setScreen('view')}
        >
          <Text style={styles.secondaryButtonText}>VIEW MENU</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Users</Text>
        <Text style={styles.infoText}>Christopher – Restaurant Owner</Text>
        <Text style={styles.infoText}>Chef – Manages Menu</Text>
        <Text style={styles.infoText}>Waiter – Views Menu</Text>
        <Text style={styles.infoText}>Cashier – Views Menu & Prices</Text>
      </View>
    </View>
  );

  const renderAddItem = () => (
    <ScrollView contentContainerStyle={styles.screenContainer}>
      <Text style={styles.screenTitle}>Add Menu Item</Text>

      <Text style={styles.label}>Dish Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter dish name"
        value={dishName}
        onChangeText={setDishName}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter description of the dish..."
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Course *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={course}
          onValueChange={(value: Course) => setCourse(value)}
          style={styles.picker}
        >
          <Picker.Item label="Starter" value="Starter" />
          <Picker.Item label="Main Course" value="Main Course" />
          <Picker.Item label="Dessert" value="Dessert" />
        </Picker>
      </View>

      <Text style={styles.label}>Price (R) *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveButton} onPress={saveMenuItem}>
          <Text style={styles.saveButtonText}>SAVE MENU ITEM</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={cancelForm}>
          <Text style={styles.cancelButtonText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderViewItems = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Menu Items</Text>

      {menuItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No menu items have been added yet.</Text>
          <Text style={styles.emptySubtext}>Tap "Add Menu Item" to get started.</Text>
        </View>
      ) : (
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.list}
        />
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => setScreen('home')}>
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.appContainer}>
      {screen === 'home' && renderHome()}
      {screen === 'add' && renderAddItem()}
      {screen === 'view' && renderViewItems()}
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  screenContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#2d3748',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    color: '#2d3748',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#718096',
    marginBottom: 30,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#2d3748',
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#4a5568',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2d3748',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2d3748',
  },
  infoText: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 5,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 6,
    color: '#2d3748',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#2d3748',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e0',
    borderRadius: 8,
    marginBottom: 5,
  },
  picker: {
    height: 50,
  },
  buttonRow: {
    marginTop: 25,
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#2f855a',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#e53e3e',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#2d3748',
    fontSize: 15,
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  itemCard: {
    backgroundColor: '#fff',
    padding: 18,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  itemCourse: {
    fontSize: 13,
    color: '#4299e1',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  itemDesc: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2f855a',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#718096',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#a0aec0',
    marginTop: 8,
    textAlign: 'center',
  },
});