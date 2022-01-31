const useTemperatureColor = (avgTemperature: number) => {

  let textColor = "blue";

  if (avgTemperature < 30) {
    textColor = "gray";
  } else if (40 <= avgTemperature && avgTemperature < 50) {
    textColor = "orange";
  } else if (50 <= avgTemperature) {
    textColor = "red";
  }
  return textColor

}

export default useTemperatureColor;