import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Switch, Divider, useTheme } from 'react-native-paper';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();
  const { logout, user } = useAuth();
  const paperTheme = useTheme();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <List.Section>
        <List.Subheader style={{ color: colors.primary }}>Appearance</List.Subheader>
        
        <List.Item
          title="Dark Mode"
          description="Enable dark theme"
          left={(props) => <List.Icon {...props} icon="theme-light-dark" color={colors.primary} />}
          right={() => (
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              color={colors.primary}
            />
          )}
          style={{ backgroundColor: colors.surface }}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader style={{ color: colors.primary }}>Account</List.Subheader>
        
        <List.Item
          title="Profile"
          description="Manage your profile"
          left={(props) => <List.Icon {...props} icon="account" color={colors.primary} />}
          onPress={() => navigation.navigate('Profile')}
          style={{ backgroundColor: colors.surface }}
        />
        
        <List.Item
          title="Notifications"
          description="Manage notification preferences"
          left={(props) => <List.Icon {...props} icon="bell" color={colors.primary} />}
          onPress={() => navigation.navigate('Notifications')}
          style={{ backgroundColor: colors.surface }}
        />
        
        <List.Item
          title="Security"
          description="Password and security settings"
          left={(props) => <List.Icon {...props} icon="shield" color={colors.primary} />}
          onPress={() => navigation.navigate('Security')}
          style={{ backgroundColor: colors.surface }}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader style={{ color: colors.primary }}>Support</List.Subheader>
        
        <List.Item
          title="Help Center"
          description="Get help and support"
          left={(props) => <List.Icon {...props} icon="help-circle" color={colors.primary} />}
          onPress={() => navigation.navigate('Help')}
          style={{ backgroundColor: colors.surface }}
        />
        
        <List.Item
          title="About"
          description="App version and information"
          left={(props) => <List.Icon {...props} icon="information" color={colors.primary} />}
          onPress={() => navigation.navigate('About')}
          style={{ backgroundColor: colors.surface }}
        />
      </List.Section>

      <Divider />

      <List.Section>
        <List.Item
          title="Logout"
          description="Sign out of your account"
          left={(props) => <List.Icon {...props} icon="logout" color={colors.error} />}
          onPress={handleLogout}
          style={{ backgroundColor: colors.surface }}
          titleStyle={{ color: colors.error }}
        />
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingsScreen;
