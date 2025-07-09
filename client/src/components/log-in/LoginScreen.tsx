import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { View, Button, StyleSheet, TextInput, Text, Alert } from 'react-native';

import { supabase } from '@/config/supabase';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirectUrl = makeRedirectUri({
    scheme: 'your-app-scheme'
  });

  // Step 1: Request OTP code
  const requestOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithOtp({
        email,
      });

      if (error) throw error;
      
      setShowOtpInput(true);
      Alert.alert('Success', 'Check your email for the verification code!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP code
  const verifyOtp = async () => {
    if (!otpCode) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'email'
      });

      if (error) throw error;
      setShowOtpInput(false);
      setOtpCode('');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const signInWithApple = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: redirectUrl,
        },
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Apple:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!showOtpInput}
        />
        
        {!showOtpInput ? (
          <Button 
            title={loading ? "Sending..." : "Send Login Code"} 
            onPress={requestOtp}
            disabled={loading}
          />
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter verification code"
              value={otpCode}
              onChangeText={setOtpCode}
              keyboardType="number-pad"
              maxLength={9}
            />
            <Button 
              title={loading ? "Verifying..." : "Verify Code"} 
              onPress={verifyOtp}
              disabled={loading}
            />
          </>
        )}
      </View>

      <View style={styles.divider}>
        <Text style={styles.dividerText}>OR</Text>
      </View>

      <View style={styles.socialButtons}>
        <Button title="Sign in with Google" onPress={signInWithGoogle} />
        <Button title="Sign in with Apple" onPress={signInWithApple} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputContainer: {
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerText: {
    flex: 1,
    textAlign: 'center',
    color: '#666',
  },
  socialButtons: {
    gap: 10,
  },
}); 