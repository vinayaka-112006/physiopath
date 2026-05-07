const normalizeExerciseName = (name = '') => name.toLowerCase().replace(/[^a-z0-9]/g, '');

const exerciseDemoMap = {
    quadsets: '/exercisesgif/quadsets.mp4',
    glutebridges: '/exercisesgif/glutebridges.mp4',
    wallslides: '/exercisesgif/wallslides.mp4',
    anklepumps: '/exercisesgif/anklepumps.mp4',
    heelslides: '/exercisesgif/heelslides.mp4',
    straightlegraise: '/exercisesgif/straightlegraise.mp4',
    straightlegraises: '/exercisesgif/straightlegraise.mp4',
    clamshells: '/exercisesgif/clamshells.mp4',
    seatedkneeextension: '/exercisesgif/seatedkneeExtension.mp4'
};

export const getExerciseDemoUrl = (exerciseName) => exerciseDemoMap[normalizeExerciseName(exerciseName)] || null;
