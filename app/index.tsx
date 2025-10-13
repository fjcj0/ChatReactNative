import { appIcon, colors, startIcon } from "@/constant";
import { useRouter } from "expo-router";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const onStartApp = () => {
    router.replace('/signin');
  };

  return (
    <SafeAreaView style={styles.containerStart}>
      <View style={styles.containerHeader}>
        <Image source={appIcon} style={styles.imageHeaderStyle} />
      </View>

      <View style={styles.containerBody}>
        <View style={styles.containerImage}>
          <Image source={startIcon} style={styles.imageStyle} />
        </View>

        <View style={styles.containerText}>
          <Text style={styles.textStyle}>
            Stay Connected With Your Friends And Your Family
          </Text>
        </View>

        <TouchableOpacity style={styles.buttonStyle} onPress={onStartApp}>
          <Text style={styles.textButton}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerStart: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  containerHeader: {
    height: height * 0.23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageHeaderStyle: {
    width: width * 0.5,
    height: '100%',
    resizeMode: 'contain',
  },
  containerBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 20,
  },
  containerImage: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  imageStyle: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: 'contain',
  },
  containerText: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },
  textStyle: {
    color: colors.primary,
    fontSize: 35,
    fontWeight: 'bold',
  },
  buttonStyle: {
    width: '90%',
    height: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  textButton: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 24,
  },
});