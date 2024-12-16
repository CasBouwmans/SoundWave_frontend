module.exports = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

    transform: {
        '\\.(png|jpg|jpeg|gif|svg)$': 'jest-transform-stub', // Mock afbeeldingen
      },
      testEnvironment: 'jsdom', // Zorg ervoor dat de testomgeving goed is ingesteld

};




