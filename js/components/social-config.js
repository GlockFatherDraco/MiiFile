// ┌─────────────┐
// │ Social Config│
// └─────────────┘
const SOCIAL_CONFIG = {
  discord: "https://discord.com/users/752594479902621736",
  youtube: "https://youtube.com/@glockfatherdraco",
  x: "https://x.com/glockfrdraco",
  github: "https://github.com/glockfatherdraco",
  tiktok: "https://tiktok.com/@glockfatherdraco"
};

// ┌─────────────┐
// │ Update Links │
// └─────────────┘
document.addEventListener('DOMContentLoaded', () => {
  Object.entries(SOCIAL_CONFIG).forEach(([platform, url]) => {
    const link = document.querySelector(`.social-link.${platform}`);
    if (link) link.href = url;
  });
});

// ┌─────────────┐
// │ Export (CJS)│
// └─────────────┘
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SOCIAL_CONFIG };
} 