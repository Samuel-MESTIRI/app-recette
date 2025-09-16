import { BorderRadius, Colors, FontSizes, Shadows, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ViewStyle,
} from 'react-native';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible: boolean;
  title?: string;
  message?: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'default';
  buttons?: AlertButton[];
  onDismiss?: () => void;
  backdropDismiss?: boolean;
}

export default function CustomAlert({
  visible,
  title,
  message,
  type = 'default',
  buttons = [{ text: 'OK', style: 'default' }],
  onDismiss,
  backdropDismiss = true,
}: CustomAlertProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'warning':
        return colors.warning;
      case 'info':
        return colors.info;
      default:
        return colors.primary;
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '';
    }
  };

  const handleBackdropPress = () => {
    if (backdropDismiss && onDismiss) {
      onDismiss();
    }
  };

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.lg,
    } as ViewStyle,
    container: {
      backgroundColor: colors.backgroundWhite,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      minWidth: 280,
      maxWidth: '90%',
      ...Shadows.lg,
      shadowColor: colors.shadow,
    } as ViewStyle,
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: title && message ? Spacing.sm : 0,
    } as ViewStyle,
    icon: {
      fontSize: FontSizes.lg,
      marginRight: Spacing.sm,
    } as TextStyle,
    title: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    } as TextStyle,
    message: {
      fontSize: FontSizes.base,
      color: colors.textSecondary,
      lineHeight: FontSizes.base * 1.4,
      marginBottom: buttons.length > 0 ? Spacing.lg : 0,
    } as TextStyle,
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: Spacing.sm,
    } as ViewStyle,
    button: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.sm,
      minWidth: 80,
      alignItems: 'center',
    } as ViewStyle,
    buttonDefault: {
      backgroundColor: colors.primary,
    } as ViewStyle,
    buttonCancel: {
      backgroundColor: colors.backgroundSecondary,
    } as ViewStyle,
    buttonDestructive: {
      backgroundColor: colors.error,
    } as ViewStyle,
    buttonTextDefault: {
      color: colors.backgroundWhite,
      fontSize: FontSizes.base,
      fontWeight: '500',
    } as TextStyle,
    buttonTextCancel: {
      color: colors.text,
      fontSize: FontSizes.base,
      fontWeight: '500',
    } as TextStyle,
    buttonTextDestructive: {
      color: colors.backgroundWhite,
      fontSize: FontSizes.base,
      fontWeight: '500',
    } as TextStyle,
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {(title || type !== 'default') && (
                <View style={styles.header}>
                  {type !== 'default' && (
                    <Text style={styles.icon}>{getTypeIcon()}</Text>
                  )}
                  {title && <Text style={styles.title}>{title}</Text>}
                </View>
              )}
              
              {message && <Text style={styles.message}>{message}</Text>}
              
              {buttons.length > 0 && (
                <View style={styles.buttonsContainer}>
                  {buttons.map((button, index) => {
                    const buttonStyle = [
                      styles.button,
                      button.style === 'cancel' && styles.buttonCancel,
                      button.style === 'destructive' && styles.buttonDestructive,
                      button.style === 'default' && styles.buttonDefault,
                    ];
                    
                    const textStyle = [
                      button.style === 'cancel' && styles.buttonTextCancel,
                      button.style === 'destructive' && styles.buttonTextDestructive,
                      button.style === 'default' && styles.buttonTextDefault,
                    ];

                    return (
                      <TouchableOpacity
                        key={index}
                        style={buttonStyle}
                        onPress={() => handleButtonPress(button)}
                        activeOpacity={0.7}
                      >
                        <Text style={textStyle}>{button.text}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// Hook pour faciliter l'utilisation
export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = React.useState<CustomAlertProps | null>(null);

  const showAlert = React.useCallback((config: Omit<CustomAlertProps, 'visible' | 'onDismiss'>) => {
    setAlertConfig({
      ...config,
      visible: true,
      onDismiss: () => setAlertConfig(null),
    });
  }, []);

  const hideAlert = React.useCallback(() => {
    setAlertConfig(null);
  }, []);

  const AlertComponent = React.useMemo(() => {
    if (!alertConfig) return null;
    return <CustomAlert {...alertConfig} />;
  }, [alertConfig]);

  return {
    showAlert,
    hideAlert,
    AlertComponent,
  };
};

// Fonctions utilitaires pour remplacer Alert.alert
export const showSuccessAlert = (
  showAlert: ReturnType<typeof useCustomAlert>['showAlert'],
  title?: string,
  message?: string,
  buttons?: AlertButton[]
) => {
  showAlert({
    type: 'success',
    title,
    message,
    buttons: buttons || [{ text: 'OK', style: 'default' }],
  });
};

export const showErrorAlert = (
  showAlert: ReturnType<typeof useCustomAlert>['showAlert'],
  title?: string,
  message?: string,
  buttons?: AlertButton[]
) => {
  showAlert({
    type: 'error',
    title,
    message,
    buttons: buttons || [{ text: 'OK', style: 'default' }],
  });
};

export const showConfirmAlert = (
  showAlert: ReturnType<typeof useCustomAlert>['showAlert'],
  title?: string,
  message?: string,
  onConfirm?: () => void,
  onCancel?: () => void
) => {
  showAlert({
    type: 'default',
    title,
    message,
    buttons: [
      { text: 'Annuler', style: 'cancel', onPress: onCancel },
      { text: 'Confirmer', style: 'default', onPress: onConfirm },
    ],
  });
};