module.exports = {
  httpPort: 0,
  studio: {
    enabled: false
  },
  allowLocalFilesAccess: true,
  store: {
    provider: "fs"
  },
  blobStorage: {
    provider: "fs"
  },
  reportTimeout: 60000,
  extensions: {
    authentication: {
      enabled: false
    },
    "sample-template": {
      createSamples: false
    },
    "fs-store": {
      syncModifications: false
    },
    "chrome-pdf": {
      launchOptions: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    }
  },
  license: {
    type: "open"
  }
};
