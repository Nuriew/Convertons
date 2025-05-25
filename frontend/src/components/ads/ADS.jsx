import React from "react";
import "./ADS.css";
function BannerAd() {
  return (
    <div className="bannerAdBar">
      <div className="bannerAd">
        <strong>Banner Reklam Alanı</strong>
      </div>
    </div>
  );
}

// Kenar kutu reklam (sidebar vs.)
function SidebarAd() {
  return (
    <div>
      <strong>Sidebar Reklam Alanı</strong>
    </div>
  );
}

// Küçük içeriğe gömülü reklam
function InlineAd() {
  return (
    <div className="inlineAd">
      <strong>İçerik İçi Reklam</strong>
    </div>
  );
}

// Dışa aktarma
export { BannerAd, SidebarAd, InlineAd };
