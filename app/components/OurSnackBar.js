import { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import AuthContext from '../auth/context';

const OurSnackBar = () => {
  const { user, setUser } = useContext(AuthContext);

  const hideSnackBar = () => {
    setUser((prevData) => {
      return { ...prevData, showSnackBar: false, snackBarMsg: '' };
    });
  };

  return (
    <View style={styles.container}>
      <Snackbar
        style={{
          backgroundColor: 'green',
          borderRadius: 4,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        wrapperStyle={{}}
        elevation={3}
        visible={user.showSnackBar}
        onDismiss={hideSnackBar}
        action={{
          label: 'Ok',
          labelStyle: {
            backgroundColor: '#006600',
            padding: 10,
            borderRadius: 4,
          },
          onPress: () => {
            hideSnackBar();
          },
        }}
      >
        {user.snackBarMsg ? user.snackBarMsg : ''}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OurSnackBar;
