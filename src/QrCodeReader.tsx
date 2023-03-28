import React, { useRef, useEffect, useState } from "react";
import jsQR from "jsqr";
import { AnimatePresence, motion } from "framer-motion";

import {
  CameraContainer,
  Canvas,
  ChangeCamera,
  Container,
  ExitCamera,
  LoadingText,
  QRCodeText,
  QrDetailGuideText,
  QrGuideText,
  SwitchButton,
  Video,
  VideoAreaSection,
  VideoContainer,
  VideoViewSection,
} from "./qr.style";
import closeIcon from "./assets/icons/white-close.png";
import changeIcon from "./assets/icons/camera-change.svg";

const QRCodeReader = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrCode, setQRCode] = useState<string | null>(null);
  const [isFrontFacingCamera, setIsFrontFacingCamera] = useState(true);

  useEffect(() => {
    if (!videoRef.current) return;

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: isFrontFacingCamera ? "user" : "environment",
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Wait until the video stream is ready to play.
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
          };
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [videoRef, isFrontFacingCamera]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const interval = setInterval(() => {
      // Draw the video frame to the canvas.
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // QR code recognition
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = findQRCode(
        imageData.data,
        imageData.width,
        imageData.height
      );
      if (qrCode) {
        setQRCode(qrCode);
        clearInterval(interval);
      }
    }, 1000 / 30);

    return () => {
      clearInterval(interval);
    };
  }, [canvasRef, videoRef]);

  const handleCameraSwitch = () => {
    setIsFrontFacingCamera((prevState) => !prevState);
  };

  const findQRCode = (
    data: Uint8ClampedArray,
    width: number,
    height: number
  ): string | null => {
    const code = jsQR(data, width, height);
    if (code) {
      return code.data;
    }
    return null;
  };

//TODO: props 생성하기 (qrcode?)

  return (
    <Container>
      <CameraContainer>
        <ExitCamera src={closeIcon} onClick={() => console.log("asdf")} />
        <ChangeCamera src={changeIcon} onClick={handleCameraSwitch} />
        <LoadingText>카메라 띄우는 중...</LoadingText>
        <QrGuideText>QR 코드를 스캔해주세요</QrGuideText>
        <QrDetailGuideText>
          어둡다면, 모바일 플래쉬를 켜주세요.
        </QrDetailGuideText>
        <VideoContainer>
          <VideoAreaSection>
            <VideoViewSection>
              <div className="guide" />
              <Video ref={videoRef} />
            </VideoViewSection>
          </VideoAreaSection>
        </VideoContainer>
        <Canvas ref={canvasRef} width={640} height={640} />
        {qrCode && <QRCodeText>QR code content: {qrCode}</QRCodeText>}
      </CameraContainer>
    </Container>
  );
};

export default QRCodeReader;
