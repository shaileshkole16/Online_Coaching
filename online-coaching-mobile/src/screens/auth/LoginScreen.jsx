import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title, HelperText } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('student');
  
  const { login } = useAuth();
  const { showError } = useToast();
  const { colors, isDarkMode } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      showError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password, userType });
      // Navigation will be handled by AppNavigator based on auth state
    } catch (error) {
      showError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="school" size={80} color={colors.primary} />
          </View>
          <Title style={[styles.title, { color: colors.primary }]}>Online Coaching</Title>
          <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            Welcome back! Please login to continue.
          </Text>
        </View>

        <View style={styles.userTypeSelector}>
          <Button
            mode={userType === 'student' ? 'contained' : 'outlined'}
            onPress={() => setUserType('student')}
            style={[styles.userTypeButton, userType === 'student' && { backgroundColor: colors.primary }]}
            compact
          >
            Student
          </Button>
          <Button
            mode={userType === 'teacher' ? 'contained' : 'outlined'}
            onPress={() => setUserType('teacher')}
            style={[styles.userTypeButton, userType === 'teacher' && { backgroundColor: colors.primary }]}
            compact
          >
            Teacher
          </Button>
          <Button
            mode={userType === 'admin' ? 'contained' : 'outlined'}
            onPress={() => setUserType('admin')}
            style={[styles.userTypeButton, userType === 'admin' && { backgroundColor: colors.primary }]}
            compact
          >
            Admin
          </Button>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            textColor={colors.onSurface}
            theme={{ colors: { primary: colors.primary, background: colors.surface } }}
            left={<TextInput.Icon icon="email" color={colors.primary} />}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
            textColor={colors.onSurface}
            theme={{ colors: { primary: colors.primary, background: colors.surface } }}
            left={<TextInput.Icon icon="lock" color={colors.primary} />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
                color={colors.primary}
              />
            }
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={[styles.button, { backgroundColor: colors.primary }]}
            contentStyle={styles.buttonContent}
            labelStyle={{ color: colors.onError }}
          >
            Login as {userType.charAt(0).toUpperCase() + userType.slice(1)}
          </Button>

          <View style={styles.links}>
            <Button
              mode="text"
              onPress={() => navigation.navigate('ForgotPassword')}
              compact
              textColor={colors.primary}
            >
              Forgot Password?
            </Button>
          </View>

          <View style={styles.registerLink}>
            <Text style={[styles.registerText, { color: colors.onSurfaceVariant }]}>
              Don't have an account? 
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Register')}
              compact
              labelStyle={[styles.registerButton, { color: colors.primary }]}
            >
              Register
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  userTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  userTypeButton: {
    flex: 1,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  links: {
    alignItems: 'flex-end',
    marginTop: 5,
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
  },
  registerButton: {
    fontWeight: 'bold',
  },
});

export default LoginScreen;
