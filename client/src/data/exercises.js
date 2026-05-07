export const exerciseLibrary = [
    {
        id: 'ex1',
        name: 'Quad Sets',
        muscleGroup: 'Quadriceps',
        description: 'Tighten your thigh muscle by pushing the back of your knee down into the bed.',
        steps: [
            { order: 1, instruction: 'Sit or lie down with your leg straight.' },
            { order: 2, instruction: 'Tighten the muscle on the top of your thigh.' },
            { order: 3, instruction: 'Hold for 5 seconds, then relax.' }
        ],
        mistakes: ['Holding your breath', 'Lifting your heel off the bed'],
        defaultReps: 10,
        defaultSets: 3,
        restSeconds: 30
    },
    {
        id: 'ex2',
        name: 'Glute Bridges',
        muscleGroup: 'Glutes/Hamstrings',
        description: 'Lying on your back, lift your hips towards the ceiling.',
        steps: [
            { order: 1, instruction: 'Lie on your back with knees bent and feet flat.' },
            { order: 2, instruction: 'Squeeze your glutes and lift your hips.' },
            { order: 3, instruction: 'Hold for 2 seconds, then slowly lower.' }
        ],
        mistakes: ['Arching your lower back too much', 'Feet too far from hips'],
        defaultReps: 12,
        defaultSets: 3,
        restSeconds: 45
    },
    {
        id: 'ex3',
        name: 'Wall Slides',
        muscleGroup: 'Shoulders/Scapula',
        description: 'Slide your arms up and down a wall while keeping your back flat.',
        steps: [
            { order: 1, instruction: 'Stand with your back against a wall.' },
            { order: 2, instruction: 'Place your arms in a "W" position against the wall.' },
            { order: 3, instruction: 'Slowly slide your arms up into a "Y" and back down.' }
        ],
        mistakes: ['Back coming off the wall', 'Shoulders shrugging up'],
        defaultReps: 10,
        defaultSets: 2,
        restSeconds: 30
    },
    {
        id: 'ex4',
        name: 'Ankle Pumps',
        muscleGroup: 'Calves',
        description: 'Move your feet up and down to improve circulation.',
        steps: [
            { order: 1, instruction: 'Sit or lie with legs straight.' },
            { order: 2, instruction: 'Point your toes away from you.' },
            { order: 3, instruction: 'Pull your toes back towards your shins.' }
        ],
        mistakes: ['Moving the whole leg instead of just the ankle'],
        defaultReps: 20,
        defaultSets: 3,
        restSeconds: 20
    }
];
