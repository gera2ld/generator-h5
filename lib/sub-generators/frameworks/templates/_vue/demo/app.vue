<template>
  <div class="container mx-auto px-4">
    <div class="bg-green-200 p-4">
      <div class="bg-green-400 p-4" v-text="message"></div>
    </div>
  </div>
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
