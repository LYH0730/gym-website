import React, { useEffect } from 'react';

const KakaoMap = () => {
  useEffect(() => {
    const kakaoMapScript = document.createElement('script');
    kakaoMapScript.async = false;
    kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_APP_KEY}&autoload=false`;
    document.head.appendChild(kakaoMapScript);

    const onLoadKakaoAPI = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.551299479, 127.143145274), // Updated coordinates
          level: 3,
          scrollwheel: false,
        };
        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        // 마커를 생성합니다
        const marker = new window.kakao.maps.Marker({
          position: map.getCenter(),
        });

        // 마커가 지도 위에 표시되도록 설정합니다
        marker.setMap(map);
      });
    };

    kakaoMapScript.addEventListener('load', onLoadKakaoAPI);

    return () => {
      // 컴포넌트가 언마운트될 때 스크립트 태그를 제거할 수 있습니다.
      // 하지만 다른 페이지에서도 맵을 사용한다면 굳이 제거할 필요는 없습니다.
      // document.head.removeChild(kakaoMapScript);
    };
  }, []);

  return (
    <div
      id="map"
      style={{
        width: '100%',
        height: '500px', // Increased height
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      }}
    ></div>
  );
};

export default KakaoMap;
