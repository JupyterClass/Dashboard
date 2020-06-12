export default function ({ $axios, app }) {
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)


    if (code === 401 || code === 403) {
      app.$auth.logout();
    }

    return Promise.reject(error);
  })
}
