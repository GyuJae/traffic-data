import {
  getDataAvc,
  getDataLocation,
  getDataResultLCS,
  //getDataRoad1Hour,
  getDataRoad1HourEntrance,
  getDataTrafficAmountByLane,
  LCS,
  Road1HourEntrance,
  TrafficAmountByLane,
} from "./api";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";

interface INewRoad1HourEntranceData extends Road1HourEntrance {
  beignUnitName: string;
  beignRouteName: string;
  arvlUnitName: string;
  arvlRouteName: string;
}

const init1 = async () => {
  //const { data: road1HourData } = await getDataRoad1Hour();
  let pageNum = 1;
  const newRoad1HourEntranceData: INewRoad1HourEntranceData[] = [];
  while (true) {
    const {
      data: { result: road1HourEntranceData },
    } = await getDataRoad1HourEntrance(pageNum);

    if (!road1HourEntranceData || road1HourEntranceData.length === 0) {
      break;
    }

    for (const r of road1HourEntranceData) {
      try {
        const obj: INewRoad1HourEntranceData = {
          ...r,
          beignUnitName: "",
          beignRouteName: "",
          arvlUnitName: "",
          arvlRouteName: "",
        };
        const beginUnitCode = r.BEGIN_BUZPLC_CD.replace(/ /g, "");
        const arvlUnitCode = r.ARVL_BUZPLC_CD.replace(/ /g, "");
        const {
          data: { list: beignList },
        } = await getDataLocation(beginUnitCode);
        const {
          data: { list: arvlList },
        } = await getDataLocation(arvlUnitCode);
        if (
          !beignList[0].unitName ||
          !beignList[0].routeName ||
          !arvlList[0].unitName ||
          !arvlList[0].routeName
        ) {
          continue;
        }
        obj["beignUnitName"] = beignList[0].unitName;
        obj["beignRouteName"] = beignList[0].routeName;
        obj["arvlUnitName"] = arvlList[0].unitName;
        obj["arvlRouteName"] = arvlList[0].routeName;
        newRoad1HourEntranceData.push(obj);
      } catch (error) {
        console.log(error);
      }
    }
    pageNum++;
  }
  const init1csvWriter = createCsvWriter({
    path: "out.csv",
    header: [
      { id: "SM_DE", title: "집계일자" },
      { id: "SM_HOUR", title: "집계시" },
      { id: "BEGIN_BUZPLC_CD", title: "시작영업소코드" },
      { id: "ARVL_BUZPLC_CD", title: "도착영업소코드" },
      { id: "TCS_VHCTY_SE_CD", title: "TCS차종구분코드" },
      { id: "START_ARVL_STDR_SE_CD", title: "출발도착기준구분코드" },
      { id: "PASNG_TIME", title: "통행시간" },
      { id: "SMTHG_BEFORE_PASNG_TIME", title: "평활화전통행시간" },
      { id: "AVRG_VE", title: "평균속도" },
      { id: "BUZPLC_REVISN_SE_CD", title: "영업소간보정구분코드" },
      { id: "VMTC", title: "교통량" },
      { id: "VALID_VMTC", title: "유효교통량" },
      { id: "PASNG_TIME_STD_DCLN", title: "통행시간표준편차" },
      { id: "PASNG_TIME_CHNGE_CFFCNT", title: "통행시간변동계수" },
      { id: "PASNG_TIME_MVL", title: "통행시간최대값" },
      { id: "PASNG_TIME_MEDIAN", title: "통행시간중위값" },
      { id: "PASNG_TIME_MNVL", title: "통행시간최소값" },
      { id: "PCTL1585_PASNG_TIME", title: "퍼센타일15_85통행시간" },
      { id: "LAST_CHANGE_TIME", title: "최종변경시각" },
      { id: "beignUnitName", title: "시작영업소이름" },
      { id: "beignRouteName", title: "시작도로이름" },
      { id: "arvlUnitName", title: "도착영업소이름" },
      { id: "arvlRouteName", title: "도착도로이름" },
    ],
  });

  init1csvWriter
    .writeRecords(newRoad1HourEntranceData)
    .then(() => console.log("The CSV file was written successfully"));
};

const init2 = async () => {
  let pageNum = 1;
  const newData: TrafficAmountByLane[] = [];
  while (true) {
    console.log(`current:${pageNum}`);
    const {
      data: { list },
    } = await getDataTrafficAmountByLane(pageNum);
    if (list.length === 0 || !list) {
      break;
    }
    newData.push(...list);
    pageNum++;
  }

  const csvWriter = createCsvWriter({
    path: "TrafficAmountByLane.csv",
    header: [
      { id: "unitName", title: "도로이름" },
      { id: "stdDate", title: "기준일자" },
      { id: "startUnitName", title: "출발목적지" },
      { id: "unitCode", title: "영업소코드" },
      { id: "tcsCarTypeNm", title: "TCS차종구분명" },
      { id: "tcsCarTypeCd", title: "TCS차종구분코드" },
      { id: "tcsCarTypeGrpCd", title: "TCS차종유형구분코드" },
      { id: "tcsCarTypeGrpNm", title: "TCS차종유형구분명" },
      { id: "trafficAmout", title: "교통량" },
      { id: "pageNo", title: "출력페이지번호" },
      { id: "numOfRows", title: "한페이지당출력건수" },
      { id: "pageSize", title: "총페이지건수" },
      { id: "inoutName", title: "inoutName" },
      { id: "centerCode", title: "centerCode" },
      { id: "centerName", title: "centerName" },
      { id: "sumTmUnitTypeCode", title: "sumTmUnitTypeCode" },
      { id: "startEndStdTypeCode", title: "startEndStdTypeCode" },
      { id: "stdHour", title: "stdHour" },
      { id: "brofCode", title: "brofCode" },
      { id: "brofName", title: "brofName" },
    ],
  });
  csvWriter
    .writeRecords(newData)
    .then(() => console.log("The CSV file was written successfully"));
};

