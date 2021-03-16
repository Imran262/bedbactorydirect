<template>
  <div class="main">
    <div class="container">
      <MainMenuBlock :identifier="'main_menu'" />
    </div>
  </div>
</template>

<script>
import MainMenuBlock from "theme/components/core/blocks/Cms/MainMenuBlock";
export default {
  name: "MainMenu",
  components: {
    MainMenuBlock,
  },
};
</script>

<style scoped>
.main {
  background-color: #29275b;
}
</style>
