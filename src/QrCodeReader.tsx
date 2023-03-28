import React, { useRef, useEffect, useState } from "react";
import jsQR from "jsqr";

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
          height: { ideal: 480 }
        },
      })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // 비디오 스트림이 재생 준비될 때까지 대기합니다.
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
      // 비디오 프레임을 캔버스에 그립니다.
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // QR 코드 인식 처리
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
      <div style={{ position: "relative", paddingTop: "56.25%" }}>
        <video
          ref={videoRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ border: "1px solid black", display: "none" }}
      />
      {qrCode && <p>QR code content: {qrCode}</p>}
      <button onClick={handleCameraSwitch}>switch</button>
    </div>
  );
};

export default QRCodeReader;
