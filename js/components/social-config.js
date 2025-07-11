// ┌─────────────┐
// │ Social Config│
// └─────────────┘
const SOCIAL_CONFIG = {
  discord: { url: "https://discord.com/users/752594479902621736", enabled: true },
  youtube: { url: "https://youtube.com/@glockfatherdraco", enabled: true },
  x: { url: "https://x.com/glockfrdraco", enabled: true },
  github: { url: "https://github.com/glockfatherdraco", enabled: true },
  spotify: { url: "https://open.spotify.com/user/31g7lhonzd4u6fuzvggjkl6rumoy?si=711df59767964057", enabled: true }
};

// ┌─────────────┐
// │ Update Links │
// └─────────────┘
const updateSocialLinks = () => {
  Object.keys(SOCIAL_CONFIG).forEach(p => {
    const c = SOCIAL_CONFIG[p];
    const l = document.querySelector(`.social-link.${p}`);
    if (l) {
      if (c.enabled) {
        l.href = c.url;
        l.style.display = 'flex';
      } else {
        l.style.display = 'none';
      }
    }
  });
};

// ┌─────────────┐
// │ Initialize   │
// └─────────────┘
document.addEventListener('DOMContentLoaded', updateSocialLinks);

// ┌─────────────┐
// │ Export (CJS)│
// └─────────────┘
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SOCIAL_CONFIG, updateSocialLinks };
} 