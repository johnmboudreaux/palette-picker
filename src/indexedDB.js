import Dexie from 'dexie';

let db = new Dexie('jm-palette-picker');

db.version(1).stores({
  projects: 'id, title',
  palettes: 'id, name, color1, color2, color3, color4, color5, projectId'
});

export const saveOfflineProjects = (project) => {
  return db.projects.add(project);
};

export const saveOfflinePalettes = (palette) => {
  return db.palettes.add(palette);
};

export const loadOfflineProjects = () => {
  return db.projects.toArray();
};

export const loadOfflinePalettes = (id) => {
  return db.palettes.where('projectId').equals(id).toArray();
};
