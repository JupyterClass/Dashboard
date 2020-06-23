import dotenv from "dotenv";
dotenv.config();

const REQUIRED_ENV_VARS = [
  'BASE_URL',
  'SECRET',
  'DASHBOARD_PASSWORD',
];
const missingRequiredVars = REQUIRED_ENV_VARS.filter(envVar =>
  typeof process.env[envVar] === 'undefined'
);
if (missingRequiredVars.length > 0) {
  throw Error(`Missing required environment variables: [ ${missingRequiredVars} ]`);
}

export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios',
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '~/api/websocket',
  ],
  router: {
    middleware: ['auth']
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: process.env.BASE_URL
  },
  /*
  ** Build configuration
  */
  build: {
    babel: {
      plugins: [
        ['import', { libraryName: 'ant-design-vue', style: 'css' } ]
      ]
    },
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    },

    build: {
      transpile: ['@nuxtjs/auth']
    }
  },

  auth: {
    strategies: {
      customStrategy: {
        _scheme: '~/schemes/customScheme',
        endpoints: {
          login: { url: '/api/auth/login', method: 'post', propertyName: 'token' }
        },
        tokenRequired: true,
        tokenType: 'bearer',
        globalToken: true,
      }
    },
    plugins: [
      '~/plugins/socket.io',
    ]
  },

  serverMiddleware: [
    { path: '/api', handler: '~/api/index.js' }
  ],
}