const init3 = async (criteriaDate: string) => {
  let pageNum = 1;
  const newData: LCS[] = [];
  while (true) {
    console.log(`✅ current ${criteriaDate} LCS:${pageNum}`);
    const {
      data: { lcsTrafficLists },
    } = await getDataResultLCS(pageNum, criteriaDate);
    if (lcsTrafficLists.length === 0 || !lcsTrafficLists) {
      break;
    }
    newData.push(...lcsTrafficLists);
    pageNum++;
  }
  const csvWriter = createCsvWriter({
    path: `LCS/LCS${criteriaDate}.csv`,
    header: [
      { id: "term", title: "term" },
      { id: "routeNo", title: "routeNo" },
      { id: "trafficAmout", title: "trafficAmout" },
      { id: "conzoneId", title: "conzoneId" },
      { id: "laneTypeCode", title: "laneTypeCode" },
      { id: "updownType", title: "updownType" },
      { id: "sumTmUnitTypeCode", title: "sumTmUnitTypeCode" },
      { id: "vdsId", title: "vdsId" },
      { id: "speed", title: "speed" },
      { id: "laneTypeNm", title: "laneTypeNm" },
      { id: "conzoneNm", title: "conzoneNm" },
      { id: "criteriaDate", title: "criteriaDate" },
      { id: "sTime", title: "sTime" },
      { id: "roadShift", title: "roadShift" },
      { id: "dlcnLength", title: "dlcnLength" },
    ],
  });
  await csvWriter
    .writeRecords(newData)
    .then(() =>
      console.log(`The ${criteriaDate} CSV file was written successfully`)
    );
};

const criteriaDates = [
  "20211001",
  "20211002",
  "20211003",
  "20211004",
  "20211005",
  "20211006",
  "20211007",
  "20211008",
  "20211009",
  "20211010",
  "20211011",
  "20211012",
  "20211013",
  "20211014",
  "20211015",
];

// for (const criteriaDate of criteriaDates) {
//   init3(criteriaDate);
// }

const init5 = async () => {
  try {
    const { data } = await getDataAvc();
    const csvWriter = createCsvWriter({
      path: `AVC/AVC.csv`,
      header: [
        { id: "routeNo", title: "집계일자" },
        { id: "routeNm", title: "집계시분" },
        { id: "avcId", title: "AVC_ID" },
        { id: "totlDates", title: "차로번호" },
        { id: "totlHhmm", title: "기점종점방향구분코드" },
        { id: "crgwNo", title: "수집상세일자" },
        { id: "drctClssCd", title: "노선번호" },
        { id: "gthrDetlDates", title: "노선명" },
        { id: "cnznId", title: "콘존ID" },
        { id: "cnznNm", title: "콘존명" },
        { id: "roadDstnc", title: "도로이정" },
        { id: "avcDstnc", title: "AVC이정" },
        { id: "avgSped1", title: "1종평균속도" },
        { id: "avgSped2", title: "2종평균속도" },
        { id: "avgSped3", title: "3종평균속도" },
        { id: "avgSped4", title: "4종평균속도" },
        { id: "avgSped5", title: "5종평균속도" },
        { id: "avgSped6", title: "6종평균속도" },
        { id: "avgSped7", title: "7종평균속도" },
        { id: "avgSped8", title: "8종평균속도" },
        { id: "avgSped9", title: "9종평균속도" },
        { id: "avgSped10", title: "10종평균속도" },
        { id: "avgSped11", title: "11종평균속도" },
        { id: "avgSped12", title: "12종평균속도" },
        { id: "ucsdKncrAvgSped", title: "미분류차종평균속도" },
        { id: "trfv1", title: "1종교통량" },
        { id: "trfv2", title: "2종교통량" },
        { id: "trfv3", title: "3종교통량" },
        { id: "trfv4", title: "4종교통량" },
        { id: "trfv5", title: "5종교통량" },
        { id: "trfv6", title: "6종교통량" },
        { id: "trfv7", title: "7종교통량" },
        { id: "trfv8", title: "8종교통량" },
        { id: "trfv9", title: "9종교통량" },
        { id: "trfv10", title: "10종교통량" },
        { id: "trfv11", title: "11종교통량" },
        { id: "trfv12", title: "12종교통량" },
        { id: "ucsdKncrTrfv", title: "미분류차종교통량" },
      ],
    });

    await csvWriter
      .writeRecords(data.list)
      .then(() => console.log(`The  CSV file was written successfully`));
  } catch (error) {
    console.log("This is error:", error);
  }
};

init5();
