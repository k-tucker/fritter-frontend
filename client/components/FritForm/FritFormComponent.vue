<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    {{ $store.state.fritform.fields }}
  </article>
</template>

<script>
export default {
  name: 'FritFormComponent',
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
.highlight {
    border: 5px solid rgb(52, 14, 105);
    background-color: rgb(190, 175, 211);
    padding: 20px;
    position: relative;
}
</style>
