import Dexie from 'dexie';

let db = new Dexie('jm-palette-picket');

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




// export const getprojects = (id) => {
//   return db.projects.get(parseInt(id));
// };
//
// export const getSinglePalette = (id) => {
//   return db.projects.get(parseInt(id));
// };
//
// export const loadOfflinePalettes = () => {
//   return db.markdownFiles.toArray();
// };
