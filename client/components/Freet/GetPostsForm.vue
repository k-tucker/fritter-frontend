<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'GetPostsForm',
  mixins: [InlineForm],
  data() {
    return {value: this.$store.state.filter};
  },
  methods: {
    async submit() {
      const freetUrl = this.value ? `/api/freets?author=${this.value}` : '/api/freets';
      const quoteUrl = this.value ? `/api/quotes?author=${this.value}` : '/api/quotes';
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

        this.$store.commit('updateFilter', this.value);
        this.$store.commit('updateFreets', fres);
        this.$store.commit('updateQuotes', qres);
      } catch (e) {
        if (this.value === this.$store.state.filter) {
          // This section triggers if you filter to a user but they
          // change their username when you refresh
          this.$store.commit('updateFilter', null);
          this.value = ''; // Clear filter to show all users' freets
          this.$store.commit('refreshFreets');
          this.$store.commit('refreshQuotes')
        } else {
          // Otherwise reset to previous filter
          this.value = this.$store.state.filter;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
