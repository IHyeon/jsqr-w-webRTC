import { useState } from "react";
import QRCodeReader from "./QrCodeReader";

function App() {
  const [qr, setQr] = useState<string>("");

  return (
    <div className="App">
      <QRCodeReader hasCloseAction={true} setRecognizedData={setQr} />
    </div>
  );
}

export default App;
