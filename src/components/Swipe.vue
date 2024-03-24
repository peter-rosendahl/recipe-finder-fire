<script setup>
import { useSwipe } from '@vueuse/core';
import { ref } from 'vue';
const el = ref(null);
const {isSwiping, direction} = useSwipe(el);
</script>

<style lang="scss" scoped>

</style>

<template>
    <div ref="el">
        <slot name="content"></slot>
    </div>
</template>
