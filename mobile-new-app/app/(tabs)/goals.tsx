import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, FAB, Portal, Modal, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { Goal } from '../../src/types';
import { goalsApi } from '../../src/services/api';
import { logger } from '../../src/utils/logger';

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    description: '',
    target_date: new Date().toISOString(),
    category: 'workout' as Goal['category']
  });

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await goalsApi.getAll();
      setGoals(response.data || []);
    } catch (error) {
      logger.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  // ... остальной код компонента остается тем же ...
} 