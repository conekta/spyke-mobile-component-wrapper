import Constants from 'expo-constants';
import { StyleSheet, View } from 'react-native';
import ComponentMobileWrapper from '@/components/componentMobileWrapper/componentMobileWrapper';
import { IframeCallbacks } from '@/components/componentMobileWrapper/dtos';

export default function HomeScreen() {
  const config = {
    locale: 'es',
    publicKey: 'key_xxxx',
    targetIFrame: '#example',
  };
  const options = {
    backgroundMode: 'darkMode',
    colorPrimary: '#2C4CF5',
    colorLabel: '#B4B5D3',
    colorText: '#B4B5D3',
    inputType: 'flatMode',
    hideLogo: false,
  };

  const callbacks: IframeCallbacks = {
    onGetInfoSuccess: (performanceMeasure)=>{
      console.log("Loading time:", performanceMeasure.initLoadTime);
    },
    onErrorPayment: (error)=>{
      console.log("Error in payment component:", error);
    },
    onFinalizePayment:(order)=>{
      console.log("The payment has been success, order data:", order)
    }
  }
  return (
    <View style={styles.container}>
    <ComponentMobileWrapper config={config} options={options} callbacks={callbacks} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  webv:{
    flex: 1
  }
});