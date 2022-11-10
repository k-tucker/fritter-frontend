<!-- Form for deleting account (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'DeleteFritForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/fritforms',
      method: 'DELETE',
      setUsername: true,
      title: 'Delete FritForm',
      fields: [],
      content: 'Deleting your FritForm is permanent and irreversible. Proceed only if you understand these consequences.',
      callback: () => {
        this.$router.push({name: 'Profile'}); // Goes to Home page after deleting account
        this.$store.commit('refreshFritForm');
        this.$store.commit('alert', {
          message: 'Your FritForm has been deleted!', status: 'success'
        });
      }
    };
  }
};
</script>
