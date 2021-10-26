import axios, { AxiosResponse } from "axios";

//전국 고속도로(재정+민자) 교통량 통계 데이터(1시간 단위)
const instanceRoad1Hour = axios.create({
  baseURL: "https://bigdata-transportation.kr/api/ex/buzplc/sum/trfc/1hour?",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Auth-Token":
      "08FFFD7293DAC7F9D5A48E5F4F32F03ED6646BC9F83D2EF4D83F0524F9EAE5A0",
  },
});

interface Road1Hour {
  SM_DE: string; // 집계 일자
  SM_HOUR: string; // 집계 시분
  FRWY_OPER_INSTT_SE_CD: string; // 고속도로운영기관구분코드
  TCS_VHCTY_SE_CD: string; //TCS차종구분코드
  TCS_HIPAS_SE_CD: string; // TCS하이패스구분코드
  VMTC: number; // 교통량
  LAST_CHANGE_TIME: string; // 최종변경시각
}

interface Praram {
  pageNo: number;
  pageLimit: number;
  startDate: string;
  endDate: string;
}

interface ResultRoad1Hour {
  totalCount: number;
  requestParam: Praram;
  result: Road1Hour[];
}

// pageNum 1,2
export const getDataRoad1Hour = (
  pageNo: number = 1
): Promise<AxiosResponse<ResultRoad1Hour, any>> =>
  instanceRoad1Hour.get<ResultRoad1Hour>("/", {
    params: {
      pageNo,
      startDate: "20210101",
      endDate: "20211010",
    },
  });

//
const instanceRoad1HourEntrance = axios.create({
  baseURL: "https://bigdata-transportation.kr/api/ex/bboc/comm/info/1hour?",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Auth-Token":
      "08FFFD7293DAC7F9D5A48E5F4F32F03ED6646BC9F83D2EF4D83F0524F9EAE5A0",
  },
});

export interface Road1HourEntrance {
  SM_DE: string; //집계일자
  SM_HOUR: string; //집계시
  BEGIN_BUZPLC_CD: string; //시작영업소코드
  ARVL_BUZPLC_CD: string; //도착영업소코드
  TCS_VHCTY_SE_CD: string; //TCS차종구분코드
  START_ARVL_STDR_SE_CD: string; //출발도착기준구분코드
  PASNG_TIME: number; //통행시간
  SMTHG_BEFORE_PASNG_TIME: number; //평활화전통행시간
  AVRG_VE: number; //평균속도
  BUZPLC_REVISN_SE_CD: string; //영업소간보정구분코드
  VMTC: number; //교통량
  VALID_VMTC: number; //유효교통량
  PASNG_TIME_STD_DCLN: number; //통행시간표준편차
  PASNG_TIME_CHNGE_CFFCNT: number; //통행시간변동계수
  PASNG_TIME_MVL: number; //통행시간최대값
  PASNG_TIME_MEDIAN: number; //통행시간중위값
  PASNG_TIME_MNVL: number; //통행시간최소값
  PCTL1585_PASNG_TIME: number; //퍼센타일15_85통행시간
  LAST_CHANGE_TIME: string; //최종변경시각
}

interface ResultRoad1HourEntrance {
  totalCount: number;
  requestParam: Praram;
  result: Road1HourEntrance[];
}

export const getDataRoad1HourEntrance = (
  pageNo: number = 1
): Promise<AxiosResponse<ResultRoad1HourEntrance, any>> =>
  instanceRoad1HourEntrance.get<ResultRoad1HourEntrance>("/", {
    params: {
      pageNo,
      startDate: "20210101",
      endDate: "20211010",
    },
  });

// link apiKey = 59c677fbd617c599f8a9919d32d47e437b2a7244

// 한국도로공사 7783395713
const instanceLocation = axios.create({
  baseURL: "http://data.ex.co.kr/openapi/locationinfo/locationinfoUnit",
});

interface Location {
  unitName: string;
  pageNo: number | null;
  numOfRows: number | null;
  unitCode: string;
  routeName: string;
  routeNo: string;
  xValue: string;
  yValue: string;
}

interface LocationResult {
  count: number;
  list: Location[];
  pageNo: number;
  numOfRows: number;
  pageSize: number;
  message: string;
  code: string;
}

export const getDataLocation = (
  unitCode: string
): Promise<AxiosResponse<LocationResult, any>> =>
  instanceLocation.get("", {
    params: {
      key: "7783395713",
      type: "json",
      unitCode,
      numOfRows: 10,
      pageNo: 1,
    },
  });

