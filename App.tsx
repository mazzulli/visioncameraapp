import { useEffect, useState, useRef } from "react";
import {
  StatusBar,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Alert,
  Text,
} from "react-native";
import {
  Camera,
  CameraPosition,
  useCameraDevice,
  useCameraDevices,
  useCameraPermission,
  useMicrophonePermission,
} from "react-native-vision-camera";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "./styles";
import { ResizeMode, Video } from "expo-av";

const { width: widthScreen, height: heightScreen } = Dimensions.get("screen");

export default function App() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const {
    hasPermission: hasMicPermission,
    requestPermission: requestMicPermission,
  } = useMicrophonePermission();
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [permission, setPermission] = useState<null | boolean>(null);
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>("back");
  const [flash, setFlash] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice(cameraPosition);
  const supportsFlash = device?.hasFlash ?? false;

  useEffect(() => {
    (async () => {
      const status = await requestPermission();
      const statusMic = await requestMicPermission();

      if (status && statusMic) {
        setPermission(true);
      }

      const { status: statuaMediaLibrary } =
        await MediaLibrary.requestPermissionsAsync();
      if (statuaMediaLibrary !== "granted") {
        console.log("MEDIA LIBRARY NOT GRANTED");
        setPermission(false);
        return;
      }
    })();
  }, []);

  if (!permission) return <View />;
  if (!device || device === null) return <View />;

  const startRecording = () => {
    if (!cameraRef.current || !device) return;
    if (isRecording) cameraRef.current.cancelRecording();
    setIsRecording(true);
    setPhotoUri(null);
    cameraRef.current.startRecording({
      flash: device.hasFlash && flash ? "on" : "off",
      onRecordingFinished: (video) => {
        console.log("Video recorded:", video);
        setIsRecording(false);
        setVideoUri(video.path);
        setIsModalVisible(true);
      },
      onRecordingError: (error) => {
        console.log("Error recording video:", error);
      },
    });
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      await cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current || !device) return;
    const photo = await cameraRef.current.takePhoto({
      flash: device.hasFlash && flash ? "on" : "off",
    });
    setVideoUri(null);
    setIsRecording(false);
    setPhotoUri(photo.path);
    setIsModalVisible(true);
  };

  function handleCloseModal() {
    setIsModalVisible(false);
  }

  const handleSaveVideo = async () => {
    if (!videoUri && !photoUri) return;
    try {
      if (videoUri) {
        await MediaLibrary.createAssetAsync(videoUri);
        setVideoUri(null);
        Alert.alert("Sucesso", "Video gravado na galeria!");
      }
      if (photoUri) {
        await MediaLibrary.createAssetAsync(photoUri);
        setPhotoUri(null);
        Alert.alert("Sucesso", "Foto gravada na galeria!");
      }
      handleCloseModal();
    } catch (error) {
      console.log("ERRO AO SALVAR");
      console.log(error);
    }
  };

  const handleCameraPosition = () => {
    setCameraPosition(device.position === "front" ? "back" : "front");
    handleFlashActivation;
  };

  const handleFlashActivation = () => {
    setFlash(flash ? false : true);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Camera
        ref={cameraRef}
        device={device}
        isActive={true}
        video={true}
        photo={true}
        audio={true}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleCameraPosition}>
          <MaterialCommunityIcons
            name="camera-flip-outline"
            size={40}
            color={"white"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={takePhoto}>
          <MaterialCommunityIcons
            name="checkbox-blank-circle-outline"
            size={80}
            color={"red"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPressIn={startRecording} onPressOut={stopRecording}>
          <MaterialCommunityIcons
            name="checkbox-blank-circle"
            size={80}
            color={"red"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFlashActivation}>
          <MaterialCommunityIcons
            name={flash ? "flash" : "flash-off"}
            size={40}
            color={flash ? "yellow" : "red"}
          />
        </TouchableOpacity>
      </View>

      <Modal
        onRequestClose={handleCloseModal}
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
      >
        {videoUri ? (
          <View style={styles.showContainer}>
            <Video
              source={{ uri: videoUri }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              shouldPlay
              isLooping
              resizeMode={ResizeMode.COVER}
              style={{ width: widthScreen, height: heightScreen }}
            />
          </View>
        ) : (
          <View style={styles.showContainer}>
            <Image
              style={{ width: widthScreen, height: heightScreen }}
              source={{ uri: `file:// ${photoUri}` }}
              contentFit="cover"
              transition={1000}
            />
          </View>
        )}

        <View style={styles.saveButtonsContainer}>
          <TouchableOpacity onPress={handleCloseModal}>
            <MaterialCommunityIcons
              name={"close-thick"}
              size={40}
              color={"red"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSaveVideo}>
            <MaterialCommunityIcons
              name={"check-bold"}
              size={40}
              color={"#17eb0a"}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
