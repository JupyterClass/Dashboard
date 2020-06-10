require('dotenv').config({ path: '.env' });

const baseUrl = (process.env.HOST && process.env.PORT)
  ? (process.env.HOST + ':' + process.env.PORT)
  : 'http://localhost:3000';

console.log('🚀 BASE URL', baseUrl);

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
    baseURL: baseUrl.startsWith('http') ? baseUrl : 'http://' + baseUrl
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
    }
  },

  serverMiddleware: [
    { path: '/api', handler: '~/api/index.js' }
  ],

  env: {
    baseUrl
  }
}
