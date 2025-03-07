<template>
  <div class="chat text-center full-width">
    <div ref="history" class="chat-history">
      <div class="history-container">
        <transition-group name="slide">
          <speech
            v-for="speech in lastTexts"
            :key="speech.id"
            :style="{ transform: `translateY(${speech.transformY}px)` }"
            :text="speech.text"
          />
        </transition-group>
      </div>
    </div>
    <input
      ref="chatBox"
      v-model="currentText"
      type="text"
      class="chat-box"
      placeholder="Say something..."
      @keydown.enter="onEnter"
    />
  </div>
</template>

<script lang="ts">
import Speech from './Speech.vue'

const STEP = 30

let id = 0

export default {
  components: {
    Speech,
  },
  data() {
    return {
      lastTexts: [],
      dialogHistory: [],
      currentText: '',
    }
  },
  mounted() {
    this.initAutoscroll()
  },
  methods: {
    goTop() {
      const { history } = this.$refs
      if (!history) {
        return
      }
      const chatRect: ClientRect = history.getBoundingClientRect()
      const { bottom } = chatRect
      this.lastTexts.forEach((text, idx) => {
        text.transformY -= STEP
        if (text.transformY < -bottom) {
          const [removed] = this.lastTexts.splice(idx, 1)
          this.dialogHistory.push(removed)
        }
      })
    },
    initAutoscroll() {
      const goTop = () => this.goTop()
      setInterval(goTop, 2000)
    },
    checkMoveTop(transformCheck = 0) {
      let toTop = this.lastTexts.find(text => text.transformY === transformCheck)
      const nextPosition = transformCheck - STEP
      if (toTop) {
        this.checkMoveTop(nextPosition)
        toTop.transformY = nextPosition
      }
    },
    onEnter(event) {
      this.checkMoveTop()
      this.lastTexts.push({
        text: event.target.value,
        transformY: 0,
        id: id++,
      })
      this.currentText = ''
      this.$refs.chatBox.value = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.history-container {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.chat-history {
  width: 100%;
  height: 35%;
  position: fixed;
  pointer-events: none;
  top: 0;
  overflow: hidden;
}
.chat {
  position: absolute;
  bottom: 100%;
  margin-bottom: 16px;
}
.chat-box {
  width: 500px;
  font: normal 16px Volter;
  font-size: 15px;
  padding: 10px;
  border-radius: 5px;
  outline: none;
  box-shadow: 0 2px 4px rgba(#000, 0.25);
  border: 2px solid transparent;

  &:focus {
    border-color: #1c1c1c;
  }
}

@media screen and (max-width: 768px) {
  .chat-box {
    max-width: 90vw;
    border-radius: 10px;
    &::placeholder {
      text-align: center;
    }
  }
}
</style>
