<!-- Form for getting freets (all, from user) (inline style) -->
<!-- Should only be able to toggle filter between highlights or all -->

<script>

export default {
  name: 'GetUserPostsForm',
  data() {
    return {value: this.$store.state.username};
  },
  methods: {
    async submit() {
      // const freetUrl = this.value ? `/api/users/highlights?author=${store.state.username}` : `/api/freets?author=${store.state.username}`;
      // const quoteUrl = this.value ? `/api/users/highlights?author=${store.state.username}` : `/api/quotes?author=${store.state.username}`;
      const freetUrl = `/api/freets?author=${this.value}`;
      const quoteUrl = `/api/quotes?author=${this.value}`;
      // const followingUrl = `/api/users/follow`
      try {
        const fr = await fetch(freetUrl);
        const fres = await fr.json();
        if (!fr.ok) {
          throw new Error(fres.error);
        }
        const qr = await fetch(quoteUrl);
        const qres = await qr.json();
        if (!qr.ok) {
          throw new Error(qres.error);
        }
        // const flr = await fetch(followingUrl);
        // const flres = await flr.json();
        // if (!flr.ok) {
        //   throw new Error(flres.error);
        // }

        // this.$store.commit('updateFilter', this.value);
        this.$store.commit('updateFreets', fres);
        this.$store.commit('updateQuotes', qres);
        // this.$store.commit('updateFollowing', flres);
      } catch (e) {
        // if (this.value === this.$store.state.filter) {
        //   // This section triggers if you filter to a user but they
        //   // change their username when you refresh
        //   this.$store.commit('updateFilter', null);
        //   this.value = ''; // Clear filter to show all users' freets
        //   this.$store.commit('refreshFreets');
        //   this.$store.commit('refreshQuotes')
        // } else {
        //   // Otherwise reset to previous filter
        //   this.value = this.$store.state.filter;
        // }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
