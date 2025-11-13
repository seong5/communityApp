import Button from '@/components/common/Button'
import { Link, router } from 'expo-router'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AuthScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/main-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button label="이메일로 로그인하기" onPress={() => router.push('/auth/login')} />
          <Link href={'/auth/signup'} style={styles.signup}>
            이메일로 회원가입
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
  },
  logo: {
    width: 500,
    height: 350,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  signup: {
    marginTop: 10,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
})
