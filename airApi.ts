import axios, { AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: "http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getMsrstnList",
});

interface Msrstn {
  stationName: string;
  addr: string;
  year: string;
  mangName: string;
  item: string;
  dmX: string;
  dmY: string;
}

interface BodyMsrstn {
  totalCount: number;
  items: Msrstn[];
  pageno: number;
  numOfRows: number;
}

interface HeaderBodyMsrtn {
  body: BodyMsrstn;
  header: any;
}

interface ResultMsrstn {
  response: HeaderBodyMsrtn;
}

export const getMsrstn = async (
  pageNo: number = 1
): Promise<AxiosResponse<ResultMsrstn, any>> =>
  instance.get<ResultMsrstn>("", {
    params: {
      serviceKey:
        "X7VhRALdifkkGij+LfmVbmnXX5dXWIUTQR7Ud4kOJ2qb5J3X5ZeQny+wahpR3ok1loY6K+2FMIHpRvJP2LPlZQ==",
      returnType: "json",
      numOfRows: "100",
      pageNo,
    },
  });

const instanceInformation = axios.create({
  baseURL: "http://apis.data.go.kr/B552584/ArpltnStatsSvc/getMsrstnAcctoRDyrg",
});

interface Air {
  msurDt: string;
  msrstnName: string;
  so2Value: string;
  coValue: string;
  o3Value: string;
  no2Value: string;
  pm10Value: string;
  pm25Value: string;
}

interface BodyAir {
  totalCount: number;
  items: Air[];
  pageno: number;
  numOfRows: number;
}

interface HeaderBodyAir {
  body: BodyAir;
  header: any;
}

interface ResultAir {
  response: HeaderBodyAir;
}

export const getAirData = (): Promise<AxiosResponse<ResultAir, any>> =>
  instanceInformation.get<ResultAir>("", {
    params: {
      serviceKey:
        "X7VhRALdifkkGij+LfmVbmnXX5dXWIUTQR7Ud4kOJ2qb5J3X5ZeQny+wahpR3ok1loY6K+2FMIHpRvJP2LPlZQ==",
      returnType: "json",
      numOfRows: "100",
      pageNo: "1",
      inqBginDt: "20210701",
      inqEndDt: " 20211001",
    },
  });
