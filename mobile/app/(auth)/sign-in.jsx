import { styles } from '@/assets/styles/auth.styles'
import { COLORS } from '@/constants/colors'
import { useSignIn } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function Page() {
  const { signIn, setActive } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')

  const onSignInPress = async () => {
    if (!signIn) return

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      }
    } catch (err) {
      if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("Invalid Credentials");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  }

  return (
    <KeyboardAwareScrollView
      style= {{flex : 1}}
    contentContainerStyle = {{flexGrow : 1}}
    enableOnAndroid= {true}
  enableAutomaticScroll= {true}
  // extraScrollHeight={60}
    
    >

      <View style={styles.container}>
        <Image source={require("../../assets/revenue-i4.png")} style={styles.illustration} />
      <Text style = {styles.title}>Welcom Back</Text>

       {error ? (
  <View style={styles.errorBox}>
    <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity  onPress={() => setError("")}>
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
           onPress={onSignInPress}>
             <Text style={styles.buttonText}> Sign in </Text>
           </TouchableOpacity>
       <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Link href="/sign-up" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Sign up</Text>
                </TouchableOpacity>
              </Link>
            </View>
      </View>
    </KeyboardAwareScrollView>
  )
}
