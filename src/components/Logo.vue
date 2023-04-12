<template>
  <span class="potencial-logo">
    potencial.s
    <span class="symbol">o</span>
    lar
  </span>
</template>

<style lang="scss" scoped>
.potencial-logo {
  font-weight: bold;
  z-index: 1;

  .symbol {
    display: inline-block;
    background: #fbbb62;
    vertical-align: bottom;
    margin: 0 0.05em 0.2em;
    height: 0.65em;
    width: 0.65em;
    border-radius: 50%;
    text-indent: -9999px;
    position: relative;
    box-shadow: 0 0 0 0.3em #fbbb6266;
    z-index: -1;
  }
}
</style>
