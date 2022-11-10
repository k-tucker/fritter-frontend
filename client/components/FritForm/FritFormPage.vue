<!-- Displays a user's profile page -->

<template>
  <main>
    <section>
      <ProfileHeader />
      <CreateFritForm 
        v-if="!$store.state.fritform"
      />
      <GetFritForm
        ref="getFritForm"
      />
      <FritFormComponent 
        v-if="$store.state.fritform"
      />
      <DeleteFritForm 
        v-if="$store.state.fritform"
      />
    </section>
  </main>
</template>

<script>
import GetFritForm from '@/components/FritForm/GetFritForm.vue';
import ProfileHeader from '@/components/Profile/ProfileHeader.vue';
import CreateFritForm from '@/components/FritForm/CreateFritForm.vue';
import FritFormComponent from '@/components/FritForm/FritFormComponent.vue';
import DeleteFritForm from '@/components/FritForm/DeleteFritForm.vue';

export default {
  name: 'FritFormPage',
  components: {GetFritForm, ProfileHeader, CreateFritForm, FritFormComponent, DeleteFritForm},
  mounted() {
    this.$refs.getFritForm.submit();
  },
  computed: {
    console: () => console,
    window: () => window,
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
