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

export const getPartyCardHeaderText = (memberNum: number, state: string) => {
  let headerTextStr: string = "";

  if (memberNum === 4) {
    headerTextStr = "모집완료";
  } else {
    switch (state) {
      case 'nonActive':
        headerTextStr = "모집중";
        break;
      case 'active':
        headerTextStr = "진행중";
        break;
      case 'finish':
        headerTextStr = "파티종료";
        break;
    }
  }

  return headerTextStr
}

export const getPartyCardHeaderColor = (headerText: string) => {
  let backColor = 'rgb(0 0 0)';

  switch (headerText) {
    case '모집완료':
      backColor = '#08088A';
      break;
    case '모집중':
      backColor = "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)";
      break;
    case '진행중':
      backColor = "#00FF40";
      break;
    case '파티종료':
      backColor = 'rgb(0 0 0)'
      break;
  }

  return backColor
}