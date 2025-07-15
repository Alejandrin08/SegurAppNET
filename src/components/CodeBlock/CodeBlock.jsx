import { useState } from "react";
import "./CodeBlock.css"; 

const CodeBlock = ({ code, height = "200px" }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar: ", err);
    }
  };

  return (
    <div className="rectangle-black" style={{ height }}>
      <button
        className={`copy-button ${isCopied ? "copied" : ""}`}
        onClick={handleCopy}
      >
        {isCopied ? "✓ Copiado" : "Copiar"}
      </button>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
