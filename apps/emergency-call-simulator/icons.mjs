const paths = {
  phone: '<path d="M6 3 3 5c-2 4 4 13 10 16 3 1 6-1 7-3l-5-4-3 2c-2-1-4-3-5-5l2-3Z"/>',
  message: '<path d="M21 11a9 8 0 0 1-14 7l-5 2 2-5A9 8 0 1 1 21 11Z"/>',
  camera: '<path d="M3 7h4l2-3h6l2 3h4v14H3Z"/><circle cx="12" cy="13" r="4"/>',
  photos: '<circle cx="12" cy="12" r="3"/><path d="M12 9c-8-11 8-11 0 0m3 3c11-8 11 8 0 0m-3 3c8 11-8 11 0 0m-3-3c-11 8-11-8 0 0"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 2v6m10-6v6M3 10h18m-13 4h2v4m5-4h2v4"/>',
  maps: '<path d="m2 6 6-3 8 3 6-3v16l-6 3-8-3-6 3Zm6-3v16m8-13v16"/><path d="m10 12 6-3-2 6-1-2Z"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="m16 8-3 5-5 3 3-5Z"/>',
  settings: '<path d="m9 3 1-2h4l1 2 3 2 3 1 1 4-2 2v3l1 3-3 3-3-1h-3l-2 2-4-1-1-3-2-3-2-1v-4l2-1 2-3 1-3Z"/><circle cx="12" cy="12" r="4"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 5v7l4 3"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 6 9 7 9-7"/>',
  music: '<path d="M9 18V5l11-2v13M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="17" cy="16" rx="3" ry="2"/>',
  mic: '<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/>',
  speaker: '<path d="M3 9h4l5-5v16l-5-5H3Zm13-2a8 8 0 0 1 0 10m3-13a12 12 0 0 1 0 16"/>',
  headset: '<path d="M3 14v-3a9 9 0 0 1 18 0v6q0 5-7 5"/><rect x="2" y="10" width="5" height="9" rx="2"/><rect x="17" y="10" width="5" height="9" rx="2"/>',
  delete: '<path d="M9 4h13v16H9l-8-8Zm3 5 6 6m0-6-6 6"/>',
};
export const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || ''}</svg>`;
