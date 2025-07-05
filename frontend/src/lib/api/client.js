import axios from "axios";

const client = axios.create();

/*
  글로벌 설정예시

  //api 주소를 다른곳으로 사용함
  client.defaults.baseURL = 'https://api.example.com';
  //헤더 설정
  client.defaults.headers.common['Authorization'] = 'Bearer token';
  //인터셉터 설정
  client.interceptors.request.use(\
     response => {
        // 요청 성공시 특정 작업 수행 
        return response;
    },
    error => {
        // 요청 실패시 특정 작업 수행
        return Promise.reject(error);
    }
  );

*/


export default client;