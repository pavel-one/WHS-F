<template>
  <vs-row>
      <vs-col :w="2">
        <notes-changer ref="changer-component" :current="{
          id: currentID,
          name: name,
          description: description
        }" @changeNote="changePage"></notes-changer>
      </vs-col>
      <vs-col :w="9" :offset="1">
        <input style="margin-bottom: 10px; margin-left: 40px" type="text" class="title-input editable" v-model="name">
        <input style="margin-bottom: 30px; margin-left: 40px" type="text" class="subtitle-input editable" v-model="description">
        <editor ref="editor" :config="config" :init-data="editor"></editor>
        <pre>{{ editor }}</pre>
      </vs-col>
  </vs-row>
</template>

<script>
import NotesChanger from "@components/notes-changer";

export default {
  components: {NotesChanger},
  data() {
    return {
      name: '',
      description: null,
      currentID: this.$store.state.post,
      editor: {},
      config: {
        placeholder: 'Начни вводить...',
        tools: {
          header: require('@editorjs/header'),
          list: require('@editorjs/list'),
          checklist: require('@editorjs/checklist'),
          link: require('@editorjs/link'),
          delimiter: require('@editorjs/delimiter'),
          image: require('@editorjs/image'),
          codebox: require('@/vendor/codebox/dist/index.min'),
          table: require('editorjs-table'),
          attaches: require('@editorjs/attaches'),
          marker: require('@editorjs/marker'),
          inlineCode: require('@editorjs/inline-code'),
        },
        onChange: async (args) => {
          const data = await this.$refs.editor._data.state.editor.save()

          this.editor = data
          if (data.blocks.length === 0) {
            return
          }

          let request = {}

          if (this.currentID === 0) {
            request = {
              name: this.name,
              description: this.description,
              data: this.editor
            }
          } else {
            request = {
              id: this.currentID,
              name: this.name,
              description: this.description,
              data: this.editor
            }
          }

          const response = await this.$api.createOrUpdatePost(request)

          if (response.id) {
            await this.$refs["changer-component"].loadData()
            this.currentID = response.id

            if (!response.id !== this.$store.state.post) {
              this.$store.commit('CHANGE_POST', response.id)
            }
          }
        },
      }
    }
  },
  methods: {
    changePage: function (e) {
      this.editor = e.data ?? null
      this.name = e.name
      this.description = e?.description
      this.currentID = e.id

      if (!e.id !== this.$store.state.post) {
        this.$store.commit('CHANGE_POST', e.id)
      }

      if (!this.editor) {
        this.$refs.editor._data.state.editor.clear()
        return
      }

      this.$refs.editor._data.state.editor.render(this.editor)
    },
  }
}
</script>