import React, { useRef, useEffect, useState } from "react";
import jsQR from "jsqr";
import styled from "styled-components";

const VideoWrapper = styled.div`
  position: relative;
  padding-top: 56.25%;
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Canvas = styled.canvas`
  border: 1px solid black;
  display: none;
`;

const Button = styled.button`
  margin: 16px;
  padding: 8px;
  font-size: 16px;
`;

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
          height: { ideal: 480 },
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
    <div style={{ maxWidth: 640, margin: "auto" }}>
      <VideoWrapper>
        <Video ref={videoRef} />
      </VideoWrapper>
      <Canvas ref={canvasRef} width={640} height={480} />
      {qrCode && <p>QR code content: {qrCode}</p>}
      <Button onClick={handleCameraSwitch}>Switch Camera</Button>
    </div>
  );
};

export default QRCodeReader;
