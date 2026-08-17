const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,

    // Don't use one common icon here when cross-building.
    // Each platform gets its own icon through the appropriate maker.
  },

  rebuildConfig: {},

  makers: [
    // =========================
    // WINDOWS
    // =========================
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {
        name: 'InterviewAI',
        setupExe: 'InterviewAI-Setup.exe',
        setupIcon: './assets/icon.ico',
      },
    },

    // =========================
    // MACOS
    // =========================
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },

    // =========================
    // UBUNTU / DEBIAN
    // =========================
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: {
        options: {
          maintainer: 'Interview AI',
          homepage: 'https://example.com',
          description: 'Interview AI desktop application',
          productName: 'Interview AI',
        },
      },
    },

    // =========================
    // OPTIONAL RPM
    // =========================
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
    },
  ],

  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },

    new FusesPlugin({
      version: FuseVersion.V1,

      [FuseV1Options.RunAsNode]: false,

      [FuseV1Options.EnableCookieEncryption]: true,

      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,

      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,

      [FuseV1Options.EnableNodeCliInspectArguments]: false,

      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,

      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
