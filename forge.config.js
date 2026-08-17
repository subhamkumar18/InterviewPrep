const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true
  },

  rebuildConfig: {},

  makers: [
    // =========================
    // Windows
    // =========================
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {
        name: 'InterviewAI',
        setupExe: 'InterviewAI-Setup.exe'
      }
    },

    // =========================
    // macOS
    // =========================
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },

    // =========================
    // Ubuntu / Debian
    // =========================
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: {
        options: {
          maintainer: 'Interview AI',
          homepage: 'https://example.com',
          description: 'Interview AI desktop application',
          productName: 'Interview AI'
        }
      }
    }
  ],

  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    },

    new FusesPlugin({
      version: FuseVersion.V1,

      [FuseV1Options.RunAsNode]: false,

      [FuseV1Options.EnableCookieEncryption]: true,

      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,

      [FuseV1Options.EnableNodeCliInspectArguments]: false,

      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,

      [FuseV1Options.OnlyLoadAppFromAsar]: true
    })
  ]
};
