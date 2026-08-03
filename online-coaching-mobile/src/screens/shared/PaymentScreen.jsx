import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Button, Title, Paragraph, Divider, useTheme } from 'react-native-paper';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import paymentService from '../../services/paymentService';
import { enrollmentAPI } from '../../services/api';
import { Ionicons } from '@expo/vector-icons';

const PaymentScreen = ({ route, navigation }) => {
  const { course } = route.params;
  const { user } = useAuth();
  const { colors } = useCustomTheme();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('full');

  const plans = [
    {
      id: 'full',
      name: 'Full Course',
      price: course.price || 999,
      description: 'Access to all lectures, assignments, and quizzes',
      features: ['All video lectures', 'Assignments', 'Quizzes', 'Certificate', 'Lifetime access'],
      popular: true,
    },
    {
      id: 'basic',
      name: 'Basic Access',
      price: Math.floor((course.price || 999) * 0.7),
      description: 'Access to video lectures only',
      features: ['Video lectures', 'Basic materials'],
      popular: false,
    },
  ];

  const handlePayment = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to enroll in this course');
      return;
    }

    setLoading(true);
    try {
      // Create order first (this would call your backend)
      const orderResult = await paymentService.createOrder(
        selectedPlan === 'full' ? plans[0].price : plans[1].price,
        'INR',
        `course_${course.id}_${user.id}`
      );

      if (!orderResult.success) {
        Alert.alert('Error', 'Failed to create payment order');
        return;
      }

      // Initiate payment
      const paymentResult = await paymentService.initiatePayment({
        amount: selectedPlan === 'full' ? plans[0].price : plans[1].price,
        currency: 'INR',
        orderId: orderResult.orderId,
        description: `Enrollment: ${course.title}`,
        name: 'Online Coaching',
        email: user.email,
        contact: user.phone,
        notes: {
          courseId: course.id,
          userId: user.id,
          plan: selectedPlan,
        },
      });

      if (paymentResult.success) {
        // Enroll student after successful payment
        const enrollmentResult = await enrollmentAPI.enrollStudent(user.id, course.id);
        
        if (enrollmentResult.data) {
          Alert.alert(
            'Payment Successful',
            'You have been successfully enrolled in the course!',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('CourseDetail', { courseId: course.id }),
              },
            ]
          );
        }
      } else {
        Alert.alert('Payment Failed', paymentResult.error || 'Payment was not successful');
      }
    } catch (error) {
      console.log('Payment error:', error);
      Alert.alert('Error', 'An error occurred during payment processing');
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanData = plans.find((plan) => plan.id === selectedPlan);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Title style={[styles.title, { color: colors.primary }]}>Complete Your Enrollment</Title>
        <Paragraph style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
          {course.title}
        </Paragraph>
      </View>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <View style={styles.courseInfo}>
            <Ionicons name="book" size={40} color={colors.primary} />
            <View style={styles.courseDetails}>
              <Title style={{ color: colors.onSurface }}>{course.title}</Title>
              <Paragraph style={{ color: colors.onSurfaceVariant }}>
                {course.description || 'Comprehensive course with expert instruction'}
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Title style={[styles.sectionTitle, { color: colors.primary }]}>Choose Your Plan</Title>

      {plans.map((plan) => (
        <Card
          key={plan.id}
          style={[
            styles.planCard,
            selectedPlan === plan.id && styles.selectedPlan,
            { 
              backgroundColor: colors.surface,
              borderColor: selectedPlan === plan.id ? colors.primary : colors.surfaceVariant,
            },
          ]}
          onPress={() => setSelectedPlan(plan.id)}
        >
          <Card.Content>
            <View style={styles.planHeader}>
              <View>
                <Title style={{ color: colors.onSurface }}>{plan.name}</Title>
                <Paragraph style={{ color: colors.onSurfaceVariant }}>
                  {plan.description}
                </Paragraph>
              </View>
              {plan.popular && (
                <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.popularText}>POPULAR</Text>
                </View>
              )}
            </View>
            <Divider style={styles.divider} />
            <View style={styles.planFeatures}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.feature}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  <Text style={[styles.featureText, { color: colors.onSurface }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.priceContainer}>
              <Title style={[styles.price, { color: colors.primary }]}>
                ₹{plan.price}
              </Title>
              <Text style={[styles.priceLabel, { color: colors.onSurfaceVariant }]}>
                one-time payment
              </Text>
            </View>
          </Card.Content>
        </Card>
      ))}

      <Card style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.onSurfaceVariant }]}>
              Selected Plan:
            </Text>
            <Text style={[styles.summaryValue, { color: colors.onSurface }]}>
              {selectedPlanData.name}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.onSurfaceVariant }]}>
              Total Amount:
            </Text>
            <Title style={[styles.summaryPrice, { color: colors.primary }]}>
              ₹{selectedPlanData.price}
            </Title>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handlePayment}
        loading={loading}
        disabled={loading}
        style={[styles.payButton, { backgroundColor: colors.primary }]}
        contentStyle={styles.payButtonContent}
        labelStyle={{ color: colors.onError }}
      >
        Pay ₹{selectedPlanData.price}
      </Button>

      <View style={styles.securityNote}>
        <Ionicons name="shield-checkmark" size={20} color={colors.success} />
        <Text style={[styles.securityText, { color: colors.onSurfaceVariant }]}>
          Secure payment powered by Razorpay
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
  },
  card: {
    marginBottom: 20,
    elevation: 2,
  },
  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseDetails: {
    flex: 1,
    marginLeft: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  planCard: {
    marginBottom: 15,
    borderWidth: 2,
    elevation: 2,
  },
  selectedPlan: {
    elevation: 4,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  popularBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 10,
  },
  planFeatures: {
    marginBottom: 10,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  priceLabel: {
    fontSize: 12,
  },
  summaryCard: {
    marginBottom: 20,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  summaryPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  payButton: {
    marginBottom: 20,
  },
  payButtonContent: {
    paddingVertical: 12,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  securityText: {
    marginLeft: 8,
    fontSize: 12,
  },
});

export default PaymentScreen;
