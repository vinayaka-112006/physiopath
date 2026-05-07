export const exerciseLibrary = [
    {
        id: 'ex1',
        name: 'Quad Sets',
        muscleGroup: 'Quadriceps',
        description: 'Activate the thigh muscle while the knee stays straight and supported.',
        steps: [
            { order: 1, instruction: 'Sit or lie with the target leg straight and supported.' },
            { order: 2, instruction: 'Press the back of the knee gently down toward the bed.' },
            { order: 3, instruction: 'Tighten the thigh for 5 seconds, then relax fully.' }
        ],
        mistakes: ['Holding your breath', 'Lifting your heel off the bed'],
        defaultReps: 10,
        defaultSets: 3,
        restSeconds: 30
    },
    {
        id: 'ex2',
        name: 'Glute Bridges',
        muscleGroup: 'Glutes / Hamstrings',
        description: 'Build hip and posterior-chain strength with a controlled hip lift.',
        steps: [
            { order: 1, instruction: 'Lie on your back with knees bent and feet flat, hip-width apart.' },
            { order: 2, instruction: 'Brace lightly, squeeze your glutes, and lift your hips.' },
            { order: 3, instruction: 'Pause for 2 seconds, then lower slowly with control.' }
        ],
        mistakes: ['Arching your lower back too much', 'Feet too far from hips', 'Pushing through the toes'],
        defaultReps: 12,
        defaultSets: 3,
        restSeconds: 45
    },
    {
        id: 'ex3',
        name: 'Wall Slides',
        muscleGroup: 'Shoulders / Scapula',
        description: 'Improve shoulder mobility while training smooth scapular control.',
        steps: [
            { order: 1, instruction: 'Stand with your back against a wall and ribs relaxed.' },
            { order: 2, instruction: 'Place your arms in a W position against the wall.' },
            { order: 3, instruction: 'Slide arms up into a Y, then return slowly.' }
        ],
        mistakes: ['Back coming off the wall', 'Shoulders shrugging up'],
        defaultReps: 10,
        defaultSets: 2,
        restSeconds: 30
    },
    {
        id: 'ex4',
        name: 'Ankle Pumps',
        muscleGroup: 'Calves / Circulation',
        description: 'Move the ankle through a gentle range to support circulation.',
        steps: [
            { order: 1, instruction: 'Sit or lie with both legs supported.' },
            { order: 2, instruction: 'Point your toes away from you.' },
            { order: 3, instruction: 'Pull your toes back toward your shins.' }
        ],
        mistakes: ['Moving the whole leg instead of the ankle', 'Rushing the motion'],
        defaultReps: 20,
        defaultSets: 3,
        restSeconds: 20
    },
    {
        id: 'ex5',
        name: 'Heel Slides',
        muscleGroup: 'Knee Mobility',
        description: 'Restore knee bending range with a slow heel slide.',
        steps: [
            { order: 1, instruction: 'Lie on your back with the leg straight.' },
            { order: 2, instruction: 'Slide your heel toward your hip as far as comfortable.' },
            { order: 3, instruction: 'Hold briefly, then slide back to the start.' }
        ],
        mistakes: ['Forcing painful range', 'Letting the knee fall inward'],
        defaultReps: 12,
        defaultSets: 3,
        restSeconds: 30
    },
    {
        id: 'ex6',
        name: 'Straight Leg Raise',
        muscleGroup: 'Quadriceps / Hip Flexors',
        description: 'Strengthen the front of the hip and thigh while protecting the knee.',
        steps: [
            { order: 1, instruction: 'Lie down with one knee bent and the working leg straight.' },
            { order: 2, instruction: 'Tighten the thigh of the straight leg.' },
            { order: 3, instruction: 'Lift to the height of the bent knee, then lower slowly.' }
        ],
        mistakes: ['Bending the working knee', 'Swinging the leg', 'Holding your breath'],
        defaultReps: 10,
        defaultSets: 3,
        restSeconds: 45
    },
    {
        id: 'ex7',
        name: 'Clamshells',
        muscleGroup: 'Hip Stabilizers',
        description: 'Train hip control with a small, precise side-lying movement.',
        steps: [
            { order: 1, instruction: 'Lie on your side with knees bent and feet together.' },
            { order: 2, instruction: 'Keep hips stacked and lift the top knee.' },
            { order: 3, instruction: 'Pause, then lower without rolling backward.' }
        ],
        mistakes: ['Rolling the hip backward', 'Separating the feet', 'Moving too quickly'],
        defaultReps: 12,
        defaultSets: 3,
        restSeconds: 35
    },
    {
        id: 'ex8',
        name: 'Seated Knee Extension',
        muscleGroup: 'Quadriceps',
        description: 'Build knee extension strength from a stable seated position.',
        steps: [
            { order: 1, instruction: 'Sit tall with feet flat and knees bent.' },
            { order: 2, instruction: 'Straighten one knee until the leg is nearly level.' },
            { order: 3, instruction: 'Pause, then lower slowly to the floor.' }
        ],
        mistakes: ['Hyperextending the knee', 'Leaning backward', 'Dropping the foot quickly'],
        defaultReps: 12,
        defaultSets: 3,
        restSeconds: 40
    }
];
