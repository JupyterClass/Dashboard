import LocalScheme from '@nuxtjs/auth/lib/schemes/local';

export default class CustomScheme extends LocalScheme {
  // Override `fetchUser` method of `local` scheme
  async fetchUser (endpoint) {
    // Token is required but not available
    if (this.options.tokenRequired && !this.$auth.getToken(this.name)) {
      return
    }
    this.$auth.setUser({ id: 1, role: 'tm' });
  }
}
