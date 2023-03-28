import React, { useRef, useEffect, useState } from "react";
import jsQR from "jsqr";
import styled from "styled-components";

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

  return (
    <Container>
      <VideoContainer>
        <Video ref={videoRef} />
      </VideoContainer>
      <Canvas ref={canvasRef} width={640} height={640} />
      {qrCode && <QRCodeText>QR code content: {qrCode}</QRCodeText>}
      <SwitchButton onClick={handleCameraSwitch}>Switch Camera</SwitchButton>
    </Container>
  );
};


const Container = styled.div`
  height: 100vh;
  background-color: black;
  margin: auto;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Video = styled.video`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Canvas = styled.canvas`
  border: 1px solid black;
  display: none;
`;

const SwitchButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const QRCodeText = styled.p`
  color: white;
  font-size: 24px;
  text-align: center;
`;

export default QRCodeReader;
