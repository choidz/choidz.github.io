import React from "react";

export default function infoLink({ src, href }) {
  return (
    <div>
      <a href={href}>
        <img src={src} alt="icnoRow" width={20} height={20} />
      </a>
    </div>
  );
}


