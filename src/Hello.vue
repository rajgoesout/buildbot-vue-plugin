<template>
  <div id="vueContent">
    <p>{{ greeting }} World!</p>
  </div>
</template>

<script>
export default {
  name: "Hello",
  data: function() {
    return {
      greeting: "Hello"
    };
  }
};
</script>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style>