export const getSortTypeEN = (sortType: string) => {
  let sortTypeEN: string = "createdAt";
  switch (sortType) {
    case "최신순":
      sortTypeEN = "createdAt"
      break;
    case "조회순":
      sortTypeEN = "views"
      break;
    case "추천순":
      sortTypeEN = "loves"
      break;
    default :
      break;
  }
  return sortTypeEN;
}

export const getSelectedOTTsKR = (selectedOTTs: string[]): string[] => {

  return selectedOTTs.map((selectedOTT: string) => (
    getSelectedOTTKR(selectedOTT)
  ));
}

export const getSelectedOTTKR = (selectedOTT: string): string => {
  let selectedOTTKR: string = "넷플릭스";
  switch (selectedOTT) {
    case "netflix":
      selectedOTTKR = "넷플릭스"
      break;
    case "disneyPlus":
      selectedOTTKR = "디즈니플러스"
      break;
    case "watcha":
      selectedOTTKR = "왓챠"
      break;
    case "wavve":
      selectedOTTKR = "웨이브"
      break;
    case "tving":
      selectedOTTKR = "티빙"
      break;
    case "laftel":
      selectedOTTKR = "라프텔"
      break;
    case "appleTV":
      selectedOTTKR = "애플TV"
      break;
    case "amazon":
      selectedOTTKR = "프라임비디오"
      break;
    case "welaaa":
      selectedOTTKR = "윌라"
      break;
    default :
      break;
  }
  return selectedOTTKR;
}


export const getTemperatureColor = (avgTemperature: number) => {

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