<template>
  <div class="changer">
    <vs-button block @click="newPage">
      <i class='bx bx-plus'></i> Добавить
    </vs-button>
    <transition-group ref="content" name="slide-fade">
      <div v-if="current.id === 0" :key="0" class="item active">
        <div class="name">
          {{ current.name }}
        </div>
        <div class="description">
          {{ current.description }}
        </div>
        <div class="updated">
          Не сохранено
        </div>
        <div class="actions">
          <!--
          <vs-button color="primary"
                     icon
                     floating
                     gradient
                     size="mini"
                     circle>
            <i class='bx bx-sync'></i>
          </vs-button>
          -->
          <vs-tooltip>
            <vs-button color="danger"
                       icon
                       floating
                       gradient
                       size="mini"
                       @click="remove"
                       circle>
              <i class='bx bx-trash'></i>
            </vs-button>
            <template #tooltip>
              Оистить
            </template>
          </vs-tooltip>
        </div>
      </div>
      <div class="item" :ref="note.id"  :class="{active: note.id === current.id}" @click="click(note)" v-for="note in notes" :key="note.id">
        <div class="name">
          {{ note.name }}
        </div>
        <div class="description">
          {{ note.description }}
        </div>
        <div class="updated">
          {{ note.date }}
        </div>
        <div class="actions">
          <!--
          <vs-button color="primary"
                     icon
                     floating
                     gradient
                     size="mini"
                     circle>
            <i class='bx bx-sync'></i>
          </vs-button>
          -->
            <vs-button color="dark"
                       border
                       icon
                       floating
                       gradient
                       size="mini"
                       circle>
              <i class='bx bxs-share-alt'></i>
            </vs-button>

            <vs-button color="danger"
                       icon
                       floating
                       gradient
                       size="mini"
                       @click.stop="remove(note.id)"
                       circle>
              <i class='bx bx-trash'></i>
            </vs-button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    current: {
      type: Object,
      default: {
        id: 0,
        name: 'Без имени',
        description: 'Без описания',
        data: null
      }
    }
  },
  data() {
    return {
      notes: []
    }
  },
  methods: {
    loadData: async function () {
      this.notes = await this.$api.getPosts()
    },
    remove: async function (id) {
      // this.notes.forEach((item, index) => {
      //   if (item.id === id) {
      //     this.notes.splice(index, 1)
      //   }
      // })

      if (this.current.id === id) {
        this.newPage()
      }

      const loading = this.$vs.loading({
        target: this.$refs[id][0],
        scale: '0.6',
        background: '#f4f7f8',
        opacity: 0.8,
      })

      await this.$api.dropPost(id)
      await this.loadData()
      loading.close()
    },
    click: function (note) {
      this.$emit('changeNote', note)
    },
    newPage: function () {
      this.$emit('changeNote', {
        id: 0,
        name: 'Без имени',
        description: 'Без описания',
        data: null
      })
    }
  },
  mounted() {
    const loading = this.$vs.loading({
      target: this.$refs.content,
      scale: '0.6',
      background: '#f4f7f8',
      opacity: 0.8,
    })

    this.loadData()
    setTimeout(() => {
      if (String(this.current.id) === '0' || this.notes === null) {
        this.newPage()
      } else {
        this.notes.forEach(item => {
          if (item.id === this.current.id) {
            this.click(item)
          }
        })
      }
      loading.close()
    }, 800)
  }
}
</script>

<style lang="scss" scoped>
.changer {
  height: 500px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 0 8px;

  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-track {
    background: #eee;
  }

  &::-webkit-scrollbar-thumb {
    background: #dde7ff;
  }

  .item {
    margin: .5em 0;
    transition: .25s;
    padding: 10px;
    position: relative;

    .actions {
      display: flex;
      flex-direction: row;
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      align-items: center;
      opacity: 0;
      transition: .15s;

      .vs-button {
        i {
          font-size: 1.2em;
        }
      }
    }

    .name {
      font-weight: bold;
      color: rgb(25, 91, 255);
    }

    .description {
      font-size: .9em;
      color: #999;
    }

    .updated {
      color: #777;
      margin-top: 5px;
    }

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }

    &.active, &:hover {
      cursor: pointer;
      background: #dde7ff;
      box-shadow: 3px 3px 10px rgba(#dde7ff, .7);

      .actions {
        opacity: 1;
      }
    }
  }
}
</style>