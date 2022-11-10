<!-- Form for getting freets (all, from user) (inline style) -->
<!-- Should only be able to toggle filter between highlights or all -->
<template>

</template>

<script>

export default {
  name: 'GetFritForm',
  data() {
    return {value: this.$store.state.username};
  },
  methods: {
    async submit() {
      try {
        const url = '/api/fritforms';
        const res = await fetch(url).then(async r => r.json());
        if (!res.ok) {
          this.$store.commit('updateFritForm', null);
        } else {
          this.$store.commit('updateFritForm', res);
        }
      } catch (e) {
        this.$store.commit('refreshFritForm');
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>