const instanceTrafficAmountByLane = axios.create({
  baseURL: "http://data.ex.co.kr/openapi/odtraffic/trafficAmountByLane",
});

export interface TrafficAmountByLane {
  unitName: string; //도로이름
  stdDate: string; //기준일자
  startUnitName: string; //출발목적지
  unitCode: string; //영업소코드
  tcsCarTypeNm: string; //TCS차종구분명
  tcsCarTypeCd: string; //TCS차종구분코드
  tcsCarTypeGrpCd: string; //TCS차종유형구분코드
  tcsCarTypeGrpNm: string; //TCS차종유형구분명
  trafficAmout: string; //교통량
  pageNo: string; //출력페이지번호
  numOfRows: string; //한페이지당출력건수
  pageSize: string; //총페이지건수
  inoutName: string; //inoutName
  centerCode: string; // centerCode
  centerName: string; //centerName
  sumTmUnitTypeCode: string; //sumTmUnitTypeCode
  startEndStdTypeCode: string; //startEndStdTypeCode
  stdHour: string; // stdHour
  brofCode: string; // brofCode
  brofName: string; // brofName
}

interface ResultTrafficAmountByLane {
  list: TrafficAmountByLane[];
  count: number;
  pageNo: number;
  numOfRows: number;
  pageSize: number;
  message: string;
  code: string;
}

export const getDataTrafficAmountByLane = (
  pageNo: number
): Promise<AxiosResponse<ResultTrafficAmountByLane, any>> =>
  instanceTrafficAmountByLane.get<ResultTrafficAmountByLane>("", {
    params: {
      key: "7783395713",
      type: "json",
      sumTmUnitTypeCode: "3",
      startEndStdTypeCode: "2",
      numOfRows: "100",
      pageNo: pageNo + "",
    },
  });
//LCS운영구간 교통량
const instanceLCS = axios.create({
  baseURL: "http://data.ex.co.kr/openapi/trafficOprgPrcd/lcsSctnTrfl",
});

export interface LCS {
  term: string;
  routeNo: string;
  trafficAmout: string;
  conzoneId: string;
  laneTypeCode: string;
  updownType: string;
  sumTmUnitTypeCode: string;
  vdsId: string;
  speed: string;
  laneTypeNm: string;
  conzoneNm: string;
  criteriaDate: string;
  sTime: string;
  roadShift: string;
  dlcnLength: string;
}

interface ResultLCS {
  lcsTrafficLists: LCS[];
  count: number;
  pageNo: number;
  numOfRows: number;
  pageSize: number;
  message: string;
  code: string;
}

export const getDataResultLCS = (
  pageNo: number,
  criteriaDate: string
): Promise<AxiosResponse<ResultLCS, any>> =>
  instanceLCS.get<ResultLCS>("", {
    params: {
      key: "7783395713",
      type: "json",
      sumTmUnitTypeCode: "3",
      startEndStdTypeCode: "2",
      criteriaDate,
      updownType: "E",
      numOfRows: "100",
      pageNo: pageNo + "",
    },
  });

const instanceAVC = axios.create({
  baseURL: "http://data.ex.co.kr/openapi/avcinfo/avcOg15DataList",
});
export interface AVC {
  routeNo: string;
  routeNm: string;
  avcId: string;
  totlDates: string;
  totlHhmm: string;
  crgwNo: string;
  drctClssCd: string;
  gthrDetlDates: string;
  cnznId: string;
  cnznNm: string;
  roadDstnc: string;
  avcDstnc: string;
  avgSped1: string;
  avgSped2: string;
  avgSped3: string;
  avgSped4: string;
  avgSped5: string;
  avgSped6: string;
  avgSped7: string;
  avgSped8: string;
  avgSped9: string;
  avgSped10: string;
  avgSped11: string;
  avgSped12: string;
  ucsdKncrAvgSped: string;
  trfv1: string;
  trfv2: string;
  trfv3: string;
  trfv4: string;
  trfv5: string;
  trfv6: string;
  trfv7: string;
  trfv8: string;
  trfv9: string;
  trfv10: string;
  trfv11: string;
  trfv12: string;
  ucsdKncrTrfv: string;
}
interface ResultAVC {
  list: AVC[];
  count: number;
  pageNo: number;
  numOfRows: number;
  pageSize: number;
  message: string;
  code: string;
}

export const getDataAvc = (): Promise<AxiosResponse<ResultAVC, any>> =>
  instanceAVC.get<ResultAVC>("", {
    params: {
      key: "7783395713",
      type: "json",
      totlDates: "20211016",
    },
  });
