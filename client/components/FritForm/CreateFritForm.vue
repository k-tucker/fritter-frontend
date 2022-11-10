
<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateFritForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/fritforms',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'fields', label: 'Form Fields (separated by commas)', value: ''}
      ],
      title: 'Create a FritForm',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully created a FritForm!';
        this.$set(this.alerts, message, 'success');
        this.$store.commit('updateFritForm');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
