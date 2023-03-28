import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  background-color: black;
`;

export const CameraContainer = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-align-items: flex-end;
  -webkit-box-align: flex-end;
  -ms-flex-align: flex-end;
  align-items: flex-end;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  z-index: 2000;
`;


export const LoadingText = styled.p`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-size: 14px;
  line-height: 24px;
  font-weight: 500;
  z-index: 1;
`;

export const ExitCamera = styled.img`
  position: fixed;
  width: 28px;
  height: 28px;
  top: 20px;
  left: 20px;
`;

export const ChangeCamera = styled.img`
  position: fixed;
  width: 28px;
  height: 28px;
  top: 20px;
  right: 20px;
`;

export const QrGuideText = styled.p`
  min-width: 200px;
  position: fixed;
  text-align: center;
  top: 13%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-size: 18px;
  line-height: 24px;
  font-weight: 700;
  z-index: 3;
`;

export const QrDetailGuideText = styled.p`
  min-width: 200px;
  text-align: center;
  position: fixed;
  top: 19%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-size: 14px;
  line-height: 24px;
  font-weight: 400;
  z-index: 3;
`;

export const VideoContainer = styled.div`
  width: 100%;
  height: 75%;
  position: fixed;
  z-index: 2;
  display: flex;
  justify-content: center;
  transform: none;
`;

export const VideoAreaSection = styled.section`
  display: block;
  width: 100%;
  max-width: 480px;
`;

export const VideoViewSection = styled.section`
  overflow: hidden;
  position: relative;
  width: 100%;
  padding-top: 100%;

  & > .guide {
    top: 0;
    left: 0;
    z-index: 1;
    box-sizing: border-box;
    border: 70px solid rgba(0, 0, 0, 0.3) !important;
    box-shadow: inset 0 0 0 5px rgba(255, 255, 255, 1) !important;
    width: 100%;
    height: 100%;
    position: absolute;
  }
`;

export const Video = styled.video`
  top: 0px;
  left: 0px;
  display: block;
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Canvas = styled.canvas`
  border: 1px solid black;
  display: none;
`;

export const SwitchButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
`;

export const QRCodeText = styled.p`
  color: white;
  font-size: 24px;
  text-align: center;
`;

