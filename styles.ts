import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    padding: 20,
    position: "absolute",
    bottom: 0,
    height: 180,
    width: "100%",
    opacity: 0.5,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    backgroundColor: "#000",
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 99,
    borderWidth: 7,
    borderColor: "red",
  },
  buttonPhoto: {
    width: 70,
    height: 70,
    borderRadius: 99,
    borderWidth: 35,
    borderColor: "red",
  },
  showContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  saveButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    alignContent: "center",
    padding: 20,
    position: "absolute",
    bottom: 0,
    height: 180,
    width: "100%",
    opacity: 0.5,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    backgroundColor: "#000",
  },
});
