const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,

    // Forge/Electron Packager will use:
    // macOS  -> assets/icon.icns
    // Windows -> assets/icon.ico
    // Linux   -> assets/icon.png
   // icon: './assets/icon',
  },

  rebuildConfig: {},

  makers: [
    // Windows
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'InterviewAI',
        setupExe: 'InterviewAI-Setup.exe',
        setupIcon: './assets/icon.ico',
      },
    },

    // macOS
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },

    // Ubuntu / Debian
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

    // Optional RPM Linux package
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

      [FuseV1Options.EnableNodeCliInspectArguments]: false,

      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,

      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
