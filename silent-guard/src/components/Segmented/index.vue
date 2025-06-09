<template>
  <view class="segmented-container" :class="{ 'segmented-block': block }">
    <view class="segmented-inner" :class="{ 'segmented-disabled': disabled }">
      <view
        v-for="option in options"
        :key="option.value"
        class="segmented-item"
        :class="{
          'segmented-item-active': currentValue === option.value,
          'segmented-item-disabled': option.disabled
        }"
        @click="handleOptionClick(option)"
      >
        <text class="segmented-label">{{ option.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    options: Option[]
    modelValue?: string | number
    block?: boolean
    disabled?: boolean
  }>(),
  {
    options: () => [],
    block: false,
    disabled: false
  }
)

const emit = defineEmits(['update:modelValue', 'change'])

const currentValue = ref(
  props.modelValue !== undefined
    ? props.modelValue
    : props.options[0]?.value ?? ''
)

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== undefined && newVal !== currentValue.value) {
      currentValue.value = newVal
    }
  }
)

const handleOptionClick = (option: Option) => {
  if (props.disabled || option.disabled) return
  currentValue.value = option.value
  emit('update:modelValue', option.value)
  emit('change', option.value)
}
</script>

<style lang="scss">
.segmented {
  @keyframes glow {
    0% {
      box-shadow: 0 0 20px rgba(0, 102, 255, 0.3),
        inset 0 0 10px rgba(255, 255, 255, 0.1);
    }
    50% {
      box-shadow: 0 0 25px rgba(0, 102, 255, 0.5),
        inset 0 0 15px rgba(255, 255, 255, 0.2);
    }
    100% {
      box-shadow: 0 0 20px rgba(0, 102, 255, 0.3),
        inset 0 0 10px rgba(255, 255, 255, 0.1);
    }
  }
  &-container {
    margin-top: 25px;
    display: inline-block;
    &.segmented-block {
      display: block;
      width: 100%;
    }
  }

  &-inner {
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 8px;
  }

  &-item {
    flex: 1;
    position: relative;
    text-align: center;
    min-height: 60px;
    line-height: 60px;
    border-radius: 12px;
    transition: all 0.6s cubic-bezier(0.65, 0, 0.35, 1);
    color: #ffffff;
    margin: 0 4px;
    cursor: pointer;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);

    &:active {
      background-color: rgba(255, 255, 255, 0.1);
      transition: background-color 0.2s ease-out;
    }

    &-active {
      background-color: #0066ff;
      color: #ffffff;
      box-shadow: 0 0 20px rgba(0, 102, 255, 0.4);
      animation: glow 2s infinite ease-in-out;
    }

    &-disabled {
      color: rgba(255, 255, 255, 0.35);
      cursor: not-allowed;
      animation: none;
      transform: none;
    }
  }

  &-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &-label {
    font-size: 20px;
  }
}
</style>
