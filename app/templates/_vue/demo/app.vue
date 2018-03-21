<template>
  <h1 v-text="message"></h1>
</template>

<script>
export default {
  data() {
    return {
      message: 'hello, world',
    };
  },
};
</script>

<style>
h1 {
  color: blue;
}
</style>
