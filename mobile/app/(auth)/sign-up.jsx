import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import { styles } from "@/assets/styles/auth.styles"
import { COLORS } from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'





export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [error, setError] = React.useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) return

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err) {
      if (err.errors?.[0]?.code === "form_password_length_too_short") {
        setError("Password must be at least 8 characters.");
      } else if (err.errors?.[0]?.code === "form_password_pwned") {
        setError("Password is too common. Please use a stronger password.");
      } else if (err.errors?.[0]?.code === "form_identifier_exists") {
        setError("Email already exists. Please sign in.");
      } else {
        setError(err.errors?.[0]?.message || "An error occurred. Please try again.");
      }
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) return

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.replace('/')
      }
    } catch (err) {
      if (err.errors?.[0]?.code === "form_code_incorrect") {
        setError("Invalid verification code.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  }

  if (pendingVerification) {
    return (
      <View style = {styles.verificationContainer}>
        <Text style= {styles.verificationTitle}>Verify your email</Text>
        {error ? (
  <View style={styles.errorBox}>
    <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity onPress={() => setError("")}>
      <Ionicons name="close" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  </View>
) : null}


        <TextInput

        style = {[styles.verificationInput, error && styles.errorInput]}
          value={code}
          placeholder="Enter verification code"
          placeholderTextColor = "#9A8478" 
          onChangeText={(code) => setCode(code)}
        />

        <TouchableOpacity onPress={onPressVerify} style={styles.button}> 
          <Text style= {styles.buttonText}>Verfiy Email</Text>
        </TouchableOpacity>
        {/* <Button title="Verify Email" onPress={onPressVerify} /> */}
      </View>
    )
  }

  return (
    <KeyboardAwareScrollView
    style= {{flex : 1}}
    contentContainerStyle = {{flexGrow : 1}}
    enableOnAndroid= {true}
  enableAutomaticScroll= {true}
  // extraScrollHeight={60}
  
    
    >

      <View style = {styles.container}>
      <Image source={require("../../assets/revenue-i22.png")} style={styles.illustration} />

      <Text style =  {styles.title}>Create Account</Text>
        {error ? (
  <View style={styles.errorBox}>
    <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity onPress={() => setError("")}>
      <Ionicons name="close" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  </View>
) : null}
      <TextInput
        style={[styles.input, error && styles.errorInput]}
        autoCapitalize="none"
        value={emailAddress}
        placeholderTextColor="#9A8478"
        placeholder="Enter Your Email"
        onChangeText={(email) => setEmailAddress(email)}
      />
      <TextInput
        style={[styles.input, error && styles.errorInput]}
        autoCapitalize="none"
        value={password}
        placeholderTextColor="#9A8478"
        placeholder="Enter Your Password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity style={styles.button}
      onPress={onSignUpPress}>
        <Text style={styles.buttonText}> Sign Up </Text>
      </TouchableOpacity>
      <View style = {styles.footerContainer}>
        <Text style= {styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.linkText}> Sign in </Text>
        </TouchableOpacity>
      </View>
      </View>
    </KeyboardAwareScrollView>
    
  )
}
