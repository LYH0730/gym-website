import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi) // 서버에서 번역 파일을 불러옵니다.
  .use(LanguageDetector) // 사용자의 브라우저 언어를 감지합니다.
  .use(initReactI18next) // i18n 인스턴스를 react-i18next에 전달합니다.
  .init({
    supportedLngs: ['ko', 'en'], // 지원할 언어 목록
    fallbackLng: 'ko', // 감지된 언어를 사용할 수 없을 때 사용할 기본 언어
    debug: true, // 개발 중 디버그 정보를 콘솔에 출력합니다.
    
    detection: {
      // 언어 감지 순서 및 방법 설정
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['cookie', 'localStorage'], // 감지된 언어를 저장할 위치
    },
    
    backend: {
      // 번역 파일의 경로
      loadPath: '/locales/{{lng}}/translation.json',
    },

    react: {
      // Suspense 사용 여부 (데이터 로딩 중 fallback UI)
      useSuspense: false,
    },
  });

export default i18n;
